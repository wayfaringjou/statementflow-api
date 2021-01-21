const path = require('path');
const express = require('express');
const xss = require('xss');
const logger = require('../logger');
const worksheetsService = require('./worksheets.service');

const worksheetsRouter = express.Router();
const jsonParser = express.json();

const serializeWorksheet = (worksheet) => ({
  id: worksheet.id,
  modified: worksheet.modified,
  clientId: worksheet.clientId,
  templateId: worksheet.templateId,
  statementDataId: worksheet.statementDataId,
});

worksheetsRouter
  .route('/')
  .get(async (req, res, next) => {
    const knexInstance = req.app.get('db');
    try {
      const worksheets = await worksheetsService.getAllWorksheets(knexInstance);
      res.json(worksheets.map(serializeWorksheet));
    } catch (err) {
      next(err);
    }
  })
  .post(jsonParser, async (req, res, next) => {
    const { clientId, templateId, statementDataId } = req.body;
    const newWorksheet = { clientId, templateId, statementDataId };

    const newWorksheetKeys = Object.keys(newWorksheet);
    newWorksheetKeys.forEach((key) => {
      if (newWorksheet[key] === undefined) {
        return res.status(400).json({
          error: { message: `Missing ${key} in request body` },
        });
      }
    });
    try {
      const postWorksheet = await worksheetsService.postWorksheet(req.app.get('db'), newWorksheet);

      logger.info(`Worksheet with id ${postWorksheet.id} created`);
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `${postWorksheet.id}`))
        .json(serializeWorksheet(postWorksheet));
    } catch (err) {
      next(err);
    }
  });

worksheetsRouter
  .route('/:worksheetId')
  // eslint-disable-next-line consistent-return
  .all(async (req, res, next) => {
    const knexInstance = req.app.get('db');
    const { worksheetId } = req.params;
    try {
      const worksheet = await worksheetsService.getById(knexInstance, worksheetId);
      if (!worksheet) {
        logger.error(`Note with ${worksheetId} not found`);
        return res.status(404).json({
          error: { message: "Worksheet doesn't exist" },
        });
      }
      res.worksheet = worksheet;
      // console.log(res.worksheet);
      next();
    } catch (err) {
      next(err);
    }
  })
  .get((req, res) => {
    console.log(res.worksheet);
    res.json(serializeWorksheet(res.worksheet));
  });
module.exports = worksheetsRouter;
