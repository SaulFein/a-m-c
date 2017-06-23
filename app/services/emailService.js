'use strict';

var EmailService = angular.module('EmailService', []);
  app.factory('EmailService', ['$http','$window', function($http, $window) {
    // const mainRoute = "http://localhost:3000/api";
    // const pubRoute = "http://localhost:3000";
    var emailService = {};

    emailService.sendEmail = function(email) {
      return $http.post('/contact', email, {})
      .then(function successCallback(email) {
        // toastr.success("Email Sent");
        // $scope.firstName = null;
        // $scope.lastName = null;
        // $scope.phone = null;
        // $scope.email = null;
        // $scope.comments = null;
            }, function errorCallback(response) {
              // toastr.error("Error Sending Email");
          // called asynchronously if an error occurs
          // or server returns response with an error status.
            });;
    };


    return emailService;
  }]);
