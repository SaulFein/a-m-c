var serviceCtrl = angular.module('serviceCtrl', []);
galleryCtrl.controller('serviceController', ["$scope", "$window", "$http", "$location", "$routeParams", "filepickerService", "AuthService", "ServiceService", "toastr", "$q", "$document", "$sce",
                  function($scope, $window, $http, $location, $routeParams, filepickerService, AuthService, ServiceService, toastr, $q, $document, $sce){
    $scope.services = [];
    $scope.service = {};
    $scope.loadingService = false;

    var cUser = $window.sessionStorage.user;

    //Retrieve all the serivce images to show the carosel
    $scope.getServiceData = function() {
      $scope.servicePics = [
      {image: "./assets/img/service/IMG_5794.jpg"},
      {image: "./assets/img/service/IMG_5889.jpg"},
      {image: "./assets/img/service/IMG_8897.jpg"},


    ]
    }

    //Send the newly created service page to the server to store in the db
    $scope.createService = function() {
      if($scope.services.length > 0 ){
        $scope.updateService();
      } else {
        ServiceService.createService(cUser, $scope.service).then(function(data) {
                toastr.success("service saved")
            })
            .then(function() {
                $scope.retrieveServiceDataFromApi();
            }).catch(function(data) {
                toastr.error("error saving service")
            });
      }
    };

    $scope.retrieveServiceDataFromApi = function() {
      $scope.loadingService = true;
      ServiceService.getServicePublic()
      .then(function(data){
        $scope.services = data.data;
        $scope.service = data.data[0];
        $scope.loadingService = false;

      })
      .catch(function(data) {
          console.log('Error getting service data: ' + data);
      });
    }

    $scope.updateService = function() {
        ServiceService.updateService(cUser, $scope.service).then(function(data) {
                toastr.success("service page updated")
                // $scope.getCar();
            }).then(function() {
                $scope.retrieveServiceDataFromApi();
            }).catch(function(data) {
                toastr.error("error updating service");
            });
    };

}]);
