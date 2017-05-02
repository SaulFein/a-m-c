var galleryCtrl = angular.module('galleryCtrl', []);
galleryCtrl.controller('galleryController', function($scope, $http, $window, CarService){
    $scope.cars = [];
    //Retrieve all the cars to show the gallery
    $scope.getCars = function() {
      CarService.getCarsPublic()
      .then(function(data){
          // console.log("Loading Cars!");
          // console.log(JSON.stringify(data));
          $scope.cars = data.data;
          $window.localStorage.cars = JSON.stringify($scope.cars);
      })
      .catch(function(data) {
          console.log('Error: ' + data);
      });
    }


    // $http.get('/car')
    //     .then(function(data){
    //         console.log(JSON.stringify(data));
    //         $scope.cars = data;
    //     })
    //     .catch(function(data) {
    //         console.log('Error: ' + data);
    //     });

});
