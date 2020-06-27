'use strict';
var fsKey = process.env.FILESTACK;
module.exports = (router, models) => {
  let Home = models.Home;
  let User = models.User;
  let jwtAuth = require(__dirname + '/../lib/jwtAuth.js');
  let CryptoJS = require("crypto-js");

        /*
         * Get route to retrieve all the homes documents (should only be one).
         */
        router.route('/users/:user/home')
          .get((req, res) => {
            //Query the DB and if no errors, send all the homes
            var query = Home.find({});
            query.exec(function(err, homes){
                if(err) res.send(err);
                //If no errors, send them back to the client
                res.json(homes);
            });
        })
        /*
         * Post route to save a new home into the DB.
         */
        .post(jwtAuth, (req, res) => {
            //Creates a new home
            var newHome = new Home(req.body);
            //Save it into the DB.
            newHome.save(function(err){
                // if(err) res.send(err);
                //If no errors, send it back to the client
                res.json(req.body);
            });
        });
        /*
         * Get a single home based on id.
         */
         router.route('/users/:user/home/:home')
          .get(jwtAuth, (req, res) => {
            Home.findById(req.params.home, function(err, home){
                if(err) res.send(err);
                //If no errors, send it back to the client
                res.json(home);
              });
            })
            .put(jwtAuth, (req, res) => {
              Home.findByIdAndUpdate(req.params.home, req.body, {new: true}, (err, home) => {
                if (err) {
                  return res.send(err);
                }
                res.status(200).json({message: 'Updated home', data: home});
              });
            })
            .delete(jwtAuth, (req, res) => {
              Home.findByIdAndRemove(req.params.home, (err, home) => {
                if (err) {
                  return res.send(err);
                }
                res.status(200).json({message: 'Deleted Home', data: home});
              });
            });

             router.route('/users/:user/sig')
              .post((req, res) => {
                var policy = req.body.pol;
                console.log("req.body.pol: ", req.body.pol)
                var sig = CryptoJS.HmacSHA256(policy, fsKey).toString();
                console.log("sig: ", sig);

                res.send(sig);
              });
};
