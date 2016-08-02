'use strict';
var detailCtrl = angular.module('detailCtrl', []);
detailCtrl.controller('detailController', function($scope, $http, $routeParams, $window, filepickerService, AuthService){
  // let url = 'http://localhost:3000';

    $scope.car = {};
    //get the id to query the db and retrieve the correct car
    var id = $routeParams.id;
    $scope.getCar = function() {
      console.log("this is get detail controller " + id)
      // $http.get(url + '/inventory/' + id)
      $http.get('/inventory/' + id)
      .success(function(data){
          console.log(JSON.stringify(data));
          $scope.car = data;
      })
      .error(function(data) {
          console.log('Error: ' + data);
      });
    }
});
