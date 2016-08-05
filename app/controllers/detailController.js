'use strict';
var detailCtrl = angular.module('detailCtrl', []);
detailCtrl.controller('detailController', function($scope, $http, $routeParams, $window, filepickerService, AuthService){
  // let url = 'http://localhost:3000';

    $scope.car = {};
    $scope.slides = [];
    $scope.myInterval = 1000;
    $scope.currentIndex = 0;
    var slides = $scope.slides;

    $scope.setCurrentSlideIndex = function (index) {
        $scope.currentIndex = index;
    };
    $scope.isCurrentSlideIndex = function (index) {
        return $scope.currentIndex === index;
    };
    $scope.prevSlide = function () {
        $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
    };
    $scope.nextSlide = function () {
        $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.slides.length - 1;
    };

    //get the id to query the db and retrieve the correct car
    var id = $routeParams.id;
    $scope.getCar = function() {
      console.log("this is get detail controller " + id)
      // $http.get(url + '/inventory/' + id)
      $http.get('/inventory/' + id)
      .success(function(data){
          // console.log(JSON.stringify(data));
          $scope.car = data;
          for (var i = 0; i < data.morePictures.length; i++){
            console.log(data.morePictures[i].url)
            $scope.slides.push({image: data.morePictures[i].url, title: 'Image ' + i});
          }
          console.log("this is scope.slides ",  $scope.slides)
      })
      .error(function(data) {
          console.log('Error: ' + data);
      });
    }
});
