var financeCtrl = angular.module('financeCtrl', []);
financeCtrl.controller('financeController', ["$scope", function($scope){
  $scope.purchasePrice = null;
  $scope.downPayment = null;
  $scope.loanTerm = null;
  $scope.interestRate = null;
  $scope.pp = true;
  $scope.dp = true;
  $scope.lt = true;
  $scope.ir = true;
  $scope.totalMonthlyPayment = function (purchasePrice, downPayment, loanTerm, interestRate) {
    var isFormValid = validateForm(purchasePrice, downPayment, loanTerm, interestRate);
    if(isFormValid){
      var loanAmount = parseInt(purchasePrice) - parseInt(downPayment);
      var preInterestRate = loanAmount/parseInt(loanTerm.value);
      var interRatePercent = (parseFloat(interestRate) * .01).toFixed(3);
      var tmp = preInterestRate + (preInterestRate * interRatePercent);
      $scope.monthlyPayment = tmp;
    }
  };
  $scope.options = [
    {name: "3 Years ( 36 Months )", value: 36},
    {name:"4 Years ( 48 Months )", value: 48},
    {name: "5 Years ( 60 Months )", value: 60},
    {name: "6 Years ( 72 Months )", value: 72},
    {name: "7 Years ( 84 Months )", value: 84},
    {name: "8 Years ( 96 Months )", value: 96},
    {name: "9 Years ( 108 Months )", value: 108},
    {name: "10 Years ( 120 Months )", value: 120}
  ];
  var validateForm = function(purchasePrice, downPayment, loanTerm, interestRate) {
    $scope.pp = validatePurchasePrice(purchasePrice);
    $scope.dp = validateDownPayment(downPayment);
    $scope.lt = validateLoanTerm(loanTerm);
    $scope.ir = validateInterestRate(interestRate);
    return $scope.pp && $scope.dp && $scope.lt && $scope.ir;

  }
  var validatePurchasePrice = function(purchasePrice){
    if(purchasePrice !== null && purchasePrice !== void 0 && purchasePrice !== ""){
      return true;
    } else {
      return false;
    }
  }
  var validateDownPayment = function(downPayment){
    if(downPayment !== null && downPayment !== void 0 && downPayment !== ""){
      return true;
    } else {
      return false;
    }
  }
  var validateLoanTerm = function(loanTerm){
    if(loanTerm !== null && loanTerm !== void 0 && loanTerm !== ""){
      return true;
    } else {
      return false;
    }
  }
  var validateInterestRate = function(interestRate){
    if(interestRate !== null && interestRate !== void 0 && interestRate !== ""){
      return true;
    } else {
      return false;
    }
  }
}]);
