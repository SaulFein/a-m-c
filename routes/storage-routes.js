'use strict';
// App routes
var fsKey = process.env.FILESTACK;
module.exports = (router, models) => {
  let Storage = models.Storage;
  let User = models.User;
  let jwtAuth = require(__dirname + '/../lib/jwtAuth.js');
  let CryptoJS = require("crypto-js");

        /*
         * Get route to retrieve all the cars.
         */
        router.route('/users/:user/storage')
          .get((req, res) => {
            //Query the DB and if no errors, send storage data
            var query = Storage.find({});
            query.exec(function(err, storage){
                if(err) res.send(err);
                //If no errors, send them back to the client
                res.json(storage);
            });
        })
        /*
         * Post route to save a new storage into the DB.
         */
        .post(jwtAuth, (req, res) => {
            //Creates a new storage doc
            var newStorage = new Storage(req.body);
            //Save it into the DB.
            newStorage.save(function(err){
                if(err) res.send(err);
                //If no errors, send it back to the client
                res.json(req.body);
            });
        });
        /*
         * Get storage based on id.
         */
         router.route('/users/:user/storage/:storage')
          .get(jwtAuth, (req, res) => {
            Storage.findById(req.params.storage, function(err, storage){
                if(err) res.send(err);
                //If no errors, send it back to the client
                res.json(storage);
              });
            })
            .put(jwtAuth, (req, res) => {
              Storage.findByIdAndUpdate(req.params.storage, req.body, {new: true}, (err, storage) => {
                if (err) {
                  return res.send(err);
                }
                res.status(200).json({message: 'Updated Storage', data: storage});
              });
            })
            .delete(jwtAuth, (req, res) => {
              Storage.findByIdAndRemove(req.params.storage, (err, storage) => {
                if (err) {
                  return res.send(err);
                }
                res.status(200).json({message: 'Deleted Storage', data: storage});
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
