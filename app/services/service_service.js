'use strict';

var ServiceService = angular.module('ServiceService', []);
  app.factory('ServiceService', ['$http', 'AuthService','$window', function($http, AuthService, $window) {
    // const mainRoute = "http://localhost:3000/api";
    // const pubRoute = "http://localhost:3000";
    var serviceId;
    var serviceService = {};

    serviceService.createService = function(cUser, serviceData) {
      return $http.post('/api/users/' + cUser + '/service', serviceData, {
        headers: {
          token: AuthService.getToken()
        }
      })
    };

    serviceService.getService = function(cUser, id) {
      return $http.get('/api/users/' + cUser + '/service/' + id, {
            headers: {
                token: AuthService.getToken()
            }
      })
    }

    serviceService.getServices = function(userId) {
      return $http.get('/api/users/' + userId + '/service', {
        headers: {
          token: AuthService.getToken()
        }
      })
    };

    serviceService.getServicePublic = function() {
      return $http.get('/service')
    };

    serviceService.getSignature = function(userId, policy){
      return $http.post('/api/users/' + userId + '/sig', policy, {
        headers: {
          token: AuthService.getToken()
        }
      })
    }

    serviceService.updateService = function(cUser, serviceData) {
      return $http.put('/api/users/' + cUser + '/service/' + serviceData._id, serviceData, {
        headers: {
          token: AuthService.getToken()
        }
      });
    };

    // serviceService.getId = function(){
    //   return $window.localStorage.carId || carId;
    // }
    return serviceService;
  }]);
