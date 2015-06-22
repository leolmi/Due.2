/**
 * Created by Leo on 20/06/2015.
 */
'use strict';

angular.module('due2App')
  .directive('itemSummary', ['Cache','$filter', function (Cache,$filter) {
    return {
      restrict: 'E',
      scope: { type: '=' },
      templateUrl: 'components/item-summary/item-summary.html',
      link: function (scope, elm, atr) {
        scope.cache = Cache.data;
        scope.info = {
          tot:{in:0,out:0},
          type: scope.type
        };
        scope.filtered = $filter('options')(Cache.data.items, true, true, scope.info);

        scope.detail = function() {
          scope.$parent.search({undone:true, expired:true, details:true});
        }
      }
    };
  }]);
