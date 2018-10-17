'use strict'; ///
var addCtrl = angular.module('addCarCtrl', []);
addCtrl.controller('addCarController', ["$scope", "$window", "$http", "$location", "$routeParams", "filepickerService", "AuthService", "CarService", "toastr", function($scope, $window, $http, $location, $routeParams, filepickerService, AuthService, CarService, toastr) {
    // let url = 'http://localhost:3000/api/users/';
    var url = '/api/users/'
    var cUser = $window.localStorage.user;
    $scope.car = {};
    var carId;
    var id = $routeParams.id;
    $scope.car.morePictures = [];

    $scope.sortableOptions = {
      'ui-floating': true
    };

    $scope.slides = [];
    $scope.myInterval = 1000;
    $scope.currentIndex = 0;
    var slides = $scope.slides;

    $scope.showCarFax = function (car) {
      if(car.carfax == "N/A" || car.carfax == "false"){
        return false;
      } else if(car.carfax == "true"){
        return true;
      }
    }

    $scope.setCurrentSlideIndex = function(index) {
        $scope.currentIndex = index;
    };
    $scope.isCurrentSlideIndex = function(index) {
        return $scope.currentIndex === index;
    };
    $scope.prevSlide = function() {
        $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
    };
    $scope.nextSlide = function() {
        $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.slides.length - 1;
    };

    //Send the newly created car to the server to store in the db
    $scope.createCar = function() {
        $http.post(url + cUser + '/inventory', $scope.car, {
                headers: {
                    token: AuthService.getToken()
                }
            })
            .then(function(data) {
              toastr.success("car saved")
                //Clean the form to allow the user to create new cars
                $scope.car = {};

            })
            .then(function() {
              CarService.getCarsPublic()
              .then(function(data){
                  $scope.cars = data.data;
                  $window.localStorage.cars = JSON.stringify($scope.cars);
                  $window.localStorage.carsDate = new Date();
              })
              .catch(function(data) {
                  console.log('Error: ' + data);
              });
            })
            .catch(function(data) {
              toastr.error("error saving car")
            });
    };

    $scope.updateCar = function() {
        $http.put(url + cUser + '/inventory/' + id, $scope.car, {
                headers: {
                    token: AuthService.getToken()
                }
            })
            .then(function(data) {
              toastr.success("car updated")
                $scope.getCar();
            })
            .then(function() {
              CarService.getCarsPublic()
              .then(function(data){
                  $scope.cars = data.data;
                  $window.localStorage.cars = JSON.stringify($scope.cars);
                  $window.localStorage.carsDate = new Date();

              })
              .catch(function(data) {
                  console.log('Error: ' + data);
              });
            })
            .catch(function(data) {
              toastr.error("error updating car")

            });
    };

    $scope.deleteCar = function(data) {
      if(data.picture !== undefined){
        var fpHolder = data.picture.url;
        $scope.policy = createPolicy(fpHolder);
        $scope.sig = $scope.getSig($scope.policy);
        if (data.morePictures.length > 0) {
            var fpMHolder = data.morePictures;
        }
      }
        $http.delete(url + cUser + '/inventory/' + id, {
                headers: {
                    token: AuthService.getToken()
                }
            })
            .then(function(data) {
              if(fpHolder !== undefined){
                filepickerService.remove(fpHolder,
                  {
                    policy: $scope.policy,
                    signature: $scope.sig
                  },
                  function(){
                    // console.log("car removed ", data)
                  }
                )
                if (fpMHolder) {
                    for (var i = 0; i < fpMHolder.length; i++) {
                      var policy = createPolicy(fpMHolder[i].url);
                      var sig = $scope.getSig(policy);
                        filepickerService.remove(fpMHolder[i].url,
                          {
                            policy: policy,
                            signature: sig
                          },
                          function(){
                            // console.log("car removed ", data)
                          }
                        );
                    }
                }
              };
                //Clean the form to allow the user to create new cars
                $scope.car = {};
                $scope.sig = null;
                $scope.policy = null;
                toastr.success("car deleted")
            })
            .then(function() {
              CarService.getCarsPublic()
              .then(function(data){
                  $scope.cars = data.data;
                  $window.localStorage.cars = JSON.stringify($scope.cars);
                  $window.localStorage.carsDate = new Date();
                  $scope.go('/admin-inventory');
              })
              .catch(function(data) {
                  console.log('Error: ' + data);
              });
            })

            .catch(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.getCar = function() {
            $http.get(url + cUser + '/inventory/' + id, {
                    headers: {
                        token: AuthService.getToken()
                    }
                })
                .then(function(data) {
                    $scope.slides = [];
                        // console.log(JSON.stringify(data));
                    $scope.car = data.data;
                    if (data.data.morePictures) {
                        for (var i = 0; i < data.data.morePictures.length; i++) {
                        }
                        $scope.slides.push({ image: data.data.picture.url, title: 'Main Image' });
                        for (var i = 0; i < data.data.morePictures.length; i++) {
                            $scope.slides.push({ image: data.data.morePictures[i].url, title: 'Image ' + i });
                        }
                    }
                })
                .catch(function(data) {
                    console.log('Error: ' + data);
                });
    };
        ///////////////////////////////////////////////////////////
        //////////////////file picker functions////////////////////

    //Single file upload, you can take a look at the options
    $scope.upload = function() {
        filepickerService.pick({
                mimetype: 'image/*',
                imageMax: [1920, 1280],
                imageQuality: 60,
                language: 'en',
                services: ['COMPUTER', 'DROPBOX', 'GOOGLE_DRIVE', 'IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'IMAGE_SEARCH'
            },
            function(Blob) {
                $scope.car.picture = Blob;
                $scope.$apply();
        })
    };
    //Multiple files upload set to 100 as max number
    $scope.uploadMultiple = function() {
        filepickerService.pickMultiple({
                mimetype: 'image/*',
                imageDim: [1920, 1280],
                imageQuality: 60,
                language: 'en',
                maxFiles: 100, //pickMultiple has one more option
                services: ['COMPUTER', 'DROPBOX', 'GOOGLE_DRIVE', 'IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'IMAGE_SEARCH'
            },
            function(Blob) {
                if (!$scope.car.morePictures) {
                    $scope.car.morePictures = Blob;
                } else {
                    for (var i = 0; i < Blob.length; i++) {
                        $scope.car.morePictures.push(Blob[i]);
                    }
                }
                $scope.$apply();
            }
        );
    };

    $scope.uploadOne = function() {
        filepickerService.pick({
                mimetype: 'image/*',
                imageDim: [1920, 1280],
                imageQuality: 60,
                language: 'en',
                services: ['COMPUTER', 'DROPBOX', 'GOOGLE_DRIVE', 'IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'IMAGE_SEARCH'
            },
            function(Blob) {
                $scope.car.morePictures.push(Blob);
                $scope.$apply();
            }
        );
    };

//// upload and updateCar
    $scope.uploadAndUp = function() {
        filepickerService.pick({
                mimetype: 'image/*',
                imageDim: [1920, 1280],
                imageQuality: 60,
                language: 'en',
                services: ['COMPUTER', 'DROPBOX', 'GOOGLE_DRIVE', 'IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'IMAGE_SEARCH'
            },
            function(Blob) {
                $scope.car.picture = Blob;
                $scope.$apply();
                $scope.updateCar();
            }
        );
    };
    //Multiple files upload set to 100 as max number
    $scope.uploadMultipleAndUp = function() {
        filepickerService.pickMultiple({
                mimetype: 'image/*',
                language: 'en',
                imageDim: [1920, 1280],
                imageQuality: 60,
                maxFiles: 100, //pickMultiple has one more option
                services: ['COMPUTER', 'DROPBOX', 'GOOGLE_DRIVE', 'IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'IMAGE_SEARCH'
            },
            function(Blob) {
                if (!$scope.car.morePictures) {
                    $scope.car.morePictures = Blob;
                } else {
                    for (var i = 0; i < Blob.length; i++) {
                        $scope.car.morePictures.push(Blob[i]);
                    }
                }
                $scope.$apply();
                $scope.updateCar();
            }
        );
    };

    $scope.uploadOneAndUp = function() {
        filepickerService.pick({
                mimetype: 'image/*',
                imageDim: [1920, 1280],
                imageQuality: 60,
                language: 'en',
                services: ['COMPUTER', 'DROPBOX', 'GOOGLE_DRIVE', 'IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'IMAGE_SEARCH'
            },
            function(Blob) {
                $scope.car.morePictures.push(Blob);
                $scope.$apply();
                $scope.updateCar();
            }
        );
    };

    $scope.removeImage = function(data) {
      var policy = createPolicy(data.picture.url);
      var sig = $scope.getSig(policy);
      var fpHolder = data.picture.url;
        filepickerService.remove(fpHolder,
          {
                  policy: policy,
                  signature: sig
                },
                function(){

                }
        );
        // toast removed
        delete data.picture;
    };

    var getIndexIfObjWithOwnAttr = function(array, attr, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].hasOwnProperty(attr) && array[i][attr] === value) {
                return i;
            }
        }
        return -1;
    }
    $scope.setSelected = function(selected) {
      $scope.selectedImageForRemoval = selected;
    }

    var createPolicy = function(url) {
      var handle = url.match(/[^\/]*$/);
      var expiry =  Math.floor(new Date().getTime() / 1000 + 60*60)
      var polObject = JSON.stringify({handle: handle[0], expiry: expiry});
      return btoa(polObject);
    }

    $scope.removeMoreImage = function(data) {
        var index = $scope.selectedImageForRemoval;
        var image = data.morePictures[index];
        var policy = createPolicy(image.url);
        var sig = $scope.getSig(policy);
        data.morePictures.splice(index, 1);
        filepickerService.remove(image.url,
          {
            policy: policy,
            signature: sig
          },
          function(){
            $scope.updateCar()
          })
        $('#confirm-modal-more').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
    }
    //////////////////////////////////////////////////
    $scope.checkToken = function() {
        if (!$window.localStorage.token) {
            $location.path('/')
        }
    }

    $scope.go = function(path) {
        $location.path(path);
        $('#delete-modal-main').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
    };

    $scope.getSig = function(policy) {
      var myPolicy = {pol: policy};
      var sig = CarService.getSignature(cUser, myPolicy).then( function(data) {
        return data;
      })
      return sig;
    };
    $scope.validateUpload = function() {
      var make;
      var model;
      var year;
      if($scope.car.make !== "" && $scope.car.make !== null && $scope.car.make !== void 0) {
        make = true;
      }
      if($scope.car.model !== "" && $scope.car.model !== null && $scope.car.model !== void 0) {
        model = true;
      }
      if($scope.car.year !== "" && $scope.car.year !== null && $scope.car.year !== void 0) {
        year = true;
      }
      if(make === true && model === true && year === true){
        return true;
      } else {
        return false;
      }
    };

}]);
