'use strict';

angular.module('due2App')
  .config(['$routeProvider',function($routeProvider) {
    $routeProvider
      .when('/admin', {
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl'
      });
  }]);
