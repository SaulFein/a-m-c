'use strict';

var StorageService = angular.module('StorageService', []);
  app.factory('StorageService', ['$http', 'AuthService','$window', function($http, AuthService, $window) {
    // const mainRoute = "http://localhost:3000/api";
    // const pubRoute = "http://localhost:3000";
    var storageId;
    var storageService = {};

    storageService.createStorage = function(cUser, storageData) {
      return $http.post('/api/users/' + cUser + '/storage', storageData, {
        headers: {
          token: AuthService.getToken()
        }
      })
    };

    storageService.getStorage = function(cUser, id) {
      return $http.get('/api/users/' + cUser + '/storage/' + id, {
            headers: {
                token: AuthService.getToken()
            }
      })
    }

    storageService.getStorages = function(userId) {
      return $http.get('/api/users/' + userId + '/storage', {
        headers: {
          token: AuthService.getToken()
        }
      })
    };

    storageService.getStoragePublic = function() {
      return $http.get('/storage')
    };

    storageService.getSignature = function(userId, policy){
      return $http.post('/api/users/' + userId + '/sig', policy, {
        headers: {
          token: AuthService.getToken()
        }
      })
    }

    storageService.updateStorage = function(cUser, storageData) {
      return $http.put('/api/users/' + cUser + '/storage/' + storageData._id, storageData, {
        headers: {
          token: AuthService.getToken()
        }
      });
    };
    
    storageService.deleteStorage = function(cUser, storageData) {
      return $http.delete('/api/users/' + cUser + '/storage/' + storageData._id, {
        headers: {
          token: AuthService.getToken()
        }
      });
    };
    // storageService.getId = function(){
    //   return $window.localStorage.carId || carId;
    // }
    return storageService;
  }]);
