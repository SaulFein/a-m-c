// Dependencies
var mongoose  = require('mongoose');
var Car = require('../models/car');
// App routes
module.exports = function() {
    return {
        /*
         * Get route to retrieve all the cars.
         */
        getAll : function(req, res){
            //Query the DB and if no errors, send all the cars
            var query = Car.find({});
            query.exec(function(err, cars){
                if(err) res.send(err);
                //If no errors, send them back to the client
                res.json(cars);
            });
        },
        /*
         * Post route to save a new car into the DB.
         */
        post: function(req, res){
            //Creates a new car
            var newCar = new Car(req.body);
            //Save it into the DB.
            newCar.save(function(err){
                if(err) res.send(err);
                //If no errors, send it back to the client
                res.json(req.body);
            });
        },
        /*
         * Get a single car based on id.
         */
        getOne: function(req, res){
            Car.findById(req.params.id, function(err, car){
                if(err) res.send(err);
                //If no errors, send it back to the client
                res.json(car);
            });
        }
    }
};
