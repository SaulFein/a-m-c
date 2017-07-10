//Main file
'use strict';


// var app = angular.module('app', ['addCarCtrl', 'galleryCtrl','detailCtrl', 'userCtrl', 'ngRoute', 'AuthService', 'ErrorService', 'CarService', 'angular-filepicker', 'pwCheck'])
var app = angular.module('app', ['addCarCtrl', 'galleryCtrl', 'detailCtrl', 'userCtrl', 'ngRoute', 'AuthService', 'ErrorService', 'CarService', 'angular-filepicker', 'ngPassword', 'ngMessages', 'ngAnimate', 'ngTouch', 'ngSanitize', 'ngMap', 'EmailService', 'toastr'])

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
                templateUrl: 'partials/home3.html',
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
            return {
                restrict: 'E',
                template: "<div class='col-lg-12' ng-if='isRouteLoading'><h1>Loading <i class='fa fa-cog fa-spin'></i></h1></div>",
                link: function(scope, elem, attrs) {
                    // debugger;
                    scope.isRouteLoading = false;
                    $rootScope.$on('$routeChangeStart', function() {
                        scope.isRouteLoading = true;
                    });

                    $rootScope.$on('$routeChangeSuccess', function() {
                        scope.isRouteLoading = false;
                    });
                }
            };

        }
    ])
    .directive("showOnLoad", function() {
        return {
            link: function(scope, element) {
                element.on("load", function() {
                    scope.$apply(function() {
                        scope.carPix = true;
                        element.hide(0).fadeIn(2000)
                    });
                });
            }
        };
    })

    .directive("showOnLoadBg", function() {
        return {
            link: function(scope, element) {
                  var img = new Image();
                  var url = scope.car.picture.url;
                  img.onload = function(){
                    element.css({"background-image": "url("+url+")"});
                    element.hide(0).fadeIn(1000);
                }
                img.src = url

            }
          }
    })
    .directive('dateYear', [function () {
        return {
            template: "<span>{{year}}</span>",
            link: function (scope) {
                scope.year = new Date().getFullYear()
            }
        }
    }]);
