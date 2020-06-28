'use strict';

module.exports = (router, models) => {
  var eaddress = process.env.EUSERNAME;
  const sendmail = require('sendmail')();

  let User = models.User;
  let Car = models.Car;
  let Service = models.Service;
  let Storage = models.Storage;
  let Home = models.Home;

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

   router.route('/service')
     .get((req, res) => {
       //Query the DB and if no errors, send all the services
       var query = Service.find({});
       query.exec(function(err, services){
         console.log("this is service " + services);
           if(err)  res.send(err);
           //If no errors, send them back to the client
           res.json(services);
       });
   })

   router.route('/service/:service')
    .get((req, res) => {
      Service.findById(req.params.service, function(err, service){
          if(err) res.send(err);
          //If no errors, send it back to the client
          res.json(service);
      });
  });

  router.route('/storage')
  .get((req, res) => {
    //Query the DB and if no errors, send all the services
    var query = Storage.find({});
    query.exec(function(err, storages){
      console.log("this is storage " + storages);
        if(err)  res.send(err);
        //If no errors, send them back to the client
        res.json(storages);
    });
})

router.route('/storage/:storage')
 .get((req, res) => {
   Storage.findById(req.params.storage, function(err, storage){
       if(err) res.send(err);
       //If no errors, send it back to the client
       res.json(storage);
   });
});

router.route('/home')
.get((req, res) => {
  //Query the DB and if no errors, send all the homes
  var query = Home.find({});
  query.exec(function(err, homes){
    console.log("this is home " + homes);
      if(err)  res.send(err);
      //If no errors, send them back to the client
      res.json(homes);
  });
})

router.route('/home/:home')
.get((req, res) => {
 Home.findById(req.params.home, function(err, home){
     if(err) res.send(err);
     //If no errors, send it back to the client
     res.json(home);
 });
});

   router.route('/contact')
    .post((req, res) => {
      var email = req.body;
      sendmail({
        from: email.email,
        to: eaddress,
        subject: email.subject,
        html: email.comments,
      }, function(err, reply) {
        if(err) res.send(err);
        res.send(reply);
      });
    })
};
