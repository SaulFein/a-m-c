var userCtrl = angular.module('userCtrl', [])
  userCtrl.controller('UserController',['AuthService', 'CarService', 'ErrorService', '$http', '$location','$window',
  // userCtrl.controller('UserController',['AuthService', 'ErrorService', '$http', '$location','$window',

  // function(AuthService, ErrorService, $http, $location, $window){
  function(AuthService, CarService, ErrorService, $http, $location, $window){

    let url = 'http://localhost:3000'
    const vm = this;
    vm.user = [];
    vm.cars = [];
    vm.curPos = 0;
    vm.curCar;
    vm.user = ['user'];
    vm.uae = false; //uae = user already exists
    vm.ip = false; //ip = invalid password

    vm.createUser = function(user) {
      console.log("attempting to sign in ", user)
      $http.post(url + '/signup', user, {
        headers: {
          token: AuthService.getToken()
        }
      })
      .then(function(res){
        if(res.data.message !== "User Already Exists"){
          console.log('Shitttttt ' + res.data.message);
          console.log("Then CU res.data ", res.data);
          vm.user.push(res.data);
          vm.newUser = null;
          console.log("local Token " + $window.localStorage.token)

          console.log("resdata Token " + res.data.token)
          token = $window.localStorage.token = res.data.token;
          // console.log("VM Creat USER TOKEN " + token)
          $location.path('/login');
        } else {
          vm.uae = true;
          token = $window.localStorage.token = res.data.token;
        }
      });
    };

    vm.signIn = function(user) {
      console.log(user);
      AuthService.signIn(user, (err, res) => {
        if (err) {
          vm.ip = true;
          return console.log('Problem Signing In ', err);
        } else {
          vm.error = ErrorService(null);
          console.log("signed in yay!!!!!!!!!!")
          $location.path('/inventory');
        }
      })
    }

  vm.getCars = function() {
  console.log("hit this getCars from User Controller! ======== ");
  let userId = AuthService.getId();
  console.log("This is userId from userCtrl getCars" + userId);
  CarService.getCars(userId)
  .success(function(data){
      console.log(JSON.stringify(data));
      vm.cars = data;
  })
  .error(function(data) {
      console.log('Error: ' + data);
  });
}
//
    vm.signOut = function(){
      AuthService.signOut(() => {
        $location.path('/login')
      })
    }
//
//     // vm.getCars = function() {
//     //   let userId = AuthService.getId();
//     //   CarService.getCars(userId)
//     //     .then(function(res) {
//     //       vm.cars = res.data.data;
//     //     }, function(err) {
//     //       console.log(err);
//     //     });
//     // }
//
    vm.checkToken = function() {
      if(!$window.localStorage.token){
        $location.path('/')
      }
    }

  }])
