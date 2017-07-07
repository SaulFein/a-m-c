'use strict';

module.exports = (req, res, next) => {
  let jwt = require('jsonwebtoken');
  let models = require(__dirname + '/../models');
  let User = models.User;
  let decoded;
  try {
    decoded = jwt.verify(req.headers.token, process.env.APP_SECRET || 'change this');
  } catch (e) {
    console.log("JWT Error " + e);
    return res.status(401).json({message: 'Error Verifying Token'});
  }

  User.findOne({_id: decoded._id}, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(401).json({message: 'Error Finding User'});
    }

    if (!user) {
      return res.status(401).json({message: 'User Not Authorized'});
    }
    req.user = user;
    next();
  });
};
