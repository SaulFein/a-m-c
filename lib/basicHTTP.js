'use strict';

module.exports = (req, res, next) => {
  try {
    console.log(req.headers);
    let authorizationArray = req.headers.authorization.split(' ');
    let method = authorizationArray[0];
    let base64en = authorizationArray[1];
    let authArray = new Buffer(base64en, 'base64').toString().split(':');

    let username = authArray[0];
    let password = authArray[1];
    if (username.length && password.length) {
      req.body.username = username;
      req.body.password = password;
      return next();
    }
  } catch(e) {
    console.log(e);
  }

  res.status(401).json({message: 'Could Not Authenticate User'});
};
