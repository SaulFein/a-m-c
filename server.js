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

// Log with Morgan
app.use(morgan('dev'));


require(__dirname + '/routes/pub-routes')(publicRouter, models);
require(__dirname + '/routes/users-routes')(apiRouter, models);
require(__dirname + '/routes/car-routes')(apiRouter, models);
require(__dirname + '/routes/service-routes')(apiRouter, models);
require(__dirname + '/routes/storage-routes')(apiRouter, models);




// parse application/json and look for raw text
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));
app.use('/', publicRouter);
app.use('/api', apiRouter);
app.use(morgan('dev'));
// Static files
app.use(express.static(__dirname + '/app'));

// app.route('/car')
//     .post(car.post)
//     .get(car.getAll);
// app.route('/car/:id')
//     .get(car.getOne);

app.listen(port);
console.log('listening on port ' + port);
