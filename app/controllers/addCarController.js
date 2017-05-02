'use strict'; ///
var addCtrl = angular.module('addCarCtrl', []);
addCtrl.controller('addCarController', function($scope, $window, $http, $location, $routeParams, filepickerService, AuthService, CarService) {
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
                console.log(JSON.stringify(data));
                //Clean the form to allow the user to create new cars
                $scope.car = {};
            })
            .catch(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.updateCar = function() {
        $http.put(url + cUser + '/inventory/' + id, $scope.car, {
                headers: {
                    token: AuthService.getToken()
                }
            })
            .then(function(data) {
                console.log(JSON.stringify(data));
                $scope.getCar();
                //Clean the form to allow the user to create new cars
                // $scope.car = {};
            })
            .catch(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.deleteCar = function(data) {
        console.log("this is deleteCar from aCC ", data)
            // console.log("This is data.picture.url " + data.picture.url)
        var fpHolder = data.picture.url;
        var policy = createPolicy(data.picture.url);
        var signature = createSignature(policy, 'MACNUIVXAJBMFDMNMVYIBRBHQM')
        if (data.morePictures) {
            var fpMHolder = data.morePictures;
        }
        $http.delete(url + cUser + '/inventory/' + id, {
                headers: {
                    token: AuthService.getToken()
                }
            })
            .then(function(data) {
                filepickerService.remove(fpHolder,
                  {
                    policy: policy,
                    signature: signature
                  },
                  function(){
                    console.log("Removed");
                  }
                )
                if (fpMHolder) {
                    for (var i = 0; i < fpMHolder.length; i++) {
                      var policy = createPolicy(fpMHolder[i].url);
                      var signature = createSignature(policy, 'MACNUIVXAJBMFDMNMVYIBRBHQM')
                        filepickerService.remove(fpMHolder[i].url,
                          {
                            policy: policy,
                            signature: signature
                          },
                          function(){
                            console.log("Removed");
                          }
                        );
                    }
                }
                console.log(JSON.stringify(data));
                //Clean the form to allow the user to create new cars
                $scope.car = {};

                $scope.go('/admin-inventory')

            })
            .catch(function(data) {
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
                .then(function(data) {
                    $scope.slides = [];
                    console.log("this is scope.slides!!!! ", $scope.slides)
                        // console.log(JSON.stringify(data));
                    $scope.car = data.data;
                    if (data.data.morePictures) {
                        for (var i = 0; i < data.data.morePictures.length; i++) {
                            console.log("This is data.morePictures[" + i + "]." + data.data.morePictures[i].url);
                        }
                        $scope.slides.push({ image: data.data.picture.url, title: 'Main Image' });
                        for (var i = 0; i < data.data.morePictures.length; i++) {
                            console.log(data.data.morePictures[i].url)
                            $scope.slides.push({ image: data.data.morePictures[i].url, title: 'Image ' + i });
                        }
                    }
                })
                .catch(function(data) {
                    console.log('Error: ' + data);
                });
        }
        ///////////////////////////////////////////////////////////
        //////////////////file picker functions////////////////////

    //Single file upload, you can take a look at the options
    $scope.upload = function() {
        filepickerService.pick({
                mimetype: 'image/*',
                language: 'en',
                services: ['COMPUTER', 'DROPBOX', 'GOOGLE_DRIVE', 'IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'IMAGE_SEARCH'
            },
            function(Blob) {
                console.log(JSON.stringify(Blob));
                $scope.car.picture = Blob;
                $scope.$apply();
            }
        );
    };
    //Multiple files upload set to 20 as max number
    $scope.uploadMultiple = function() {
        filepickerService.pickMultiple({
                mimetype: 'image/*',
                language: 'en',
                maxFiles: 20, //pickMultiple has one more option
                services: ['COMPUTER', 'DROPBOX', 'GOOGLE_DRIVE', 'IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'IMAGE_SEARCH'
            },
            function(Blob) {
                console.log(JSON.stringify(Blob));
                if (!$scope.car.morePictures) {
                    $scope.car.morePictures = Blob;
                } else {
                    for (var i = 0; i < Blob.length; i++) {
                        $scope.car.morePictures.push(Blob[i]);
                    }
                }
                $scope.$apply();
                console.log("THIS IS SCOPE.MOREPICUTERS ", $scope.car.morePictures);
            }
        );
    };

    $scope.uploadOne = function() {
        filepickerService.pick({
                mimetype: 'image/*',
                language: 'en',
                services: ['COMPUTER', 'DROPBOX', 'GOOGLE_DRIVE', 'IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'IMAGE_SEARCH'
            },
            function(Blob) {
                console.log(JSON.stringify(Blob));
                $scope.car.morePictures.push(Blob);
                $scope.$apply();
            }
        );
    };

    $scope.removeImage = function(data) {
      var policy = createPolicy(data.picture.url);
      // var newSig = $scope.getSig();
      var signature = createSignature(policy, 'MACNUIVXAJBMFDMNMVYIBRBHQM')
      var fpHolder = data.picture.url;
        filepickerService.remove(fpHolder,
          {
                  policy: policy,
                  signature: signature
                },
                function(){
                  console.log("Removed");
                }
        );
        console.log(fpHolder + " has been removed!");
        delete data.picture;

    }

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

    // $scope.removeMoreImage = function(image, data) {
    //     var index = getIndexIfObjWithOwnAttr(data.morePictures, 'url', image);
    //     // var fpMHolder = data.morePictures;
    //     // var index = data.morePictures.url.indexOf(image);
    //     console.log("this is index: " + index)
    //     data.morePictures.splice(index, 1);
    //     // console.log("data.morePictures after splice ", data.morePictures);
    //     filepickerService.remove(image);
    //     $('#confirm-modal-more').modal('hide');
    //     $('body').removeClass('modal-open');
    //     $('.modal-backdrop').remove();
    //     console.log(image + " has been removed!");
    //
    // }s
    var createPolicy = function(url) {
      var handle = url.match(/[^\/]*$/);
      var expiry =  Math.floor(new Date().getTime() / 1000 + 60*60)
      var polObject = JSON.stringify({handle: handle[0], expiry: expiry});
      return btoa(polObject);
    }
    var createSignature = function(policy, key) {
      return CryptoJS.HmacSHA256(policy, key);
    };
    $scope.removeMoreImage = function(data) {
        var index = $scope.selectedImageForRemoval;
        var image = data.morePictures[index];
        var policy = createPolicy(image.url);
        // var newSig = $scope.getSig();
        var signature = createSignature(policy, 'MACNUIVXAJBMFDMNMVYIBRBHQM')
        // var fpMHolder = data.morePictures;
        // var index = data.morePictures.url.indexOf(image);
        console.log("this is index: " + index)
        data.morePictures.splice(index, 1);
        // console.log("data.morePictures after splice ", data.morePictures);
        filepickerService.remove(image.url,
          {
            policy: policy,
            signature: signature
          },
          function(){
            console.log("Removed");
            $scope.updateCar()
          })
        $('#confirm-modal-more').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        console.log(image + " has been removed!");

    }
    //////////////////////////////////////////////////
    $scope.checkToken = function() {
        if (!$window.localStorage.token) {
            $location.path('/')
        }
    }
    $scope.consoleThis = function() {
        console.log("shit happened")
    }

    $scope.go = function(path) {
        $location.path(path);
        $('#delete-modal-main').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
    };
    // $scope.getSig = function() {
    //   CarService.getSignature(cUser).then((data) => {
    //     return data;
    //   })
    // }
    // $scope.getSig = function(policy) {
    //   CarService.getSignature(cUser, policy).then((data) => {
    //     return data;
    //   })
});
