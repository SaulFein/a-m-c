'use strict';
// Dependencies
// var mongoose  = require('mongoose');
// var Car = require('../models/car');
// App routes
module.exports = (router, models) => {
  let Car = models.Car;
  let User = models.User;
  let jwtAuth = require(__dirname + '/../../lib/jwtAuth.js');

        /*
         * Get route to retrieve all the cars.
         */
        router.route('/car')
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
        .post((req, res) => {
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
         router.route('/car/:id')
          .get((req, res) => {
            Car.findById(req.params.id, function(err, car){
                if(err) res.send(err);
                //If no errors, send it back to the client
                res.json(car);
            });
        });

};
