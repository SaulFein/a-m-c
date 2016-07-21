'use strict';

module.exports = (router, models) => {
  let User = models.User;
  let Car = models.Car;

  let basicHTTP = require(__dirname + '/../../lib/basicHTTP.js');
  let jsonParser = require('body-parser').json();
  let jwtAuth = require(__dirname + '/../../lib/jwtAuth.js');

  let userId;

  router.route('/signup')
    .post(jsonParser, (req, res) => {
      User.findOne({username: req.body.username}, (err, user) => {
        if (err) {
          return res.send(err);
        }
        if (user) {
          res.json({message: 'User Already Exists'});
          return console.log("User Exists-----------")
        }
        if (!user) {
          var newUser = new User(req.body);
          newUser.username = req.body.username;
          newUser.password = req.body.password;
          newUser.save((err, user) => {
            if (err) {
              console.log("saving user error " + err)
              return res.json({message: 'Error Saving New User', error: err});
            }
            console.log("save user " + user)
            res.status(200).json({message: 'User Created', token: user.generateToken(), data: user});

            console.log("hello");
          });
        }
      });
    });

  router.route('/login')
    .post(basicHTTP, (req, res) => {
      User.findOne({'username': req.body.username}, (err, user) => {
        if (err) {
          return res.send(err);
        }
        if (!user) {
          return res.status(401).json({message: 'User Not Found'});
        }
        let valid = user.compareHash(req.body.password);

        if (!valid) {
          return res.status(401).json({message: 'Authentication Failure'});
        }
        userId = user._id
        console.log('This is user:  ' + user._id)
        res.status(200).json({message: 'User Logged In', token: user.generateToken(), data: user});
      });
    });

    router.route('/inventory')
      .get((req, res) => {
        Car.find((err, cars)=>{
          if(err){
            return res.json({message: err});
          }
          console.log("trying to get cars from auth routes")
          res.status(200).json({message: 'All Cars', data: cars});
        });
      })
    };
