const pg = require('pg');
const app = require('./app');
const { PORT } = require('./config');

pg.defaults.ssl = {
  rejectUnauthorized: false,
};

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
