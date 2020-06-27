'use strict'; ///
var homeCtrl = angular.module('homeCtrl', []);
homeCtrl.controller('homeController', ["$scope", "$window", "$http", "$location", "$routeParams", "filepickerService", "AuthService", "HomeService", "toastr", "$q", "$document", "$sce",
                  function($scope, $window, $http, $location, $routeParams, filepickerService, AuthService, HomeService, toastr, $q, $document, $sce) {
    // let url = 'http://localhost:3000/api/users/';
    var url = '/api/users/'
    var cUser = $window.sessionStorage.user;
    $scope.home = {};
    $scope.homes = [];
    $scope.vieoPreview = null;
    var homeId;
    var id = $routeParams.id;
    $scope.loadingHome = false;
    $scope.showHomeDefaultPics = false;


    $scope.sortableOptions = {
        'ui-floating': true
    };


    //Send the newly created home to the server to store in the db
    $scope.createHome = function() {
        if ($scope.homes.length > 0) {
            $scope.updateHome();
        } else {
            HomeService.createHome(cUser, $scope.home).then(function(data) {
                toastr.success("home saved")
            })
            .then(function() {
                $scope.retrieveHomeDataFromApi();
            }).catch(function(data) {
                toastr.error("error saving home")
            });
        }     
    };

    $scope.retrieveHomeDataFromApi = function() {
        $scope.loadingHome = true;
        HomeService.getHomePublic()
            .then(function(data) {
                $scope.homes = data.data;
                if($scope.homes.length > 0){
                    $scope.home = data.data[0];
                }
                // $scope.home = data.data[0];
                if($scope.home){
                  if (!$scope.home.picture || !$scope.home.morePictures) {
                      $scope.showHomeDefaultPics = true;
                  } else {
                      $scope.showHomeDefaultPics = false;
                  }
                  $scope.loadingHome = false;
                } else {
                  $scope.showHomeDefaultPics = true;
                }
            })
            .catch(function(data) {
                console.log('Error getting home data: ', data);
            }).finally($scope.loadingHome = false);
      }


    $scope.updateHome = function() {
        HomeService.updateHome(cUser, $scope.home).then(function(data) {
                toastr.success("home updated");
            }).then(function() {
                $scope.retrieveHomeDataFromApi()
            }).catch(function(data) {
                toastr.error("error updating home");
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

    $scope.deleteHome = function(home) {
            if(home.picture){
                var fpHolder = home.picture.url;
                var policy = createPolicy(fpHolder);
            }

            if (home.morePictures.length > 0) {
                var fpMHolder = home.morePictures;
            }
            getSig(policy).then(function(data) {
                    var sig = data.data;
                    HomeService.deleteHome(cUser, $scope.home).then(function(data) {
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
                        //Clean the form to allow the user to create new homes
                        $scope.home = {};
                        toastr.success("home deleted")
                    })
                })
    };
    // $scope.getHome = function() {
    //     HomeService.getHome(cUser, id).then(function(data) {
    //       $scope.slides = [];

    //       // console.log(JSON.stringify(data));
    //       $scope.home = data.data;
    //       if (data.data.morePictures) {
    //           for (var i = 0; i < data.data.morePictures.length; i++) {}
    //           $scope.slides.push({
    //               image: data.data.picture.url,
    //               title: 'Main Image'
    //           });
    //           for (var i = 0; i < data.data.morePictures.length; i++) {
    //               $scope.slides.push({
    //                   image: data.data.morePictures[i].url,
    //                   title: 'Image ' + i
    //               });
    //           }
    //       }
    //       if($scope.home.video !== 'N/A' && $scope.home.video !== void 0 && $scope.home.video !== null && $scope.home.video !== ""){
    //         $scope.home.videoDisplay = $sce.trustAsHtml($scope.home.video);
    //       }
    //     }).catch(function(data) {
    //         console.log('Error: ' + data);
    //     });
    // };
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
                    $scope.home.picture = Blob;
                    $scope.$apply();
                })
        });
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
                if (!$scope.home.morePictures) {
                    $scope.home.morePictures = Blob;
                } else {
                    for (var i = 0; i < Blob.length; i++) {
                        $scope.home.morePictures.push(Blob[i]);
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
                $scope.home.morePictures.push(Blob);
                $scope.$apply();
            }
        );
    };

    //// upload and updateHome
    $scope.uploadAndUp = function(home) {
      if(home.picture){
        var policy = createPolicy(home.picture.url);
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
                    $scope.home.picture = Blob;
                    $scope.$apply();
                    $scope.updateHome();
                }
            );
        });

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
                    if (!$scope.home.morePictures) {
                        $scope.home.morePictures = Blob;
                    } else {
                        for (var i = 0; i < Blob.length; i++) {
                            $scope.home.morePictures.push(Blob[i]);
                        }
                    }
                    $scope.$apply();
                    $scope.updateHome();
                }
            );
        });
    };


    $scope.removeImage = function(home) {
        var policy = createPolicy(home.picture.url);
        getSig(policy).then(function(data) {
            var sig = data.data;

        var fpHolder = home.picture.url;
        filepickerService.remove(fpHolder, {
                policy: policy,
                signature: sig
            },
            function() {}
        );
        // toast removed
        delete home.picture;
        });
    };

    
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
                    $scope.updateHome()
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


    var getSig = function(policy) {
        var myPolicy = {
            pol: policy
        };
        var sig = HomeService.getSignature(cUser, myPolicy).then(function(data) {
            return data;
        })
        return sig;
    };
    $scope.validateUpload = function() {
       
    };

}]);
