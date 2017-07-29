'use strict';
var detailCtrl = angular.module('detailCtrl', []);
detailCtrl.controller('detailController', ["$scope", "$rootScope", "$http", "$routeParams", "$window", "filepickerService", "AuthService", "EmailService", "toastr", function($scope, $rootScope, $http, $routeParams, $window, filepickerService, AuthService, EmailService, toastr){
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

    //get the id to query the db and retrieve the correct car
    var id = $routeParams.id;
    $scope.getCar = function() {
      $http.get('/inventory/' + id)
      .then(function(data){
          $scope.car = data.data;
          $scope.slides.push({image: data.data.picture.url, title: 'Main Image'});
          for (var i = 0; i < data.data.morePictures.length; i++){
            $scope.slides.push({image: data.data.morePictures[i].url, title: 'Image ' + i});
          }
      })
      .catch(function(data) {
          console.log('Error: ' + data);
      });
    }

    // var lastSegment;
    // $(".modal").on("shown.bs.modal", function()  { // any time a modal is shown
    //   var url = document.location.href;
    //   lastSegment = url.split('/').pop();
    //   var urlReplace = "#/" + $(this).attr('id'); // make the hash the id of the modal shown
    //   history.pushState(null, null, urlReplace); // push state that hash into the url
    // });
    //
    $(window).on('popstate', function() {
      $('.modal').modal('hide');
      $(".modal-backdrop").remove();
      $(".in").remove();
      $('body').removeClass('modal-open');
    });
    //
    // $(".modal").on("hidden.bs.modal", function()  { // any time a modal is hidden
    //     var urlReplace = window.location.toString().split('#', 1)[0]
    //     history.pushState(null, null, urlReplace + '#/car/' + lastSegment); // push url without the hash as new history item
    // });
}]);
