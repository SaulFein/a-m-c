'use strict';
var detailCtrl = angular.module('detailCtrl', []);
detailCtrl.controller('detailController', function($scope, $http, $routeParams, $window, filepickerService, AuthService, EmailService, toastr){
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

    $scope.sendEmail = function ()  {
      var email = {
        firstName: $scope.firstName,
        lastName: $scope.lastName,
        phone: $scope.phone,
        email: $scope.email,
        comments: "From: " + $scope.firstName + " " + $scope.firstName + " " + "Phone: " + $scope.phone + " " + $scope.comments,
        subject: $scope.car.year + " " + $scope.car.make + " " + $scope.car.model
      }
      EmailService.sendEmail(email)
      .then(function successCallback(email) {
        toastr.success("Email Sent");
        $scope.firstName = null;
        $scope.lastName = null;
        $scope.phone = null;
        $scope.email = null;
        $scope.comments = null;
            }, function errorCallback(response) {
              toastr.error("Error Sending Email");
          // called asynchronously if an error occurs
          // or server returns response with an error status.
            });;
    }

    //get the id to query the db and retrieve the correct car
    var id = $routeParams.id;
    $scope.getCar = function() {
      console.log("this is get detail controller " + id)
      // $http.get(url + '/inventory/' + id)
      $http.get('/inventory/' + id)
      .then(function(data){
          // console.log(JSON.stringify(data));
          $scope.car = data.data;
          $scope.slides.push({image: data.data.picture.url, title: 'Main Image'});
          for (var i = 0; i < data.data.morePictures.length; i++){
            console.log(data.data.morePictures[i].url)
            $scope.slides.push({image: data.data.morePictures[i].url, title: 'Image ' + i});
          }
          console.log("this is scope.slides ",  $scope.slides)
      })
      .catch(function(data) {
          console.log('Error: ' + data);
      });
    }
});
