/**
 * Created by Leo on 19/06/2015.
 */
'use strict';

angular.module('due2App')
  .controller('SettingsCtrl',['$scope','$http','User','Auth','Logger','Cache','Modal', function ($scope,$http,User,Auth,Logger,Cache,Modal) {
    $scope.errors = {};
    $scope.user = Auth.getCurrentUser();

    if (!$scope.user.settings) {
      $http.get('/api/settings')
        .success(function(settings){
          $scope.user.settings = settings;
        });
    }

    $scope.updateSettings = function() {
      $http.put('/api/settings', $scope.user.settings)
        .success(function(){
          Logger.ok('Settings updated successfully.');
        })
        .error(function(err){
          Logger.error('Error updating settings', err);
        });
    };

    function clear() {
      $scope.user.oldPassword = undefined;
      $scope.user.newPassword = undefined;
      $scope.user.password2 = undefined;
      $scope.submitted = false;
      $scope.errors = undefined;
    }

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
          .then( function() {
            $scope.message = 'Password successfully changed.';
            clear();
          })
          .catch( function() {
            form.password.$setValidity('mongoose', false);
            $scope.errors.other = 'Incorrect password';
            $scope.message = '';
          });
      }
    };

    $scope.download = function() {
      var content = JSON.stringify(Cache.data.items);
      content = content.replace(/},{/g,'},\r\n{');
      content = content.replace(/("_id":".*?",)/g,'');
      content = content.replace(/("owner":".*?",)/g,'');
      var file = new Blob([content], { type: 'text/json;charset=utf-8' });
      saveAs(file,'dues.json');
    };



    var modalDelete = Modal.confirm.ask(function() {
      $http.post('/api/dues/clear')
        .success(function(){
          Logger.ok('Data cleared successfully.');
        })
        .error(function(err){
          Logger.error('Error clearing data', err);
        });
    });

    $scope.cleardata = function() {
      var opt = Modal.confirm.getAskOptions(Modal.MODAL_DELETE, 'TUTTI i dati utente');
      modalDelete(opt);
    };

    clear();
  }]);
