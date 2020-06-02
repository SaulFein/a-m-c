'use strict';

let mongoose = require('mongoose');
let config = require(__dirname + '/../config/env.js');

// mongoose.connect(config.MONGOLAB_URI);
// Just some options for the db connection
var options = { useNewUrlParser: true, useUnifiedTopology: true};

//local
//mongoose.connect('mongodb://localhost/db', options);

//production
mongoose.connect(process.env.MONGOLAB_URI , options);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));


let models = {};

require(__dirname + '/car.js')(mongoose, models);
require(__dirname + '/service.js')(mongoose, models);
require(__dirname + '/user.js')(mongoose, models);

module.exports = models;

// mongod --dbpath=./db --smallfiles
