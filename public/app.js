//Main file
'use strict';


  var app = angular.module('app', ['addCarCtrl', 'galleryCtrl','detailCtrl', 'userCtrl', 'ngRoute', 'AuthService', 'ErrorService', 'CarService', 'angular-filepicker'])


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
            controllerAs: 'userCtrl',
            controller: 'UserController'
          })
          .when('/', {
            templateUrl: 'partials/home.html'
          })
          .when('/inventory', {
            templateUrl: 'partials/inventory.html'
          })
          //Redirect to addCar in all the other cases.
          // .otherwise({redirectTo:'/'});

          filepickerProvider.setKey('AynkfxksOQNSa83fviAQKz');

  });
