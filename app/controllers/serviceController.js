var serviceCtrl = angular.module('serviceCtrl', []);
galleryCtrl.controller('serviceController', ["$scope", "$window", "$http", "$location", "$routeParams", "filepickerService", "AuthService", "CarService", "toastr", "$q", "$document", "$sce",
                  function($scope, $window, $http, $location, $routeParams, filepickerService, AuthService, CarService, toastr, $q, $document, $sce){
    $scope.cars = [];
    //Retrieve all the cars to show the gallery
    $scope.getServiceData = function() {
      $scope.servicePics = [
      {image: "./assets/img/service/IMG_5794.jpg"},
      {image: "./assets/img/service/IMG_5889.jpg"},
      {image: "./assets/img/service/IMG_8897.jpg"},


    ]
    }

    var retrieveServiceDataFromApi = function() {
      // CarService.getCarsPublic()
      // .then(function(data){
      //     $scope.cars = removeSold(data.data);
      //     $window.localStorage.cars = JSON.stringify($scope.cars);
      //     $window.localStorage.carsDate = new Date();
      //     $window.localStorage.sold = JSON.stringify($scope.sold);
      // })
      // .catch(function(data) {
      //     console.log('Error: ' + data);
      // });
    }

}]);
