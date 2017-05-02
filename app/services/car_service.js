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
        console.log(res);
        console.log('this is userId ' + data._id);

      });
    };

    carService.getCars = function(userId) {
      console.log("car service get carCars hit " + userId)
      return $http.get('/api/users/' + userId + '/inventory', {
        headers: {
          token: AuthService.getToken()
        }
      })

    };

    carService.getCarsPublic = function() {
      console.log("car service get carCarsPublic hit")
      return $http.get('/inventory')
    };

    // carService.getCar = function(data) {
    //   return $http.get(mainRoute + '/users/' + data._id + '/inventory/' + data.carId, {
    //     headers: {
    //       token: AuthService.getToken()
    //     }
    //   });
    // };
    // carService.getSignature = function(userId, policy){
    //   return $http.get('/api/users/' + userId + '/sig').then((res) => {
    //   })
    // }

    carService.updateCar = function(data, carId) {
      console.log(carId)
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
