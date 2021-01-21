const path = require('path');
const express = require('express');
const xss = require('xss');
const logger = require('../logger');
const statementsService = require('./statements.service');

const statementsRouter = express.Router();
const jsonParser = express.json();

const serializeStatement = (statement) => ({
  id: statement.id,
  clientId: statement.clientId,
  values: statement.values,
});

statementsRouter
  .route('/')
  .get(async (req, res, next) => {
    const knexInstance = req.app.get('db');
    try {
      const statements = await statementsService.getAllStatements(knexInstance);
      res.json(statements.map(serializeStatement));
    } catch (err) {
      next(err);
    }
  })
  .post(jsonParser, async (req, res, next) => {
    const { clientId, values } = req.body;
    const newStatement = { clientId, values };

    const newStatementKeys = Object.keys(newStatement);
    newStatementKeys.forEach((key) => {
      if (newStatement[key] === undefined) {
        return res.status(400).json({
          error: { message: `Missing ${key} in request body` },
        });
      }
    });
    try {
      const postStatement = await statementsService.postStatement(req.app.get('db'), newStatement);

      logger.info(`Statement with id ${postStatement.id} created`);
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `${postStatement.id}`))
        .json(serializeStatement(postStatement));
    } catch (err) {
      next(err);
    }
  });

statementsRouter
  .route('/:statementId')
  // eslint-disable-next-line consistent-return
  .all(async (req, res, next) => {
    const knexInstance = req.app.get('db');
    const { statementId } = req.params;
    try {
      const statement = await statementsService.getById(knexInstance, statementId);
      if (!statement) {
        logger.error(`Note with ${statementId} not found`);
        return res.status(404).json({
          error: { message: "Statement doesn't exist" },
        });
      }
      res.statement = statement;
      // console.log(res.statement);
      next();
    } catch (err) {
      next(err);
    }
  })
  .get((req, res) => {
    console.log(res.statement);
    res.json(serializeStatement(res.statement));
  });
module.exports = statementsRouter;
