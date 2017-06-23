'use strict';

var EmailService = angular.module('EmailService', []);
  app.factory('EmailService', ['$http','$window', function($http, $window) {
    // const mainRoute = "http://localhost:3000/api";
    // const pubRoute = "http://localhost:3000";
    var emailService = {};

    emailService.sendEmail = function(email) {
      return $http.post('/contact', email, {

      })
      .then(function successCallback(email) {
    // this callback will be called asynchronously
    // when the response is available
      }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
      });
    };


    return emailService;
  }]);
