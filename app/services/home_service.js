'use strict';

var HomeService = angular.module('HomeService', []);
  app.factory('HomeService', ['$http', 'AuthService','$window', function($http, AuthService, $window) {
    // const mainRoute = "http://localhost:3000/api";
    // const pubRoute = "http://localhost:3000";
    var homeId;
    var homeService = {};

    homeService.createHome = function(cUser, homeData) {
      return $http.post('/api/users/' + cUser + '/home', homeData, {
        headers: {
          token: AuthService.getToken()
        }
      })
    };

    homeService.getHome = function(cUser, id) {
      return $http.get('/api/users/' + cUser + '/home/' + id, {
            headers: {
                token: AuthService.getToken()
            }
      })
    }

    homeService.getHomes = function(userId) {
      return $http.get('/api/users/' + userId + '/home', {
        headers: {
          token: AuthService.getToken()
        }
      })
    };

    homeService.getHomePublic = function() {
      return $http.get('/home')
    };

    homeService.getSignature = function(userId, policy){
      return $http.post('/api/users/' + userId + '/sig', policy, {
        headers: {
          token: AuthService.getToken()
        }
      })
    }

    homeService.updateHome = function(cUser, homeData) {
      return $http.put('/api/users/' + cUser + '/home/' + homeData._id, homeData, {
        headers: {
          token: AuthService.getToken()
        }
      });
    };
    
    homeService.deleteHome = function(cUser, homeData) {
      return $http.delete('/api/users/' + cUser + '/home/' + homeData._id, {
        headers: {
          token: AuthService.getToken()
        }
      });
    };

    return homeService;
  }]);
