"use strict";

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

class Server {

  constructor() {
    this.initLogger();
    this.initDB();
    this.initViewEngine();
    this.initExpressMiddleware();
    this.initRoutes();
  }

  initLogger() {
    app.locals.logger = require('./logger');
  }

  start(port) {
    app.listen(port, () => app.locals.logger.info('app listening on port ' + port));
  }

  initViewEngine() {
    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, '../views'));
  }

  initExpressMiddleware() {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
  }

  initDB() {
    mongoose.connect('mongodb://localhost/gladius');
  }

  initRoutes() {
    app.use('/', require('../routes/request_logger'));
    app.use('/', require('../routes/index'));
  }
}

module.exports = new Server();