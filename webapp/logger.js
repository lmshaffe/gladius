"use strict";

const path = require('path');
const winston = require('winston');
require('winston-daily-rotate-file');
const logger_levels = require('./logger_levels');

class Logger {

  constructor() {
    this._initWinstonOptions();
    this._initLogLevels();
    this._initLogger();
    this._startStream();
    this._initLogFunctions();
  }

  _initWinstonOptions() {
    winston.emitErrs = true;
  }

  _initLogLevels() {
    this.config = {};
    this.config.levels = {};
    this.config.colors = {};

    logger_levels.logLevels.forEach( l => {
      this.config.levels[l.name] = l.level
      this.config.colors[l.name] = l.color
    });
    winston.addColors(this.config.colors);
    this.logLevel = (process.env.WINSTON_LOG_LEVEL) ? process.env.WINSTON_LOG_LEVEL : 'all';
  }

  _initLogger() {
    this.logger = new winston.Logger({
      transports: [
        new winston.transports.DailyRotateFile({
          datePattern: 'yyyy-MM-dd',
          filename: path.join('./', '-daily.log'),
          prepend: true,
          level: this.logLevel,
          handleExceptions: true,
          json: true,
          maxFiles: 30,
          colorize: false,
          zippedArchive: true
        }),
        new winston.transports.Console({
          level: this.logLevel,
          prettyPrint: true,
          handleExceptions: true,
          json: false,
          colorize: true,
          timestamp: true,
        })
      ],
      exitOnError: false
    });
    this.logger.setLevels(this.config.levels);
  }

  _startStream() {
    module.exports.stream = {
      write: function(message, encoding) {
          this.logger.info(message);
      }
    };
  }

  _initLogFunctions() {
    logger_levels.logLevels.forEach( l => {
      this[l.name] = this.logger[l.name];
    });
  }
}

var exports = module.exports = new Logger();