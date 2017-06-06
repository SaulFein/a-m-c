//Main file
'use strict';


// var app = angular.module('app', ['addCarCtrl', 'galleryCtrl','detailCtrl', 'userCtrl', 'ngRoute', 'AuthService', 'ErrorService', 'CarService', 'angular-filepicker', 'pwCheck'])
var app = angular.module('app', ['addCarCtrl', 'galleryCtrl', 'detailCtrl', 'userCtrl', 'ngRoute', 'AuthService', 'ErrorService', 'CarService', 'angular-filepicker', 'ngPassword', 'ngMessages', 'ngAnimate', 'ngTouch', 'ngSanitize', 'ngMap'])

app.config(['$routeProvider', 'filepickerProvider', '$locationProvider',function($routeProvider, filepickerProvider, $locationProvider) {
        //The route provider handles the client request to switch route
        $locationProvider.hashPrefix('');

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
                templateUrl: 'partials/homeNew.html',
                controller: 'galleryController'
            })
            .when('/admin-inventory', {
                templateUrl: 'partials/admin-inventory.html',
                controllerAs: 'userCtrl',
                controller: 'UserController'
            })
            .when('/contact', {
                templateUrl: 'partials/contact.html'
                    // controller: 'galleryController'
            })
            //Redirect to addCar in all the other cases.
            .otherwise({ redirectTo: '/home' });

        filepickerProvider.setKey('AS2OofL0jSaWHwlvlGpt4z');
    }])
    .directive('routeLoadingIndicator', ['$rootScope',
        function($rootScope) {
            console.log("directive hit!");
            return {
                restrict: 'E',
                template: "<div class='col-lg-12' ng-if='isRouteLoading'><h1>Loading <i class='fa fa-cog fa-spin'></i></h1></div>",
                link: function(scope, elem, attrs) {
                    // debugger;
                    scope.isRouteLoading = false;
                    console.log("isRouteLoading = false");

                    $rootScope.$on('$routeChangeStart', function() {
                        scope.isRouteLoading = true;
                        console.log("isRouteLoading = true");

                    });

                    $rootScope.$on('$routeChangeSuccess', function() {
                        scope.isRouteLoading = false;
                        console.log("isRouteLoading = false bottom");

                    });
                }
            };

        }
    ]);
