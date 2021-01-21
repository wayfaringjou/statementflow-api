const path = require('path');
const express = require('express');
const xss = require('xss');
const logger = require('../logger');
const clientsService = require('./clients.service');

const clientsRouter = express.Router();
const jsonParser = express.json();

const serializeClient = (client) => ({
  id: client.id,
  name: xss(client.name),
});

clientsRouter
  .route('/')
  .get(async (req, res, next) => {
    const knexInstance = req.app.get('db');
    try {
      const clients = await clientsService.getAllClients(knexInstance);
      res.json(clients.map(serializeClient));
    } catch (err) {
      next(err);
    }
  })
  .post(jsonParser, async (req, res, next) => {
    const { name } = req.body;
    const newClient = { name };

    const newClientKeys = Object.keys(newClient);
    newClientKeys.forEach((key) => {
      if (newClient[key] === undefined) {
        return res.status(400).json({
          error: { message: `Missing ${key} in request body` },
        });
      }
    });
    try {
      const postClient = await clientsService.postClient(req.app.get('db'), newClient);

      logger.info(`Client with id ${postClient.id} created`);
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `${postClient.id}`))
        .json(serializeClient(postClient));
    } catch (err) {
      next(err);
    }
  });

clientsRouter
  .route('/:clientId')
  // eslint-disable-next-line consistent-return
  .all(async (req, res, next) => {
    const knexInstance = req.app.get('db');
    const { clientId } = req.params;
    try {
      const client = await clientsService.getById(knexInstance, clientId);
      if (!client) {
        logger.error(`Note with ${clientId} not found`);
        return res.status(404).json({
          error: { message: "Client doesn't exist" },
        });
      }
      res.client = client;
      // console.log(res.client);
      next();
    } catch (err) {
      next(err);
    }
  })
  .get((req, res) => {
    console.log(res.client);
    res.json(serializeClient(res.client));
  });
module.exports = clientsRouter;
