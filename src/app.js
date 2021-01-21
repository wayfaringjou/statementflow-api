require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV, CLIENT_ORIGIN } = require('./config');
const validateBearerToken = require('./validate-bearer-token');
const worksheetTemplatesRouter = require('./worksheetTemplates/worksheetTemplates.router');
const clientsRouter = require('./clients/clients.router');
const statementsRouter = require('./statements/statements.router');
const worksheetsRouter = require('./worksheets/worksheets.router');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption, { skip: () => NODE_ENV === 'test' }));
app.use(helmet());
app.use(cors({
  origin: CLIENT_ORIGIN,
}));

app.use(validateBearerToken);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use('/api/templates', worksheetTemplatesRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/statements', statementsRouter);
app.use('/api/worksheets', worksheetsRouter);

app.use((error, req, res, next) => {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.log('Error object:');
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
