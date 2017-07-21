var galleryCtrl = angular.module('galleryCtrl', []);
galleryCtrl.controller('galleryController', ["$scope", "$http", "$window", "CarService", function($scope, $http, $window, CarService){
    $scope.cars = [];
    //Retrieve all the cars to show the gallery
    $scope.getCars = function() {
      CarService.getCarsPublic()
      .then(function(data){

          $scope.cars = data.data;
          $window.localStorage.cars = JSON.stringify($scope.cars);
      })
      .catch(function(data) {
          console.log('Error: ' + data);
      });
    }
}]);
