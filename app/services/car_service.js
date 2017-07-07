'use strict';

var CarService = angular.module('CarService', []);
  app.factory('CarService', ['$http', 'AuthService','$window', function($http, AuthService, $window) {
    // const mainRoute = "http://localhost:3000/api";
    // const pubRoute = "http://localhost:3000";
    var carId;
    var carService = {};

    carService.createCar = function(data) {
      return $http.post('/api/users/' + data._id + '/inventory', data, {
        headers: {
          token: AuthService.getToken()
        }
      })
      .then(function(res) {
        carId = $window.localStorage.carId = res.data.data._id;
      // toastr success car added
      });
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

    carService.updateCar = function(data, carId) {
      return $http.put('/api/users/' + data._id + '/inventory/' + carId, data, {
        headers: {
          token: AuthService.getToken()
        }
      });
    };

    carService.deleteCar = function(data) {
      return $http.delete('/api/users/' + data._id + '/inventory/' + data.carId);
    };

    carService.getId = function(){
      return $window.localStorage.carId || carId;
    }
    return carService;
  }]);
