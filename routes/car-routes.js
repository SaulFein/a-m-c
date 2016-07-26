'use strict';
// Dependencies
// var mongoose  = require('mongoose');
// var Car = require('../models/car');
// App routes
module.exports = (router, models) => {
  let Car = models.Car;
  let User = models.User;
  let jwtAuth = require(__dirname + '/../lib/jwtAuth.js');

        /*
         * Get route to retrieve all the cars.
         */
        router.route('/users/:user/inventory')
          .get((req, res) => {
            //Query the DB and if no errors, send all the cars
            var query = Car.find({});
            query.exec(function(err, cars){
                if(err) res.send(err);
                //If no errors, send them back to the client
                res.json(cars);
            });
        })
        /*
         * Post route to save a new car into the DB.
         */
        .post(jwtAuth, (req, res) => {
            //Creates a new car
            var newCar = new Car(req.body);
            //Save it into the DB.
            newCar.save(function(err){
                if(err) res.send(err);
                //If no errors, send it back to the client
                res.json(req.body);
            });
        });
        /*
         * Get a single car based on id.
         */
         router.route('/users/:user/inventory/:car')
          .get(jwtAuth, (req, res) => {
            Car.findById(req.params.car, function(err, car){
                if(err) res.send(err);
                //If no errors, send it back to the client
                res.json(car);
              });
            })
            .put(jwtAuth, (req, res) => {
              Car.findByIdAndUpdate(req.params.car, req.body, {new: true}, (err, car) => {
                if (err) {
                  return res.send(err);
                }
                res.status(200).json({message: 'Updated car', data: car});
              });
            })
            .delete(jwtAuth, (req, res) => {
              Car.findByIdAndRemove(req.params.car, (err, car) => {
                res.status(200).json({message: 'Deleted Car', data: car});
              });
            });
      

};
