'use strict';
// Dependencies
// var mongoose  = require('mongoose');
// var Car = require('../models/car');
// App routes
var fsKey = process.env.FILESTACK;
module.exports = (router, models) => {
  let Service = models.Service;
  let User = models.User;
  let jwtAuth = require(__dirname + '/../lib/jwtAuth.js');
  let CryptoJS = require("crypto-js");

        /*
         * Get route to retrieve all the cars.
         */
        router.route('/users/:user/service')
          .get((req, res) => {
            //Query the DB and if no errors, send service data
            var query = Service.find({});
            query.exec(function(err, service){
                if(err) res.send(err);
                //If no errors, send them back to the client
                res.json(service);
            });
        })
        /*
         * Post route to save a new service into the DB.
         */
        .post(jwtAuth, (req, res) => {
            //Creates a new service doc
            var newService = new Service(req.body);
            //Save it into the DB.
            newService.save(function(err){
                if(err) res.send(err);
                //If no errors, send it back to the client
                res.json(req.body);
            });
        });
        /*
         * Get service based on id.
         */
         router.route('/users/:user/service/:service')
          .get(jwtAuth, (req, res) => {
            Service.findById(req.params.service, function(err, service){
                if(err) res.send(err);
                //If no errors, send it back to the client
                res.json(service);
              });
            })
            .put(jwtAuth, (req, res) => {
              Service.findByIdAndUpdate(req.params.service, req.body, {new: true}, (err, service) => {
                if (err) {
                  return res.send(err);
                }
                res.status(200).json({message: 'Updated Service', data: service});
              });
            })


             router.route('/users/:user/sig')
              .post((req, res) => {
                var policy = req.body.pol;
                console.log("req.body.pol: ", req.body.pol)
                var sig = CryptoJS.HmacSHA256(policy, fsKey).toString();
                console.log("sig: ", sig);

                res.send(sig);
              });
};
