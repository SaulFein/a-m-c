var galleryCtrl = angular.module('galleryCtrl', []);
galleryCtrl.controller('galleryController', function($scope, $http){
    $scope.cars = [];
    //Retrieve all the cars to show the gallery
    $http.get('/car')
        .success(function(data){
            console.log(JSON.stringify(data));
            $scope.cars = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

});
