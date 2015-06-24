'use strict';

angular.module('due2App')
  .directive('compareTo',[function() {
    return {
      require: "ngModel",
      scope: { otherModelValue: "=compareTo" },
      link: function(scope, elm, atr, ngModel) {
        ngModel.$validators.compareTo = function(modelValue) {
          return modelValue == scope.otherModelValue;
        };

        scope.$watch("otherModelValue", function() {
          ngModel.$validate();
        });
      }
    };
  }])
  .controller('LoginCtrl', ['$scope','$rootScope','Auth','$location','$window','Logger',function ($scope,$rootScope,Auth,$location,$window,Logger) {
    $scope.version = '1.0.0';
    $scope.errors = {};
    $scope.loginform = true;

    if (!$rootScope.user) {
      $rootScope.user = {
        email: 'test@test.com',
        password: 'test'
      };
    }
    $scope.user = $rootScope.user;

    function resetErrors(skipsub) {
      if (!skipsub)
        $scope.submitted = false;
      $rootScope.errors = {};
      $scope.errors = $rootScope.errors;
    }

    if (!$rootScope.errors)
      resetErrors();


    $scope.toggle = function(lgn) {
      resetErrors();
      $scope.loginform = lgn;
    };

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/main');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

    $scope.register = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password
        })
          .then( function() {
            resetErrors();
            $location.path('/main');
          })
          .catch( function(err) {
            err = err.data;
            resetErrors(false);
            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.errors, function(error, field) {
              form[field].$setValidity('mongoose', false);
              $rootScope.errors[field] = error.message;
            });
          });
      }
    };

    $scope.recover = function() {
      Logger.info('[TODO] - Recover password tool...');
    };
  }]);
