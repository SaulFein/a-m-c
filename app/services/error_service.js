var ErrorService = angular.module('ErrorService', []);

  ErrorService.factory('ErrorService', function() {
    var error;
    return function(newError) {
      if (newError === null) return error = null;
      if (!newError) return error;
      return error = newError;
    }
  })
