'use strict';

var EmailService = angular.module('EmailService', []);
  app.factory('EmailService', ['$http','$window', function($http, $window) {

    var emailService = {};
    
    emailService.sendEmail = function(email) {
      return $http.post('/contact', email, {})
    };

    return emailService;
  }]);
