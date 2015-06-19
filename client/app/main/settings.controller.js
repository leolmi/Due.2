/**
 * Created by Leo on 19/06/2015.
 */
'use strict';

angular.module('due2App')
  .controller('SettingsCtrl', function ($scope, User, Auth) {
    $scope.errors = {};

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
          .then( function() {
            $scope.message = 'Password successfully changed.';
          })
          .catch( function() {
            form.password.$setValidity('mongoose', false);
            $scope.errors.other = 'Incorrect password';
            $scope.message = '';
          });
      }
    };
  });
