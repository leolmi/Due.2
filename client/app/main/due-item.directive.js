'use strict';

angular.module('due2App')
  .directive('dueItem', [function () {
    return {
      restrict: 'E',
      scope: { item: '=ngModel' },
      templateUrl: 'app/main/due-item.html',
      link: function (scope, elm, atr) {
				
			}
		};
	}]);