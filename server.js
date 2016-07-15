var express = require('express');
var mongoose = require('mongoose');
var port = process.env.PORT || 3000;
var morgan = require('morgan');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');

var car = require('./app/routes/car')();

// Just some options for the db connection
var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };

var gulp = require('gulp'); // Load gulp
require('./gulpfile'); // Loads our config task

// Kick of gulp 'config' task, which generates angular const configuration
gulp.start('config');

mongoose.connect('mongodb://localhost/db', options);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

// Log with Morgan
app.use(morgan('dev'));

// parse application/json and look for raw text
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));

// Static files
app.use(express.static(__dirname + '/public'));

app.route('/car')
    .post(car.post)
    .get(car.getAll);
app.route('/car/:id')
    .get(car.getOne);

app.listen(port);
console.log('listening on port ' + port);
