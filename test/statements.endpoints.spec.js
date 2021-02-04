const knex = require('knex');
const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');
const { makeStatementsArray } = require('./statements.fixtures');
const { makeClientsArray } = require('./clients.fixtures');
const personalStatement = require('./personalStatement.json');
const personalStatement2 = require('./personalStatement2.json');

describe('Statements endpoints', () => {
  let db;
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE statements, clients RESTART IDENTITY CASCADE'));

  afterEach('cleanup', () => db.raw('TRUNCATE statements,clients RESTART IDENTITY CASCADE'));

  describe('GET /api/statements', () => {
    context('Given no statements', () => {
      it('responds with 200 and an empty list', () => supertest(app)
        .get('/api/statements')
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(200, []));
    });

    context('Given there are statements in the database', () => {
      const testClients = makeClientsArray();
      const testStatements = makeStatementsArray();

      beforeEach('test statements', () => db
        .into('clients')
        .insert(testClients)
        .then(() => db
          .into('statements')
          .insert(testStatements)));

      it('responds with 200 and all of the statements', () => supertest(app)
        .get('/api/statements')
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(200, testStatements));
    });
  });
  describe('GET /api/statements/:statementId', () => {
    context('Given no statements', () => {
      it('responds with 404', () => {
        const statementId = 42;
        return supertest(app)
          .get(`/api/statements/${statementId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(404, { error: { message: "Statement doesn't exist" } });
      });
    });
    context('Given there are statements in the database', () => {
      const testClients = makeClientsArray();
      const testStatements = makeStatementsArray();

      beforeEach('insert statements', () => db
        .into('clients')
        .insert(testClients)
        .then(() => db
          .into('statements')
          .insert(testStatements)));

      it('responds with 200 and the specified statement', () => {
        const statementId = 1;
        const expectedStatement = testStatements[statementId - 1];
        return supertest(app)
          .get(`/api/statements/${statementId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, expectedStatement);
      });
    });
  });
  describe('POST /api/statements', () => {
    const testClients = makeClientsArray();
    beforeEach('insert clients data', () => db
      .into('clients')
      .insert(testClients));

    it('creates a statement, responding with 201 and the new statement', () => {
      const newStatement = {
        clientId: 1,
        values: personalStatement,
        statementDate: '2021-02-03T00:00:00.000Z',
      };
      return supertest(app)
        .post('/api/statements')
        .send(newStatement)
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(201)
        .expect((res) => {
          expect(res.body.clientId).to.eql(newStatement.clientId);
          expect(res.body.values).to.eql(newStatement.values);
          expect(res.body).to.have.property('id');
          expect(res.headers.location).to.eql(`/api/statements/${res.body.id}`);
        })
        .then((res) => {
          supertest(app)
            .get(`/api/statements/${res.body.id}`)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(res.body);
        });
    });
  });
  describe('PATCH /api/statements/:statementId', () => {
    context('Given there are statements in the database', () => {
      const testClients = makeClientsArray();
      const testStatements = makeStatementsArray();

      beforeEach('insert statements', () => db
        .into('clients')
        .insert(testClients)
        .then(() => db
          .into('statements')
          .insert(testStatements)));

      it('responds with 204 and updates the statement', () => {
        const idToUpdate = 1;
        const updateStatement = {
          values: personalStatement2,
        };
        const expectedStatement = {
          ...testStatements[idToUpdate - 1],
          ...updateStatement,
        };
        return supertest(app)
          .patch(`/api/statements/${idToUpdate}`)
          .send(updateStatement)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(204)
          .then((res) => {
            supertest(app)
              .get(`/api/statement/${idToUpdate}`)
              .expect(expectedStatement);
          });
      });
    });
  });
});
