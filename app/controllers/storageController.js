var storageCtrl = angular.module('storageCtrl', []);
storageCtrl.controller('storageController', ["$scope", "$window", "$http", "$location", "$routeParams", "filepickerService", "AuthService", "StorageService", "toastr", "$q", "$document", "$sce",
    function($scope, $window, $http, $location, $routeParams, filepickerService, AuthService, StorageService, toastr, $q, $document, $sce) {
        $scope.storages = [];
        $scope.storage = {};
        $scope.serviceList = null;
        $scope.loadingStorage = false;
        var storageDefaultPics = [{
                url: "./assets/img/storage/IMG_5794.jpg"
            },
            {
                url: "./assets/img/storage/IMG_5889.JPG"
            },
            {
                url: "./assets/img/storage/IMG_8897.JPG"
            },
        ];
        console.log("Storage Controller Connected");
        $scope.pictureDesc=["Test1", "Test2", "Test3"];

        var cUser = $window.sessionStorage.user;

        //Retrieve all the serivce images to show the carosel
        $scope.getStorageData = function() {
            $scope.retrieveStorageDataFromApi();
        }

        $scope.setDefaultDescription = function() {
            $scope.storage.description = defaultServicDesc;
        }

        //Send the newly created storage page to the server to store in the db
        $scope.createStorage = function() {
            if ($scope.storages.length > 0) {
                $scope.updateStorage();
            } else {
                StorageService.createStorage(cUser, $scope.storage).then(function(data) {
                        toastr.success("storage saved")
                    })
                    .then(function() {
                        $scope.retrieveStorageDataFromApi();
                    }).catch(function(data) {
                        toastr.error("error saving storage")
                    });
            }
        };

        $scope.retrieveStorageDataFromApi = function() {
            $scope.loadingStorage = true;
            StorageService.getStoragePublic()
                .then(function(data) {
                    $scope.storages = data.data;
                    $scope.storage = data.data[0];
                    if($scope.storage){
                      if (!$scope.storage.storagePictures || $scope.storage.storagePictures.length == 0) {
                          $scope.storageDefaultPics = storageDefaultPics;
                      } else {
                          $scope.storageDefaultPics = null;
                      }
                      var hasServiceList = $scope.storage.serviceList.indexOf(',') > -1;
                      if (hasServiceList) {
                          $scope.serviceList = $scope.storage.serviceList.split(', ');
                      }
                      $scope.loadingStorage = false;

                    } else {
                      $scope.storageDefaultPics = storageDefaultPics;
                    }
                })
                .catch(function(data) {
                    console.log('Error getting storage data: ' + data);
                }).finally($scope.loadingStorage = false);
        }

        $scope.updateStorage = function() {
            StorageService.updateStorage(cUser, $scope.storage).then(function(data) {
                toastr.success("storage page updated")
                // $scope.getCar();
            }).then(function() {
                $scope.retrieveStorageDataFromApi();
            }).catch(function(data) {
                toastr.error("error updating storage");
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
                        if (!$scope.storage.storagePictures) {
                            $scope.storage.storagePictures = Blob;
                        } else {
                            for (var i = 0; i < Blob.length; i++) {
                                $scope.storage.storagePictures.push(Blob[i]);
                            }
                        }
                        $scope.$apply();
                        $scope.createStorage();
                    }
                );
            });
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

        $scope.setSelected = function(selected) {
            $scope.selectedImageForRemoval = selected;
        }

        $scope.removeMoreImage = function(data) {
            var index = $scope.selectedImageForRemoval;
            var image = data.storagePictures[index];
            var policy = createPolicy(image.url);
            data.storagePictures.splice(index, 1);
            getSig(policy).then(function(data) {
                var sig = data.data;

                filepickerService.remove(image.url, {
                        policy: policy,
                        signature: sig
                    },
                    function() {
                        $scope.updateStorage();
                    })
                $('#confirm-modal-more').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
            })
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

        var getSig = function(policy) {
            var myPolicy = {
                pol: policy
            };
            var sig = StorageService.getSignature(cUser, myPolicy).then(function(data) {
                return data;
            })
            return sig;
        };

        $scope.deleteStorage = function(data) {
            StorageService.deleteService(cUser, $scope.storage).then(function(data) {}).catch(function(data) {
                console.log('Error: ' + data);
            }).finally(function() {
                //Clean the form to allow the user to create new cars
                $scope.storage = {};
                toastr.success("storage deleted")
            })
        };

    }
]);
