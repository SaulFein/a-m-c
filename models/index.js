'use strict';

let mongoose = require('mongoose');
let config = require(__dirname + '/../config/env.js');

// mongoose.connect(config.MONGOLAB_URI);
// Just some options for the db connection
var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };

//local or production
mongoose.connect('mongodb://localhost/db', options);
//mongoose.connect(process.env.MONGOLAB_URI , options);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));


let models = {};

require(__dirname + '/car.js')(mongoose, models);
require(__dirname + '/user.js')(mongoose, models);

module.exports = models;
