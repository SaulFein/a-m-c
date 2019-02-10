'use strict';

var CarService = angular.module('CarService', []);
  app.factory('CarService', ['$http', 'AuthService','$window', function($http, AuthService, $window) {
    // const mainRoute = "http://localhost:3000/api";
    // const pubRoute = "http://localhost:3000";
    var carId;
    var carService = {};

    carService.createCar = function(cUser, carData) {
      return $http.post('/api/users/' + cUser + '/inventory', carData, {
        headers: {
          token: AuthService.getToken()
        }
      })
    };

    carService.getCars = function(userId) {
      return $http.get('/api/users/' + userId + '/inventory', {
        headers: {
          token: AuthService.getToken()
        }
      })
    };

    carService.getCarsPublic = function() {
      return $http.get('/inventory')
    };

    carService.getSignature = function(userId, policy){
      return $http.post('/api/users/' + userId + '/sig', policy, {
        headers: {
          token: AuthService.getToken()
        }
      })
    }

    carService.updateCar = function(cUser, carData) {
      return $http.put('/api/users/' + cUser + '/inventory/' + carData._id, carData, {
        headers: {
          token: AuthService.getToken()
        }
      });
    };

    carService.deleteCar = function(cUser, carData) {
      return $http.delete('/api/users/' + cUser + '/inventory/' + carData._id, {
        headers: {
          token: AuthService.getToken()
        }
      });
    };

    carService.getId = function(){
      return $window.localStorage.carId || carId;
    }
    return carService;
  }]);
