'use strict';

var express = require('express');
var mongoose = require('mongoose');
var port = process.env.PORT || 3000;
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
let models = require(__dirname + '/models/index.js');
let publicRouter = express.Router();
let apiRouter = express.Router();
let config = require('./config/env.js');

if (process.env.NODE_ENV === 'production' || process.env.DYNO) {
  app.enable('trust proxy');
  app.use(function(req, res, next) {
    var proto = (req.headers['x-forwarded-proto'] || '').split(',')[0].trim();
    if (proto === 'http') {
      return res.redirect(301, 'https://' + req.headers.host + req.originalUrl);
    }
    if (proto === 'https' || req.secure) {
      res.setHeader('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
    }
    return next();
  });
}

// Log with Morgan
app.use(morgan('dev'));

require(__dirname + '/routes/pub-routes')(publicRouter, models);
require(__dirname + '/routes/users-routes')(apiRouter, models);
require(__dirname + '/routes/car-routes')(apiRouter, models);
require(__dirname + '/routes/service-routes')(apiRouter, models);
require(__dirname + '/routes/storage-routes')(apiRouter, models);
require(__dirname + '/routes/home-routes')(apiRouter, models);

// parse application/json and look for raw text
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));
app.use('/', publicRouter);
app.use('/api', apiRouter);
app.use(morgan('dev'));
// Static files
app.use(express.static(__dirname + '/app'));

app.listen(port);
console.log('listening on port ' + port);
