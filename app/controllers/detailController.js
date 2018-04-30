'use strict';
var detailCtrl = angular.module('detailCtrl', []);
detailCtrl.controller('detailController', ["$scope", "$rootScope", "$http", "$routeParams", "$window", "filepickerService", "AuthService", "EmailService", "toastr", "$document",
function($scope, $rootScope, $http, $routeParams, $window, filepickerService, AuthService, EmailService, toastr, $document){
  // let url = 'http://localhost:3000';

    $scope.car = {};
    $scope.slides = [];
    $scope.thumbs = [];
    $scope.tiles = [];
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
        comments: '<b>From: </b>' + $scope.firstName + ' ' + $scope.lastName + '<br> ' + '<b>Phone: </b>' + $scope.phone +  '<br> ' + '<b>Email: </b>' + $scope.email + '<br> ' + $scope.comments,
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
    $scope.scrollToTop = function() {
      var someElement = angular.element(document.getElementById('topofthepage'));
      $document.scrollToElement(someElement, 0, 750);
    }

    var getFileThumbUrl = function (fileUrl) {
      var str = fileUrl;
      var res = str.replace("https://cdn.filepicker.io/api/file/", "https://process.filestackapi.com/resize=width:300/");
      return res;
    }

    var getFileTileUrl = function (fileUrl) {
      var str = fileUrl;
      var res = str.replace("https://cdn.filepicker.io/api/file/", "https://process.filestackapi.com/resize=width:700/");
      return res;
    }


    //get the id to query the db and retrieve the correct car


    var id = $routeParams.id;
    $scope.getCar = function() {
      $http.get('/inventory/' + id)
      .then(function(data){
          $scope.car = data.data;
          $scope.slides.push({image: data.data.picture.url, title: 'Main Image'});
          var thumbUrl = getFileThumbUrl(data.data.picture.url);
          $scope.thumbs.push({image: thumbUrl, title:"Main Image Thumb"});
          var tileUrl = getFileTileUrl(data.data.picture.url);
          $scope.tiles.push({image: tileUrl, title:"Main Image Tile"});
          for (var i = 0; i < data.data.morePictures.length; i++){
            var thumbUrl = getFileThumbUrl(data.data.morePictures[i].url);
            $scope.thumbs.push({image: thumbUrl, title:"Image Thumb" + i});
            var tileUrl = getFileTileUrl(data.data.morePictures[i].url);
            $scope.tiles.push({image: tileUrl, title:"Image Tile" + i});
            $scope.slides.push({image: data.data.morePictures[i].url, title: 'Image ' + i});
          }
      })
      .catch(function(data) {
          console.log('Error: ' + data);
      });
    }

    $(window).on('popstate', function() {
      $('.modal').modal('hide');
      $(".modal-backdrop").remove();
      $(".in").remove();
      $('body').removeClass('modal-open');
    });
}]);


// https://cdn.filepicker.io/api/file/nhYVFvETTWTYzVMG6Fll
//
// https://process.filestackapi.com/resize=width:200/nhYVFvETTWTYzVMG6Fll
