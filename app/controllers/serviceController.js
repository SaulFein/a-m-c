var serviceCtrl = angular.module('serviceCtrl', []);
serviceCtrl.controller('serviceController', ["$scope", "$window", "$http", "$location", "$routeParams", "filepickerService", "AuthService", "ServiceService", "toastr", "$q", "$document", "$sce",
    function($scope, $window, $http, $location, $routeParams, filepickerService, AuthService, ServiceService, toastr, $q, $document, $sce) {
        $scope.services = [];
        $scope.service = {};
        $scope.serviceList = null;
        $scope.loadingService = false;
        var serviceDefaultPics = [{
                url: "./assets/img/service/IMG_5794.jpg"
            },
            {
                url: "./assets/img/service/IMG_5889.JPG"
            },
            {
                url: "./assets/img/service/IMG_8897.JPG"
            },
        ];

        $scope.pictureDesc=["Test1", "Test2", "Test3"];

        var defaultServicDesc = "Authentic Motorcars is pleased to have Randy Johnson on our team as our lead technician. Randy has" +
            "experience working with a wide variety of makes that include Alfa Romeo, BMW, Fiat, Ferrari, Maserati, Porsche, Lancia, Volkswagen, and Lotus." +
            "We like to involve our clients with the service of their vehicles and provide detailed explanations of repairs needed and alternative parts and " +
            "performance options that are available to ensure longevity. Our mission is to help you better understand the mechanicals of your collector vehicle" +
            "so you can plan future maintenance campaigns and restoration phases if needed.";

        var cUser = $window.sessionStorage.user;

        //Retrieve all the serivce images to show the carosel
        $scope.getServiceData = function() {
            $scope.retrieveServiceDataFromApi();
        }

        $scope.setDefaultDescription = function() {
            $scope.service.description = defaultServicDesc;
        }

        //Send the newly created service page to the server to store in the db
        $scope.createService = function() {
            if ($scope.services.length > 0) {
                $scope.updateService();
            } else {
                ServiceService.createService(cUser, $scope.service).then(function(data) {
                        toastr.success("service saved")
                    })
                    .then(function() {
                        $scope.retrieveServiceDataFromApi();
                    }).catch(function(data) {
                        toastr.error("error saving service")
                    });
            }
        };

        $scope.retrieveServiceDataFromApi = function() {
            $scope.loadingService = true;
            ServiceService.getServicePublic()
                .then(function(data) {
                    $scope.services = data.data;
                    $scope.service = data.data[0];
                    if($scope.service){
                      if (!$scope.service.servicePictures || $scope.service.servicePictures.length == 0) {
                          $scope.serviceDefaultPics = serviceDefaultPics;
                      } else {
                          $scope.serviceDefaultPics = null;
                      }
                      var hasServiceList = $scope.service.serviceList.indexOf(',') > -1;
                      if (hasServiceList) {
                          $scope.serviceList = $scope.service.serviceList.split(', ');
                      }
                      $scope.loadingService = false;

                    } else {
                      $scope.serviceDefaultPics = serviceDefaultPics;
                    }
                })
                .catch(function(data) {
                    console.log('Error getting service data: ' + data);
                }).finally($scope.loadingService = false);
        }

        $scope.updateService = function() {
            ServiceService.updateService(cUser, $scope.service).then(function(data) {
                toastr.success("service page updated")
                // $scope.getCar();
            }).then(function() {
                $scope.retrieveServiceDataFromApi();
            }).catch(function(data) {
                toastr.error("error updating service");
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
                        if (!$scope.service.servicePictures) {
                            $scope.service.servicePictures = Blob;
                        } else {
                            for (var i = 0; i < Blob.length; i++) {
                                $scope.service.servicePictures.push(Blob[i]);
                            }
                        }
                        $scope.$apply();
                        $scope.createService();
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
            var image = data.servicePictures[index];
            var policy = createPolicy(image.url);
            data.servicePictures.splice(index, 1);
            getSig(policy).then(function(data) {
                var sig = data.data;

                filepickerService.remove(image.url, {
                        policy: policy,
                        signature: sig
                    },
                    function() {
                        $scope.updateService();
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
            var sig = ServiceService.getSignature(cUser, myPolicy).then(function(data) {
                return data;
            })
            return sig;
        };

        $scope.deleteService = function(data) {
            ServiceService.deleteService(cUser, $scope.service).then(function(data) {}).catch(function(data) {
                console.log('Error: ' + data);
            }).finally(function() {
                //Clean the form to allow the user to create new cars
                $scope.service = {};
                toastr.success("service deleted")
            })
        };

    }
]);
