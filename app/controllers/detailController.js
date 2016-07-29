//Not Currently In Use and to be deleted as this functionality is now down by addCarController
'use strict';
var detailCtrl = angular.module('detailCtrl', []);
detailCtrl.controller('detailController', function($scope, $http, $routeParams, $window, filepickerService, AuthService){
  let url = 'http://localhost:3000/api/users/';
  var cUser = $window.localStorage.user;

    $scope.car = {};
    //get the id to query the db and retrieve the correct car
    var id = $routeParams.id;
    $scope.getCar = function() {
      console.log("this is get detail controller " + id)
      $http.get(url + cUser + '/inventory/' + id, {
        headers: {
          token: AuthService.getToken()
        }
      })
      .success(function(data){
          console.log(JSON.stringify(data));
          $scope.car = data;
      })
      .error(function(data) {
          console.log('Error: ' + data);
      });
    }
    $scope.upload = function(){
        filepickerService.pick(
            {
                mimetype: 'image/*',
                language: 'en',
                services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'IMAGE_SEARCH'
            },
            function(Blob){
                console.log(JSON.stringify(Blob));
                $scope.car.picture = Blob;
                $scope.$apply();
            }
        );
    };
    //Multiple files upload set to 3 as max number
    $scope.uploadMultiple = function(){
        filepickerService.pickMultiple(
            {
                mimetype: 'image/*',
                language: 'en',
                maxFiles: 20, //pickMultiple has one more option
                services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'IMAGE_SEARCH'
            },
      function(Blob){
                console.log(JSON.stringify(Blob));
                $scope.car.morePictures = Blob;
                $scope.$apply();
            }
        );
    };
    $scope.updateCar = function(){
        $http.put(url + cUser + '/inventory/' + id, $scope.car, {
          headers: {
            token: AuthService.getToken()
          }
        })
        .success(function(data){
            console.log(JSON.stringify(data));
            //Clean the form to allow the user to create new cars
            $scope.car = {};
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };

    $scope.deleteCar = function(data){
      console.log("this is deleteCar from aCC ", data)
        $http.delete(url + cUser + '/inventory/' + id, {
          headers: {
            token: AuthService.getToken()
          }
        })
        .success(function(data){
          filepickerService.remove(data);
            console.log(JSON.stringify(data));
            //Clean the form to allow the user to create new cars
            $scope.car = {};
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };
});
