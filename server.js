'use strict';

var express = require('express');
var mongoose = require('mongoose');
var port = process.env.PORT || 3000;
var morgan = require('morgan');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
let models = require(__dirname + '/app/index.js');
let publicRouter = express.Router();
let apiRouter = express.Router();
let config = require('./config/env.js');

// Log with Morgan
app.use(morgan('dev'));


require(__dirname + '/app/routes/auth-routes')(publicRouter, models);
require(__dirname + '/app/routes/users-routes')(apiRouter, models);
require(__dirname + '/app/routes/car-routes')(apiRouter, models);


// parse application/json and look for raw text
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));
app.use('/', publicRouter);
app.use('/api', apiRouter);
app.use(morgan('dev'));
// Static files
app.use(express.static(__dirname + '/public'));

// app.route('/car')
//     .post(car.post)
//     .get(car.getAll);
// app.route('/car/:id')
//     .get(car.getOne);

app.listen(port);
console.log('listening on port ' + port);
