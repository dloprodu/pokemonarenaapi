/**
 * @description PokemonArena Node API
 * @version 1.0.0
 */

'use strict';

const createError = require('http-errors');
const cors = require('cors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const BaseResponse = require('./schema/BaseResponse');
const DataResponse = require('./schema/DataResponse');
const PaginatedResponse = require('./schema/PaginatedResponse');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/api/v1/users');
const rankingRouter = require('./routes/api/v1/ranking');

var app = express();

// DB connector
require('./lib/mongooseConnection');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));

//enables cors
app.use(cors({
  'allowedHeaders': ['sessionId', 'Content-Type', 'X-Access-Token'],
  'exposedHeaders': ['sessionId'],
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.apiResponse = () => {
    res.status(200).json(new BaseResponse());
  };

  res.apiDataResponse = (data) => {
    res.status(200).json(new DataResponse(data));
  };

  res.apiPaginatedResponse = (rows, total) => {
    res.status(200).json(new PaginatedResponse(rows, total));
  };

  next();
});

app.use('/', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/ranking', rankingRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
