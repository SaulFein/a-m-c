var userCtrl = angular.module('userCtrl', ['ngPassword', 'ngMessages'])
  userCtrl.controller('UserController',['AuthService', 'CarService', 'ErrorService', '$http', '$location','$window',
  function(AuthService, CarService, ErrorService, $http, $location, $window, ngMessages, ngPassword){

    // let url = 'http://localhost:3000'
    const vm = this;
    // vm.pw1 = 'password';
    // vm.user = [];
    vm.cars = [];
    vm.sold = [];
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
          vm.user = {};
        } else {
          vm.uae = true;
          // toastr error user name already exists
        }
      });
    };

    vm.signIn = function(user) {
      AuthService.signIn(user, function(err, res) {
        if (err) {
          vm.ip = true;
          return //toastr error problem signing in
        } else {
          vm.error = ErrorService(null);
          $location.path('/admin-inventory');
        }
      })
    }

    var removeSold = function(cars) {
        var sold = [];
        var availableInventory = [];
        var carsToSpliceByIndex = [];
        for (var i = 0; i < cars.length; i++) {
            if (cars[i].sold) {
                sold.push(cars[i]);
                cars.splice(i, 1);
                i--;
                carsToSpliceByIndex.push(i);
            }
        }
        vm.sold = sold;
        return cars;
    }

  vm.getCars = function() {
  var userId = AuthService.getId();
    CarService.getCars(userId)
    .then(function(data){
        vm.cars = removeSold(data.data);
        $window.localStorage.cars = JSON.stringify(vm.cars);
        $window.localStorage.sold = JSON.stringify(vm.sold);

    })
    .catch(function(data) {
        console.log('Error: ' + data);
    });
}
    vm.signOut = function(){
      AuthService.signOut(function() {
        $location.path('/login')
      })
    }

    vm.checkToken = function() {
      if(!$window.sessionStorage.token){
        $location.path('/')
      }
    }
  }])
