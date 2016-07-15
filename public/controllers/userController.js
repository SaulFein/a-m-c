var userCtrl = angular.module('userCtrl', [])
  userCtrl.controller('UserController',['AuthService', 'CarService', 'ErrorService', '$http', '$location','$window',
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
          $location.path('/admin-view');
        }
      })
    }

//   vm.getCars = function() {
//   console.log("hit this getCars from User Controller! ======== ");
//   let userId = AuthService.getId();
//   CarService.getCars()
//     .then(function(res) {
//       // console.log("this is res.data from getCars User Control ", res.data)
//       vm.cars = res.data.data;
//       // vm.curCar = vm.cars.inventory[vm.curPos];
//       // console.log("This is cur Car ", vm.curCar );
//       // console.log("This is cur Car ", vm.cars);
//     }, function(err) {
//       console.log(err);
//     });
// }
//
//     vm.signOut = function(){
//       AuthService.signOut(() => {
//         $location.path('/login')
//       })
//     }
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
//     vm.checkToken = function() {
//       if(!$window.localStorage.token){
//         $location.path('/')
//       }
//     }

  }])
