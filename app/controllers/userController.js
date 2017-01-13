var userCtrl = angular.module('userCtrl', ['ngPassword', 'ngMessages'])
  // userCtrl.controller('UserController',['AuthService', 'CarService', 'ErrorService', 'pwCheck', '$http', '$location','$window',
  userCtrl.controller('UserController',['AuthService', 'CarService', 'ErrorService', '$http', '$location','$window',

  // function(AuthService, CarService, ErrorService, pwCheck, $http, $location, $window){
  function(AuthService, CarService, ErrorService, $http, $location, $window, ngMessages, ngPassword){


    // let url = 'http://localhost:3000'
    const vm = this;
    // vm.pw1 = 'password';
    // vm.user = [];
    vm.cars = [];
    vm.curPos = 0;
    vm.curCar;
    vm.user = ['user'];
    vm.uae = false; //uae = user already exists
    vm.ip = false; //ip = invalid password

    vm.createUser = function(user) {
      var userId = AuthService.getId();
      $http.post('api/users/'+ userId +'/signup', user, {
        headers: {
          token: AuthService.getToken()
        }
      })
      .then(function(res){
        if(res.data.message !== "User Already Exists"){
          console.log('CreateUser from UC message: ' + res.data.message);
          console.log("Then CU res.data ", res.data);
          // vm.user.push(res.data);
          vm.user = {};
          // console.log("local Token " + $window.localStorage.token)

          console.log("resdata Token " + res.data.token)
          // token = $window.localStorage.token = res.data.token;
          // console.log("VM Creat USER TOKEN " + token)
          // $location.path('/login');
        } else {
          vm.uae = true;
          console.log('username already exists!')
          // token = $window.localStorage.token = res.data.token;
        }
      });
    };

    vm.signIn = function(user) {
      AuthService.signIn(user, function(err, res) {
        if (err) {
          vm.ip = true;
          return console.log('Problem Signing In ', err);
        } else {
          vm.error = ErrorService(null);
          console.log("signed in yay!!!!!!!!!!")
          $location.path('/admin-inventory');
        }
      })
    }

  vm.getCars = function() {
  var userId = AuthService.getId();
  console.log("This is userId from userCtrl getCars" + userId);
    CarService.getCars(userId)
    .then(function(data){
        // console.log("Loading Cars!");
        // console.log(JSON.stringify(data));
        vm.cars = data;
        $window.localStorage.cars = JSON.stringify(vm.cars);
    })
    .error(function(data) {
        console.log('Error: ' + data);
    });
}
//
    vm.signOut = function(){
      AuthService.signOut(function() {
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

//For user side
//   vm.getCars = function() {
//   let userId = AuthService.getId();
//   console.log("This is userId from userCtrl getCars" + userId);
//   if(!$window.localStorage.cars){
//     CarService.getCars(userId)
//     .then(function(data){
//         // console.log("Loading Cars!");
//         // console.log(JSON.stringify(data));
//         vm.cars = data;
//         $window.localStorage.cars = JSON.stringify(vm.cars);
//     })
//     .error(function(data) {
//         console.log('Error: ' + data);
//     });
//   } else {
//     vm.cars = JSON.parse($window.localStorage.cars);
//   //   console.log("This is vm.get cars " + vm.cars)
//   //   return vm.cars;
//   }
// }
