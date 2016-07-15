var detailCtrl = angular.module('detailCtrl', []);
detailCtrl.controller('detailController', function($scope, $http, $routeParams){
    $scope.car = {};
    //get the id to query the db and retrieve the correct car
    var id = $routeParams.id;
    $http.get('/car/' + id)
        .success(function(data){
            console.log(JSON.stringify(data));
            $scope.car = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
});
