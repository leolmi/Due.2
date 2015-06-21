'use strict';

angular.module('due2App')
  .directive('dueItem', ['Logger', function (Logger) {
    return {
      restrict: 'E',
      scope: { item: '=ngModel' },
      templateUrl: 'app/main/due-item.html',
      link: function (scope, elm, atr) {
				scope.delete = function($event) {
          $event.preventDefault();
          $event.stopPropagation();
          scope.$parent.delete(scope.item);
        }
			}
		};
	}]);
