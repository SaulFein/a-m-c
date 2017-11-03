var AuthService = angular.module('AuthService', []);
  AuthService.factory('AuthService', ['$http', '$window',function($http, $window) {
    var token;
    var userId;
    // var url = 'http://localhost:3000'
    var auth = {
      createUser: function(user, cb) {
        cb || function() {};
      },
      getToken: function() {
        return token || $window.localStorage.token;
      },
      getId: function(){
        return userId || $window.localStorage.user;
      },
      signOut: function(cb) {
        delete $window.localStorage['token'];
        $window.localStorage.user = null;
        if (cb) cb();

      },
      signIn: function(user, cb) {
        cb || function() {};
        $http.post('/login', {}, {
          headers: {
            authorization: 'Basic ' + btoa(user.username + ':' + user.password)
          }
        }).then(function(res) {
          token = $window.localStorage.token = res.data.token;
          userId = $window.localStorage.user = res.data.data._id;
          cb(null, res);
        }, function (err) {
          cb(err);
        })
      }
    }
    return auth;
  }])
