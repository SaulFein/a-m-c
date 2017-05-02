'use strict';

module.exports = (router, models) => {
  let User = models.User;
  let Car = models.Car;

  let basicHTTP = require(__dirname + '/../lib/basicHTTP.js');
  let jsonParser = require('body-parser').json();
  let jwtAuth = require(__dirname + '/../lib/jwtAuth.js');

  let userId;


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
        //Query the DB and if no errors, send all the cars
        var query = Car.find({});
        query.exec(function(err, cars){
          console.log("this is cars " + cars);
            if(err)  res.send(err);
            //If no errors, send them back to the client
            res.json(cars);
        });
    })

    router.route('/inventory/:car')
     .get((req, res) => {
       Car.findById(req.params.car, function(err, car){
           if(err) res.send(err);
           //If no errors, send it back to the client
           res.json(car);
       });
   });

    // router.route('/inventory')
    //   .get((req, res) => {
    //     //Query the DB and if no errors, send all the cars
    //     var query = Car.find({});
    //     query.exec(function(err, cars){
    //         if(err) res.send(err);
    //         //If no errors, send them back to the client
    //         res.json(cars);
    //     });
    //   })
    };
