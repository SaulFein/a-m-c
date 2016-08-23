//Main file
'use strict';


  // var app = angular.module('app', ['addCarCtrl', 'galleryCtrl','detailCtrl', 'userCtrl', 'ngRoute', 'AuthService', 'ErrorService', 'CarService', 'angular-filepicker', 'pwCheck'])
  var app = angular.module('app', ['addCarCtrl', 'galleryCtrl','detailCtrl', 'userCtrl', 'ngRoute', 'AuthService', 'ErrorService', 'CarService', 'angular-filepicker', 'ngPassword', 'ngMessages','ngAnimate', 'ngTouch', 'ngSanitize'])

      app.config(function($routeProvider, filepickerProvider){
          //The route provider handles the client request to switch route
          $routeProvider.when('/addCar', {
            templateUrl: 'partials/addCar.html',
            controller: 'addCarController'
          })
          .when('/addUser', {
            templateUrl: 'partials/addUser.html',
            controllerAs: 'userCtrl',
            controller: 'UserController'
          })
          .when('/gallery', {
            templateUrl: 'partials/gallery.html',
            controller: 'galleryController'
          })
          .when('/car/:id', {
            templateUrl: 'partials/car-view.html',
            controller: 'detailController'
          })
          .when('/detail/:id', {
            templateUrl: 'partials/detail.html',
            controller: 'addCarController'
          })
          .when('/login', {
            templateUrl: 'partials/login.html',
            controllerAs: 'userCtrl',
            controller: 'UserController'
          })
          .when('/home', {
            templateUrl: 'partials/home.html',
            controller: 'galleryController'
          })
          .when('/admin-inventory', {
            templateUrl: 'partials/admin-inventory.html',
            controllerAs: 'userCtrl',
            controller: 'UserController'
          })
          //Redirect to addCar in all the other cases.
          // .otherwise({redirectTo:'/home'});

          filepickerProvider.setKey('AS2OofL0jSaWHwlvlGpt4z');

  });
