'use strict';

module.exports = (router, models) => {
  // var eaddress = process.env.EUSERNAME;
  // var epass = process.env.EPASS;
  // const nodemailer = require('nodemailer');
  //
  // // create reusable transporter object using the default SMTP transport
  // let transporter = nodemailer.createTransport({
  //   service: 'Gmail', // secure:true for port 465, secure:false for port 587
  //     auth: { user: 'xxxxx@gmail.com', pass: 'xxxxx'}
  // });
  const sendmail = require('sendmail')();

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

   router.route('/contact')
    .post((req, res) => {
      var email = req.body;
      sendmail({
        from: 'gunstar45@hotmail.com',
        to: 'feinstein.brandon@gmail.com',
        subject: 'test sendmail',
        html: 'Mail of test sendmail ',
  }, function(err, reply) {
    console.log(err && err.stack);
    console.dir(reply);
});
 //      let mailOptions = {
 //        from: email.email, // sender address
 //        to: 'brandon.feinstein@hotmail.com', // list of receivers
 //        subject: email.subject, // Subject line
 //        // phone:  email.phone,
 //        // comments: email.comments,
 //        html: '<b>Hello world ?</b>' // html body
 //      };
 //
 //      transporter.verify(function(error, success) {
 //   if (error) {
 //        console.log(error);
 //   } else {
 //        console.log('Server is ready to take our messages');
 //   }
 // });
 //      // send mail with defined transport object
 //      transporter.sendMail(mailOptions, (error, info) => {
 //        if (error) {
 //          return console.log(error);
 //        }
 //        console.log('Message %s sent: %s', info.messageId, info.response);
 //      });
    })

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
