'use strict';

angular.module('due2App')
  .controller('GotoCtrl', ['$scope', function($scope) {
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
    
    $scope.apply = function() {
      switch($scope.target) {
        case 'today': $scope.$parent.goto(new Date()); break;
        case 'userdate': $scope.$parent.goto(new Date($("#timepicker").val())); break;
      }
    };	
  }]); 