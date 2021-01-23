const knex = require('knex');
const pg = require('pg');
const app = require('./app');
const { PORT, DATABASE_URL, NODE_ENV } = require('./config');

if (NODE_ENV === 'production') {
  pg.defaults.ssl = {
    rejectUnauthorized: false,
  };
}

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
  // ssl: {
  //  rejectUnauthorized: false,
  // },
});

app.set('db', db);

app.listen(PORT, () => {
  // console.log(`Server listening at http://localhost:${PORT}`);
});
