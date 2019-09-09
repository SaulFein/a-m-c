'use strict'; ///
var addCtrl = angular.module('addCarCtrl', []);
addCtrl.controller('addCarController', ["$scope", "$window", "$http", "$location", "$routeParams", "filepickerService", "AuthService", "CarService", "toastr", "$q", "$document",
                  function($scope, $window, $http, $location, $routeParams, filepickerService, AuthService, CarService, toastr, $q, $document) {
    // let url = 'http://localhost:3000/api/users/';
    var url = '/api/users/'
    var cUser = $window.sessionStorage.user;
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

    $scope.showCarFax = function(car) {
        if (car.carfax == "N/A" || car.carfax == "false") {
            return false;
        } else if (car.carfax == "true") {
            return true;
        }
    }

    var removeSold = function(cars) {
        var sold = [];
        var availableInventory = [];
        var carsToSpliceByIndex = [];
        for (var i = 0; i < cars.length; i++) {
            if (cars[i].sold) {
                sold.push(cars[i]);
                cars.splice(i, 1);
                i--;
                carsToSpliceByIndex.push(i);
            }
        }
        $scope.sold = sold;
        return cars;
    }

    $scope.scrollToTop = function() {
      var someElement = angular.element(document.getElementById('topofthepage'));
      $document.scrollToElement(someElement, 0, 750);
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
        CarService.createCar(cUser, $scope.car).then(function(data) {
                toastr.success("car saved")
                //Clean the form to allow the user to create new cars
                $scope.car = {};
            })
            .then(function() {
                CarService.getCarsPublic().then(function(data) {
                        $scope.cars = removeSold(data.data);
                        $window.localStorage.cars = JSON.stringify($scope.cars);
                        $window.localStorage.carsDate = new Date();
                        $window.localStorage.sold = JSON.stringify($scope.sold);
                    }).catch(function(data) {
                        console.log('Error: ' + data);
                    });
            }).catch(function(data) {
                toastr.error("error saving car")
            });
    };

    $scope.updateCar = function() {
        CarService.updateCar(cUser, $scope.car).then(function(data) {
                toastr.success("car updated")
                $scope.getCar();
            }).then(function() {
                CarService.getCarsPublic().then(function(data) {
                        $scope.cars = removeSold(data.data);
                        $window.localStorage.cars = JSON.stringify($scope.cars);
                        $window.localStorage.carsDate = new Date();
                        $window.localStorage.sold = JSON.stringify($scope.sold);

                    }).catch(function(data) {
                        console.log('Error: ' + data);
                    });
            }).catch(function(data) {
                toastr.error("error updating car");
            });
    };


    var removeMultPicks = function(fpMHolder) {
        var promises = [];
        for (var i = 0; i < fpMHolder.length; i++) {
            var policy = createPolicy(fpMHolder[i].url);
            var pointer = 0;
            var promise = getSig(policy).then(function(data) {
                var sig = data.data;
                filepickerService.remove(fpMHolder[pointer++].url, {
                        policy: policy,
                        signature: sig
                    },
                    function() {}
                )
            })
            promises.push(promise);

        }
        $q.all(promises).then(function(){
        })
    }

    $scope.deleteCar = function(data) {
        if (data.picture !== undefined) {
            var fpHolder = data.picture.url;
            var policy = createPolicy(fpHolder);
            if (data.morePictures.length > 0) {
                var fpMHolder = data.morePictures;
            }
            getSig(policy).then(function(data) {
                    var sig = data.data;
                    CarService.deleteCar(cUser, $scope.car).then(function(data) {
                        if (fpHolder !== undefined) {
                            filepickerService.remove(fpHolder, {
                                    policy: policy,
                                    signature: sig
                                },
                                function() {}
                            )
                        }
                    }).then(function () {
                      if (fpMHolder) {
                          removeMultPicks(fpMHolder);
                      }
                    }).finally(function() {
                        //Clean the form to allow the user to create new cars
                        $scope.car = {};
                        toastr.success("car deleted")
                    })
                }).then(function() {
                    CarService.getCarsPublic()
                        .then(function(data) {
                            $scope.cars = removeSold(data.data);
                            $window.localStorage.cars = JSON.stringify($scope.cars);
                            $window.localStorage.carsDate = new Date();
                            $window.localStorage.sold = JSON.stringify($scope.sold);
                            $scope.go('/admin-inventory');
                        })
                        .catch(function(data) {
                            console.log('Error: ' + data);
                        });
                })
                .catch(function(data) {
                    console.log('Error: ' + data);
                });
        }
    };

    $scope.getCar = function() {
        CarService.getCar(cUser, id).then(function(data) {
          $scope.slides = [];

          // console.log(JSON.stringify(data));
          $scope.car = data.data;
          if (data.data.morePictures) {
              for (var i = 0; i < data.data.morePictures.length; i++) {}
              $scope.slides.push({
                  image: data.data.picture.url,
                  title: 'Main Image'
              });
              for (var i = 0; i < data.data.morePictures.length; i++) {
                  $scope.slides.push({
                      image: data.data.morePictures[i].url,
                      title: 'Image ' + i
                  });
              }
          }
        }).catch(function(data) {
            console.log('Error: ' + data);
        });
    };
    ///////////////////////////////////////////////////////////
    //////////////////file picker functions////////////////////

    //Single file upload, you can take a look at the options
    $scope.upload = function(data) {
        var policy = createPolicy();
        getSig(policy).then(function(data) {
            var sig = data.data;
            filepickerService.pick({
                    mimetype: 'image/*',
                    policy: policy,
                    signature: sig,
                    imageMax: [1920, 1280],
                    imageQuality: 60,
                    language: 'en',
                    services: ['COMPUTER', 'DROPBOX', 'GOOGLE_DRIVE', 'IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                    openTo: 'COMPUTER'
                },
                function(Blob) {
                    $scope.car.picture = Blob;
                    $scope.$apply();
                })
        });
    };

    //Single file upload, you can take a look at the options
    $scope.uploadCarfax = function(data) {
        filepickerService.pick({
                language: 'en',
                services: ['COMPUTER', 'DROPBOX'],
                openTo: 'COMPUTER'
            },
            function(Blob) {
                $scope.car.carfaxFile = [Blob];
                $scope.$apply();
            })
    };
    //Multiple files upload set to 100 as max number
    $scope.uploadMultiple = function(data) {
        filepickerService.pickMultiple({
                mimetype: 'image/*',
                imageDim: [1920, 1280],
                imageQuality: 60,
                language: 'en',
                maxFiles: 100, //pickMultiple has one more option
                services: ['COMPUTER', 'DROPBOX', 'GOOGLE_DRIVE', 'IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'COMPUTER'
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

    $scope.uploadOne = function(data) {
        filepickerService.pick({
                mimetype: 'image/*',
                imageDim: [1920, 1280],
                imageQuality: 60,
                language: 'en',
                services: ['COMPUTER', 'DROPBOX', 'GOOGLE_DRIVE', 'IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'COMPUTER'
            },
            function(Blob) {
                $scope.car.morePictures.push(Blob);
                $scope.$apply();
            }
        );
    };

    //// upload and updateCar
    $scope.uploadAndUp = function(data) {
      if(data.picture){
        var policy = createPolicy(data.picture.url);
      } else {
        var policy = createPolicy();
      }
        getSig(policy).then(function(data) {
            var sig = data.data;
            filepickerService.pick({
                    mimetype: 'image/*',
                    imageDim: [1920, 1280],
                    imageQuality: 60,
                    policy: policy,
                    signature: sig,
                    language: 'en',
                    services: ['COMPUTER', 'DROPBOX', 'GOOGLE_DRIVE', 'IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                    openTo: 'COMPUTER'
                },
                function(Blob) {
                    $scope.car.picture = Blob;
                    $scope.$apply();
                    $scope.updateCar();
                }
            );
        });

    };

    $scope.uploadCarFaxAndUp = function(data) {
        filepickerService.pick({
                language: 'en',
                services: ['COMPUTER', 'DROPBOX'],
                openTo: 'COMPUTER'
            },
            function(Blob) {
                $scope.car.carfaxFile = [Blob];
                $scope.$apply();
                $scope.updateCar();
            }
        );
    };
    //Multiple files upload set to 100 as max number
    $scope.uploadMultipleAndUp = function() {
        var policy = createPolicy();
        getSig(policy).then(function(data) {
            var sig = data.data;
            filepickerService.pickMultiple({
                    mimetype: 'image/*',
                    policy: policy,
                    signature: sig,
                    language: 'en',
                    imageDim: [1920, 1280],
                    imageQuality: 60,
                    maxFiles: 100, //pickMultiple has one more option
                    services: ['COMPUTER', 'DROPBOX', 'GOOGLE_DRIVE', 'IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                    openTo: 'COMPUTER'
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
        });
    };

    $scope.uploadOneAndUp = function(data) {
        var policy = createPolicy(data.carfaxFile[0].url);
        var sig = getSig(policy);
        filepickerService.pick({
                mimetype: 'image/*',
                imageDim: [1920, 1280],
                imageQuality: 60,
                language: 'en',
                services: ['COMPUTER', 'DROPBOX', 'GOOGLE_DRIVE', 'IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'COMPUTER'
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
        var sig = getSig(policy);
        var fpHolder = data.picture.url;
        filepickerService.remove(fpHolder, {
                policy: policy,
                signature: sig
            },
            function() {}
        );
        // toast removed
        delete data.picture;
    };

    $scope.removeCarFax = function(data) {
        var policy = createPolicy(data.carfaxFile[0].url);
        var sig = getSig(policy);
        var file = data.carfaxFile[0];
        // var fpHolder = data.carfaxFile.url;
        data.carfaxFile.splice(0, 1);
        filepickerService.remove(file.url, {
                policy: policy,
                signature: sig
            },
            function() {
                $scope.updateCar()

            });
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
        // var handle = url.match(/[^\/]*$/);
        var expiry = Math.floor(new Date().getTime() / 1000 + 60 * 60)
        // var polObject = JSON.stringify({expiry: expiry});
        var polObject = JSON.stringify({
            expiry: expiry
        });

        return btoa(polObject);
    }

    $scope.removeMoreImage = function(data) {
        var index = $scope.selectedImageForRemoval;
        var image = data.morePictures[index];
        var policy = createPolicy(image.url);
        data.morePictures.splice(index, 1);
        getSig(policy).then(function(data) {
            var sig = data.data;

            filepickerService.remove(image.url, {
                    policy: policy,
                    signature: sig
                },
                function() {
                    $scope.updateCar()
                })
            $('#confirm-modal-more').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        })
    }

    $scope.checkToken = function() {
        if (!$window.sessionStorage.token) {
            $location.path('/')
        }
    }

    $scope.go = function(path) {
        $location.path(path);
        $('#delete-modal-main').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
    };

    var getSig = function(policy) {
        var myPolicy = {
            pol: policy
        };
        var sig = CarService.getSignature(cUser, myPolicy).then(function(data) {
            return data;
        })
        return sig;
    };
    $scope.validateUpload = function() {
        var make;
        var model;
        var year;
        if ($scope.car.make !== "" && $scope.car.make !== null && $scope.car.make !== void 0) {
            make = true;
        }
        if ($scope.car.model !== "" && $scope.car.model !== null && $scope.car.model !== void 0) {
            model = true;
        }
        if ($scope.car.year !== "" && $scope.car.year !== null && $scope.car.year !== void 0) {
            year = true;
        }
        if (make === true && model === true && year === true) {
            return true;
        } else {
            return false;
        }
    };

}]);
