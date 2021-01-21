const knex = require('knex');
const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');
const { makeStatementsArray } = require('./statements.fixtures');
const { makeClientsArray } = require('./clients.fixtures');
const { makeTemplatesArray } = require('./worksheetTemplates.fixtures');
const { makeWorksheetsArray } = require('./worksheets.fixtures');

describe('Worksheets endpoints', () => {
  let db;
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE worksheets, statements, templates, clients RESTART IDENTITY CASCADE'));

  afterEach('cleanup', () => db.raw('TRUNCATE worksheets, statements, templates, clients RESTART IDENTITY CASCADE'));

  describe('GET /api/worksheets', () => {
    context('Given no worksheets', () => {
      it('responds with 200 and an empty list', () => supertest(app)
        .get('/api/worksheets')
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(200, []));
    });

    context('Given there are worksheets in the database', () => {
      const testClients = makeClientsArray();
      const testStatements = makeStatementsArray();
      const testTemplates = makeTemplatesArray();
      const testWorksheets = makeWorksheetsArray();

      beforeEach('test worksheets', () => db
        .into('clients')
        .insert(testClients)
        .then(() => db
          .into('statements')
          .insert(testStatements))
        .then(() => db
          .into('templates')
          .insert(testTemplates))
        .then(() => db
          .into('worksheets')
          .insert(testWorksheets)));

      it('responds with 200 and all of the worksheets', () => supertest(app)
        .get('/api/worksheets')
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(200, testWorksheets));
    });
  });
  describe('GET /api/worksheets/:worksheetId', () => {
    context('Given no worksheets', () => {
      it('responds with 404', () => {
        const worksheetId = 42;
        return supertest(app)
          .get(`/api/worksheets/${worksheetId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(404, { error: { message: "Worksheet doesn't exist" } });
      });
    });
    context('Given there are worksheets in the database', () => {
      const testClients = makeClientsArray();
      const testStatements = makeStatementsArray();
      const testTemplates = makeTemplatesArray();
      const testWorksheets = makeWorksheetsArray();

      beforeEach('test worksheets', () => db
        .into('clients')
        .insert(testClients)
        .then(() => db
          .into('statements')
          .insert(testStatements))
        .then(() => db
          .into('templates')
          .insert(testTemplates))
        .then(() => db
          .into('worksheets')
          .insert(testWorksheets)));

      it('responds with 200 and the specified worksheet', () => {
        const worksheetId = 1;
        const expectedWorksheet = testWorksheets[worksheetId - 1];
        return supertest(app)
          .get(`/api/worksheets/${worksheetId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, expectedWorksheet);
      });
    });
  });
  describe('POST /api/worksheets', () => {
    const testClients = makeClientsArray();
    const testStatements = makeStatementsArray();
    const testTemplates = makeTemplatesArray();

    beforeEach('test worksheets', () => db
      .into('clients')
      .insert(testClients)
      .then(() => db
        .into('statements')
        .insert(testStatements))
      .then(() => db
        .into('templates')
        .insert(testTemplates)));

    it('creates a worksheet, responding with 201 and the new worksheet', () => {
      const newWorksheet = {
        clientId: 1,
        templateId: 1,
        statementDataId: 1,
      };
      return supertest(app)
        .post('/api/worksheets')
        .send(newWorksheet)
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(201)
        .expect((res) => {
          expect(res.body.clientId).to.eql(newWorksheet.clientId);
          expect(res.body.templateId).to.eql(newWorksheet.templateId);
          expect(res.body.statementDataId).to.eql(newWorksheet.statementDataId);
          expect(res.body).to.have.property('id');
          expect(res.headers.location).to.eql(`/api/worksheets/${res.body.id}`);
          const expectedModified = new Intl.DateTimeFormat('en-US').format(new Date());
          const actualModified = new Intl.DateTimeFormat('en-US').format(new Date(res.body.modified));
          expect(actualModified).to.eql(expectedModified);
        })
        .then((res) => {
          supertest(app)
            .get(`/api/worksheets/${res.body.id}`)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(res.body);
        });
    });
  });
});
