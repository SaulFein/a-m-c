//Main file
'use strict';


// var app = angular.module('app', ['addCarCtrl', 'galleryCtrl','detailCtrl', 'userCtrl', 'ngRoute', 'AuthService', 'ErrorService', 'CarService', 'angular-filepicker', 'pwCheck'])
var app = angular.module('app', ['addCarCtrl', 'galleryCtrl', 'detailCtrl', 'userCtrl', 'financeCtrl', 'ngRoute', 'AuthService',
                                'ErrorService', 'CarService', 'angular-filepicker', 'ngPassword', 'ngMessages', 'ngAnimate',
                                'ngTouch', 'ngSanitize', 'ngMap', 'EmailService', 'toastr', 'angular-google-analytics', 'ui.sortable', 'duScroll'])

app.config(['$routeProvider', 'filepickerProvider', '$locationProvider', 'AnalyticsProvider', function($routeProvider, filepickerProvider, $locationProvider, AnalyticsProvider) {
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
            .when('/service', {
              templateUrl: 'partials/service.html'
            })
            .when('/storage', {
              templateUrl: 'partials/storage.html'
            })
            .when('/finance', {
              templateUrl: 'partials/finance.html',
              controller: 'financeController'
            })
            //Redirect to addCar in all the other cases.
            .otherwise({ redirectTo: '/home' });

        AnalyticsProvider.setAccount('UA-113169326-1');
        filepickerProvider.setKey('AS2OofL0jSaWHwlvlGpt4z');
    }])
    .run(['Analytics', function(Analytics) { }])
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
                        element.hide(0).fadeIn(1000)
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
                  var getFileTileUrl = function (fileUrl) {
                    var str = fileUrl;
                    var res = str.replace("https://cdn.filepicker.io/api/file/", "https://process.filestackapi.com/resize=width:700/");
                    return res;
                  }
                  var tileUrl = getFileTileUrl(url);
                  img.onload = function(){
                    element.css({"background-image": "url("+tileUrl+")"});
                    // element.hide(0).fadeIn(1000);
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

    
    // !   Warning: You are running on a deprecated stack.
    // remote:  !   Please upgrade to the latest stack by following the instructions on:
    // remote:  !   https://devcenter.heroku.com/articles/upgrading-to-the-latest-stack
