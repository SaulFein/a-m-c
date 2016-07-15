//Main file
(function(){
  var app = angular.module('app', ['addCarCtrl', 'galleryCtrl','detailCtrl', 'userCtrl', 'ngRoute', 'angular-filepicker'])
      app.controller('MainController', MainController);
      function MainController($scope, fstack) {
        $scope.fstack = fstack;
      }
      app.config(function($routeProvider, filepickerProvider){
          //The route provider handles the client request to switch route
          $routeProvider.when('/addCar', {
              templateUrl: 'partials/addCar.html',
              controller: 'addCarController'
          })
          .when('/gallery', {
              templateUrl: 'partials/gallery.html',
              controller: 'galleryController'
          })
          .when('/detail/:id', {
              templateUrl: 'partials/detail.html',
              controller: 'detailController'
          })
          .when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'userController'
          })
          .when('/', {
            templateUrl: 'partials/home.html'
          })
          //Redirect to addCar in all the other cases.
          .otherwise({redirectTo:'/'});

          filepickerProvider.setKey('fstack');

  });
})();
