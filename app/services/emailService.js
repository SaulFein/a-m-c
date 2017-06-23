'use strict';

var EmailService = angular.module('EmailService', []);
  app.factory('EmailService', ['$http','$window', function($http, $window) {
    // const mainRoute = "http://localhost:3000/api";
    // const pubRoute = "http://localhost:3000";
    var emailService = {};

    emailService.sendEmail = function(email) {
      return $http.post('/contact', email, {})

    };


    return emailService;
  }]);
