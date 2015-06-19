'use strict';

angular.module('due2App')
  .controller('GotoCtrl', ['$scope','$rootScope','Util', function($scope,$rootScope,Util) {
    $scope.target = 'today';
    $scope.initdate = new Date();

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    }

    $scope.daystoadd = 10;

    $scope.apply = function() {
      switch($scope.target) {
        case 'today': $scope.$parent.goto(new Date()); break;
        case 'userdate': $scope.$parent.goto(new Date($("#timepicker").val())); break;
        case 'adddays':
          var n = $rootScope.userdata.central + $scope.daystoadd;
          $scope.$parent.goto(Util.toDate(n));
          break;
      }
    };

    $scope.focus = function(name) {
      $scope.target = name;
    };
  }]);
