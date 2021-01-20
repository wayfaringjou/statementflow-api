const knex = require('knex');
const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');
const { makeTemplatesArray } = require('./worksheetTemplates.fixtures');
const personalStatement = require('./personalStatement.json');

describe('Templates endpoints', () => {
  let db;
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE templates'));

  afterEach('cleanup', () => db.raw('TRUNCATE templates'));

  describe('GET /api/templates', () => {
    context('Given no templates', () => {
      it('responds with 200 and an empty list', () => supertest(app)
        .get('/api/templates')
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(200, []));
    });

    context('Given there are templates in the database', () => {
      const testTemplates = makeTemplatesArray();

      beforeEach('test templates', () => db
        .into('templates')
        .insert(testTemplates));

      it('responds with 200 and all of the templates', () => supertest(app)
        .get('/api/templates')
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(200, testTemplates));
    });
  });
  describe('GET /api/templates/:templateId', () => {
    context('Given no templates', () => {
      it('responds with 404', () => {
        const templateId = 42;
        return supertest(app)
          .get(`/api/templates/${templateId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(404, { error: { message: "Template doesn't exist" } });
      });
    });
    context('Given there are templates in the database', () => {
      const testTemplates = makeTemplatesArray();

      beforeEach('insert templates', () => db
        .into('templates')
        .insert(testTemplates));

      it('responds with 200 and the specified template', () => {
        const templateId = 1;
        const expectedTemplate = testTemplates[templateId - 1];
        return supertest(app)
          .get(`/api/templates/${templateId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, expectedTemplate);
      });
    });
  });
  describe('POST /api/templates', () => {
    const testTemplates = makeTemplatesArray();
    it('creates a template, responding with 201 and the new template', () => {
      const newTemplate = {
        name: 'Personal Finance Statement',
        template: personalStatement,
      };
      return supertest(app)
        .post('/api/templates')
        .send(newTemplate)
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(201)
        .expect((res) => {
          expect(res.body.name).to.eql(newTemplate.name);
          expect(res.body.template).to.eql(newTemplate.template);
          expect(res.body).to.have.property('id');
          expect(res.headers.location).to.eql(`/api/templates/${res.body.id}`);
        })
        .then((res) => {
          supertest(app)
            .get(`/api/templates/${res.body.id}`)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(res.body);
        });
    });
  });
});
