/* Created by Leo on 29/07/2015. */
'use strict';

angular.module('due2App')
  .config(['$routeProvider',function ($routeProvider) {
    $routeProvider
      .when('/test', {
        templateUrl: 'app/test/test.html',
        controller: 'TestCtrl',
        authenticate: true
      });
  }]);
