const path = require('path');
const express = require('express');
const xss = require('xss');
const logger = require('../logger');
const worksheetTemplatesService = require('./worksheetTemplates.service');

const worksheetTemplatesRouter = express.Router();
const jsonParser = express.json();

const serializeTemplate = (template) => ({
  id: template.id,
  name: xss(template.name),
  template: template.template,
});

worksheetTemplatesRouter
  .route('/')
  .get(async (req, res, next) => {
    const knexInstance = req.app.get('db');
    try {
      const templates = await worksheetTemplatesService.getAllTemplates(knexInstance);
      res.json(templates.map(serializeTemplate));
    } catch (err) {
      next(err);
    }
  })
  .post(jsonParser, async (req, res, next) => {
    const { name, template } = req.body;
    const newTemplate = { name, template };

    const newTemplateKeys = Object.keys(newTemplate);
    newTemplateKeys.forEach((key) => {
      if (newTemplate[key] === undefined) {
        return res.status(400).json({
          error: { message: `Missing ${key} in request body` },
        });
      }
    });
    try {
      const postTemplate = await worksheetTemplatesService.postTemplate(req.app.get('db'), newTemplate);

      logger.info(`Template with id ${postTemplate.id} created`);
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `${postTemplate.id}`))
        .json(serializeTemplate(postTemplate));
    } catch (err) {
      next(err);
    }
  });

worksheetTemplatesRouter
  .route('/:templateId')
  // eslint-disable-next-line consistent-return
  .all(async (req, res, next) => {
    const knexInstance = req.app.get('db');
    const { templateId } = req.params;
    try {
      const template = await worksheetTemplatesService.getById(knexInstance, templateId);
      if (!template) {
        logger.error(`Note with ${templateId} not found`);
        return res.status(404).json({
          error: { message: "Template doesn't exist" },
        });
      }
      res.template = template;
      // console.log(res.template);
      next();
    } catch (err) {
      next(err);
    }
  })
  .get((req, res) => {
    console.log(res.template);
    res.json(serializeTemplate(res.template));
  });
module.exports = worksheetTemplatesRouter;
