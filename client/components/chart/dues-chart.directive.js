/* Created by Leo on 24/06/2015. */
'use strict';

angular.module('due2App')
  .directive('duesChart', ['Cache',function(Cache) {
    return {
      restrict: 'E',
      scope: { height:'=', width:'=' },
      templateUrl: 'components/chart/dues-chart.html',
      link: function (scope, elm, atr) {
        //var svg = elm.find('svg');

        scope.paths = [
          //{x:100,y:0,lx:100,ly:scope.height,sw:2,cl:'none'},
          //{x:300,y:scope.height,lx:300,ly:0,sw:6,cl:'none'}
        ];
      }
    }
  }]);
