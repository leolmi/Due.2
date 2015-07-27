/**
 * Created by Leo on 20/06/2015.
 */
'use strict';

angular.module('due2App')
  .config(['$routeProvider',function($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'app/login/login.html',
        controller: 'LoginCtrl'
      });
  }]);
