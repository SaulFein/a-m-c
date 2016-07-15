var addCtrl = angular.module('addCarCtrl', []);
addCtrl.controller('addCarController', function($scope, $http, filepickerService){
    $scope.car = {};
    //Send the newly created car to the server to store in the db
    $scope.createCar = function(){
        $http.post('/car', $scope.car)
            .success(function(data){
                console.log(JSON.stringify(data));
                //Clean the form to allow the user to create new cars
                $scope.car = {};
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
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
    //Multiple files upload set to 3 as max number
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
                $scope.car.morePictures = Blob;
                $scope.$apply();
            }
        );
    };
});
