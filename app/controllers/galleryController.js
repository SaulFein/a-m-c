var galleryCtrl = angular.module('galleryCtrl', []);
galleryCtrl.controller('galleryController', [
  '$scope',
  '$http',
  '$window',
  'CarService',
  '$location',
  '$anchorScroll',
  'HomeService',
  function (
    $scope,
    $http,
    $window,
    CarService,
    $location,
    $anchorScroll,
    HomeService
  ) {
    $scope.cars = [];
    $scope.showHomeDefaultPics = false;
    //Retrieve all the cars to show the gallery
    $scope.getCars = function () {
      // if (!$window.localStorage.carsDate || !$window.localStorage.cars) {
      retrieveCarsFromApi();
      //   } else {
      //     let diffMins = null;
      //     if ($window.localStorage.carsDate) {
      //       let now = new Date();
      //       let carsDate = new Date($window.localStorage.carsDate);
      //       let dif = now - carsDate;
      //       diffMins = Math.round(((dif % 86400000) % 3600000) / 60000);
      //     }
      //     if (diffMins && diffMins > 8) {
      //       retrieveCarsFromApi();
      //     } else {
      //       $scope.cars = JSON.parse($window.localStorage.cars);
      //       if ($window.localStorage.sold) {
      //         $scope.sold = JSON.parse($window.localStorage.sold);
      //       }
      //     }
      //   }
    };
    $scope.gotoInventory = function () {
      $location.path('/gallery');
      // set the location.hash to the id of
      // the element you wish to scroll to.
      // $location.hash('home-inventory');

      // // call $anchorScroll()
      // $anchorScroll();
    };
    var retrieveCarsFromApi = function () {
      CarService.getCarsPublic()
        .then(function (data) {
          $scope.cars = removeSold(data.data);
          $window.localStorage.cars = JSON.stringify($scope.cars);
          $window.localStorage.carsDate = new Date();
          $window.localStorage.sold = JSON.stringify($scope.sold);
        })
        .catch(function (data) {
          console.log('Error: ', data);
        });
    };

    var removeSold = function (cars) {
      var sold = [];
      var availableInventory = [];
      var carsToSpliceByIndex = [];
      for (var i = 0; i < cars.length; i++) {
        if (cars[i].sold) {
          sold.push(cars[i]);
          cars.splice(i, 1);
          i--;
          carsToSpliceByIndex.push(i);
        }
      }
      $scope.sold = sold;
      return cars;
    };

    $scope.retrieveHomeDataFromApi = function () {
      $scope.loadingHome = true;
      HomeService.getHomePublic()
        .then(function (data) {
          $scope.homes = data.data;
          $scope.home = data.data[0];
          if ($scope.home) {
            if (!$scope.home.picture || !$scope.home.morePictures) {
              $scope.showHomeDefaultPics = true;
            } else {
              $scope.showHomeDefaultPics = false;
            }
            $scope.loadingHome = false;
          } else {
            $scope.showHomeDefaultPics = true;
          }
        })
        .catch(function (data) {
          console.log('Error getting home data: ', data);
        })
        .finally(($scope.loadingHome = false));
    };
  },
]);
