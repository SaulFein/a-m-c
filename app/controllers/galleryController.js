var galleryCtrl = angular.module('galleryCtrl', []);
galleryCtrl.controller('galleryController', ["$scope", "$http", "$window", "CarService", function($scope, $http, $window, CarService){
    $scope.cars = [];
    //Retrieve all the cars to show the gallery
    $scope.getCars = function() {
      if($window.localStorage.carsDate === void 0 ||
        $window.localStorage.carsDate === null ||
        $window.localStorage.cars === void 0 ||
        $window.localStorage.cars === null){
          retrieveCarsFromApi()
        }
      else if($window.localStorage.carsDate !== void 0 && $window.localStorage.carsDate !== null){
        var now = new Date();
        var carsDate = new Date($window.localStorage.carsDate);
        var dif = now - carsDate;
        var diffMins = Math.round(((dif % 86400000) % 3600000) / 60000);
        if(diffMins > 8){
          retrieveCarsFromApi();
        }
        else {
          $scope.cars = JSON.parse($window.localStorage.cars);
          if($window.localStorage.sold){
            $scope.sold = JSON.parse($window.localStorage.sold);
          }
        }
      }
    }

    var retrieveCarsFromApi = function() {
      CarService.getCarsPublic()
      .then(function(data){
          $scope.cars = removeSold(data.data);
          $window.localStorage.cars = JSON.stringify($scope.cars);
          $window.localStorage.carsDate = new Date();
          $window.localStorage.sold = JSON.stringify($scope.sold);
      })
      .catch(function(data) {
          console.log('Error: ' + data);
      });
    }

    var removeSold = function(cars) {
      var sold = [];
      var availableInventory = [];
      var carsToSpliceByIndex = [];
      for(var i = 0; i < cars.length; i++) {
        if(cars[i].sold){
          sold.push(cars[i]);
          cars.splice(i, 1);
          i--;
          carsToSpliceByIndex.push(i);
        }
      }
      $scope.sold = sold;
      return cars;
    }
}]);
