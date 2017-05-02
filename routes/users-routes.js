'use strict';

module.exports = (router, models) => {
  let User = models.User;
  let Car = models.Car;
  let jwtAuth = require(__dirname + '/../lib/jwtAuth.js');
  let jsonParser = require('body-parser').json();

  router.route('/users')
    .get(jwtAuth, (req, res) => {
      var query = User.find({});
      query.exec((err, users) => {
        if (err) {
          return res.send(err);
        }
        res.status(200).json({message: 'Returned All Users', data: users});
      });
    });

  router.route('/users/:user')
    .get(jwtAuth, (req, res) => {
      User.findById(req.params.user, function(err, user) {
        if (err) {
          return res.send(err);
        }
        res.status(200).json({message: 'Returned User', data: user});
      });
    })
    .put(jwtAuth, (req, res) => {
      User.findByIdAndUpdate(req.params.user, req.body, {new: true}, (err, user) => {
        if (err) {
          return res.send(err);
        }
        res.status(200).json({message: 'Updated User', data: user});
      });
    })
    .delete(jwtAuth, (req, res) => {
      User.findByIdAndRemove(req.params.user, (err, user) => {
        res.status(200).json({message: 'Deleted User', data: user});
      });
    });

    router.route('/users/:user/signup')
      .post(jwtAuth, (req, res) => {
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
};
