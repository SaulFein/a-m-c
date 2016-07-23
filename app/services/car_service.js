'use strict';

var CarService = angular.module('CarService', []);
  app.factory('CarService', ['$http', 'AuthService','$window', function($http, AuthService, $window) {
    const mainRoute = "http://localhost:3000/api";
    let carId;
    let carService = {};

    carService.createCar = function(data) {
      return $http.post(mainRoute + '/users/' + data._id + '/inventory', data, {
        headers: {
          token: AuthService.getToken()
        }
      })
      .then((res)=>{
        carId = $window.localStorage.carId = res.data.data._id;
        console.log(res);
        console.log('this is userId ' + data._id);

      });
    };

    carService.getCars = function(userId) {
      return $http.get(mainRoute + '/users/' + userId + '/inventory', {
        headers: {
          token: AuthService.getToken()
        }
      });
    };

    carService.getCar = function(data) {
      return $http.get(mainRoute + '/users/' + data._id + '/inventory/' + data.carId, {
        headers: {
          token: AuthService.getToken()
        }
      });
    };

    // carService.getScoreId = function(data) {
    //   return $http.get(mainRoute + '/users/' + data.userId + '/scores?category=' + data.category + '&difficulty=' + data.difficulty, {
    //     headers: {
    //       token: AuthService.getToken()
    //     }
    //   });
    // }

    carService.updateCar = function(data, carId) {
      console.log(carId)
      return $http.put(mainRoute + '/users/' + data._id + '/inventory/' + carId, data, {
        headers: {
          token: AuthService.getToken()
        }
      });
    };

    carService.deleteCar = function(data) {
      return $http.delete(mainRoute + '/users/' + data._id + '/inventory/' + data.carId, {
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
