'use strict';

module.exports = (router, models) => {
  let User = models.User;
  let jwtAuth = require(__dirname + '/../lib/jwtAuth.js');

  router.route('/users')
    .get(jwtAuth, (req, res) => {
      User
      .find({})
      .populate('inventory')
      .exec((err, users) => {
        if (err) {
          return res.send(err);
        }
        res.status(200).json({message: 'Returned All Users', data: users});
      });
    })
    .post((req, res) => {
      User.findOne({username: req.body.username}, (err, user) => {
        if (err) {
          return res.send(err);
        }

        if (user) {
          return res.json({message: 'User Already Exists', data: user});
        }

        if (!user) {
          var newUser = new User(req.body);
          newUser.username = req.body.username;
          newUser.password = req.body.password;
          newUser.save((err, user) => {
            if (err) {
              return res.json({message: 'Error Saving New User', error: err});
            }
            res.status(200).json({message: 'Created User', token: user.generateToken(), data: user});
          });
        }
      });
    });

  router.route('/users/:user')
    .get(jwtAuth, (req, res) => {
      User
      .findById(req.params.user)
      .populate('inventory')
      .exec((err, user) => {
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
};
