'use strict';

exports.PORT = process.env.PORT || 3000;

//local
//exports.MONGOLAB_URI = "mongodb://localhost/db";

//production
exports.MONGOLAB_URI = process.env.MONGOLAB_URI;
exports.MONGOLAB_URI2 = process.env.MONGOLAB_URI2;

exports.FILESTACK = process.env.FILESTACK;
exports.EUSERNAME = process.env.EUSERNAME;
exports.EPASS = process.env.EPASS;

// git push -f heroku branch:master
