const knex = require('knex');
const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');
const { makeClientsArray } = require('./clients.fixtures');

describe('Clients endpoints', () => {
  let db;
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE clients'));

  afterEach('cleanup', () => db.raw('TRUNCATE clients'));

  describe('GET /api/clients', () => {
    context('Given no clients', () => {
      it('responds with 200 and an empty list', () => supertest(app)
        .get('/api/clients')
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(200, []));
    });

    context('Given there are clients in the database', () => {
      const testClients = makeClientsArray();

      beforeEach('test clients', () => db
        .into('clients')
        .insert(testClients));

      it('responds with 200 and all of the clients', () => supertest(app)
        .get('/api/clients')
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(200, testClients));
    });
  });
  describe('GET /api/clients/:clientId', () => {
    context('Given no clients', () => {
      it('responds with 404', () => {
        const clientId = 42;
        return supertest(app)
          .get(`/api/clients/${clientId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(404, { error: { message: "Client doesn't exist" } });
      });
    });
    context('Given there are clients in the database', () => {
      const testClients = makeClientsArray();

      beforeEach('insert clients', () => db
        .into('clients')
        .insert(testClients));

      it('responds with 200 and the specified client', () => {
        const clientId = 1;
        const expectedClient = testClients[clientId - 1];
        return supertest(app)
          .get(`/api/clients/${clientId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, expectedClient);
      });
    });
  });
  describe('POST /api/clients', () => {
    const testClients = makeClientsArray();
    it('creates a client, responding with 201 and the new client', () => {
      const newClient = {
        name: 'Joyce B. Hayes',
      };
      return supertest(app)
        .post('/api/clients')
        .send(newClient)
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(201)
        .expect((res) => {
          expect(res.body.name).to.eql(newClient.name);
          expect(res.body).to.have.property('id');
          expect(res.headers.location).to.eql(`/api/clients/${res.body.id}`);
        })
        .then((res) => {
          supertest(app)
            .get(`/api/clients/${res.body.id}`)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(res.body);
        });
    });
  });
});
