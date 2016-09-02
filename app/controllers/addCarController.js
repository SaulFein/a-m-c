'use strict'; ///
var addCtrl = angular.module('addCarCtrl', []);
addCtrl.controller('addCarController', function($scope, $window, $http, $location, $routeParams, filepickerService, AuthService, CarService){
    // let url = 'http://localhost:3000/api/users/';
    var url = '/api/users/'
    var cUser = $window.localStorage.user;
    $scope.car = {};
    var carId;
    var id = $routeParams.id;
    $scope.car.morePictures = [];

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


    //Send the newly created car to the server to store in the db
    $scope.createCar = function(){
        $http.post(url + cUser + '/inventory', $scope.car, {
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

    $scope.updateCar = function(){
        $http.put(url + cUser + '/inventory/' + id, $scope.car, {
          headers: {
            token: AuthService.getToken()
          }
        })
        .success(function(data){
            console.log(JSON.stringify(data));
            $scope.getCar();
            //Clean the form to allow the user to create new cars
            // $scope.car = {};
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };

    $scope.deleteCar = function(data){
      console.log("this is deleteCar from aCC ", data)
      console.log("This is data.picture.url " + data.picture.url)
      var fpHolder = data.picture.url;
      if(data.morePictures){
        var fpMHolder = data.morePictures;
      }
        $http.delete(url + cUser + '/inventory/' + id, {
          headers: {
            token: AuthService.getToken()
          }
        })
        .success(function(data){
          filepickerService.remove(fpHolder)
          if(fpMHolder){
            for(var i = 0; i < fpMHolder.length; i++) {
              filepickerService.remove(fpMHolder[i].url);
            }
          }
            console.log(JSON.stringify(data));
            //Clean the form to allow the user to create new cars
            $scope.car = {};
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };

    $scope.getCar = function() {
      console.log("this is get detail controller " + id)
      $http.get(url + cUser + '/inventory/' + id, {
        headers: {
          token: AuthService.getToken()
        }
      })
      .success(function(data){
        $scope.slides = [];
        console.log("this is scope.slides!!!! ", $scope.slides)
        // console.log(JSON.stringify(data));
        $scope.car = data;
        if (data.morePictures) {
          for (var i = 0; i < data.morePictures.length; i++){
            console.log("This is data.morePictures[" + i + "]." + data.morePictures[i].url);
          }
          $scope.slides.push({image: data.picture.url, title: 'Main Image'});
          for (var i = 0; i < data.morePictures.length; i++){
            console.log(data.morePictures[i].url)
            $scope.slides.push({image: data.morePictures[i].url, title: 'Image ' + i});
          }
        }
      })
      .error(function(data) {
          console.log('Error: ' + data);
      });
    }
///////////////////////////////////////////////////////////
//////////////////file picker functions////////////////////

//Single file upload, you can take a look at the options
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
    //Multiple files upload set to 20 as max number
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
                if(!$scope.car.morePictures){
                  $scope.car.morePictures = Blob;
                } else {
                  for(var i = 0; i < Blob.length; i++){
                    $scope.car.morePictures.push(Blob[i]);
                  }
                }
                $scope.$apply();
                console.log("THIS IS SCOPE.MOREPICUTERS " , $scope.car.morePictures);
            }
        );
    };

    $scope.uploadOne = function(){
        filepickerService.pick(
            {
                mimetype: 'image/*',
                language: 'en',
                services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'IMAGE_SEARCH'
            },
      function(Blob){
                console.log(JSON.stringify(Blob));
                $scope.car.morePictures.push(Blob);
                $scope.$apply();
            }
        );
    };

    $scope.removeImage = function(data){
      var fpHolder = data.picture.url;
      filepickerService.remove(fpHolder);
      console.log(fpHolder + " has been removed!");
      delete data.picture;

    }

    var getIndexIfObjWithOwnAttr = function(array, attr, value) {
      for(var i = 0; i < array.length; i++) {
        if(array[i].hasOwnProperty(attr) && array[i][attr] === value) {
          return i;
        }
      }
      return -1;
    }

    $scope.removeMoreImage = function(image, data){
      var index = getIndexIfObjWithOwnAttr(data.morePictures, 'url', image);
      // var fpMHolder = data.morePictures;
      // var index = data.morePictures.url.indexOf(image);
      console.log("this is index: " + index)
      data.morePictures.splice(index, 1);
      console.log("data.morePictures after splice ", data.morePictures);
      filepickerService.remove(image);
      console.log(image + " has been removed!");

    }

    //////////////////////////////////////////////////
    $scope.checkToken = function() {
      if(!$window.localStorage.token){
        $location.path('/')
      }
    }
});

//{"make":"Yellow Cars","model":"YCC","year":"2000","color":"Yellow","picture":{"url":"https://cdn.filepicker.io/api/file/ycuIeagMR9SKv7VcKt9J","filename":"yellowcar.jpg","mimetype":"image/jpeg","size":981938,"id":1,"client":"computer","isWriteable":true},"morePictures":[{"url":"https://cdn.filepicker.io/api/file/UV34kbR3TnCS8lCSSTjC","filename":"yellowcar3.jpg","mimetype":"image/jpeg","size":1038161,"id":1,"client":"computer","isWriteable":true},{"url":"https://cdn.filepicker.io/api/file/biU1AUEsTAq3o46NTcdB","filename":"yellowcar2.jpg","mimetype":"image/jpeg","size":105175,"id":2,"client":"computer","isWriteable":true}]}eable":true}}
