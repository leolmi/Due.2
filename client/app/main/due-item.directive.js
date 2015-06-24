'use strict';

angular.module('due2App')
  .directive('dueItem', ['Logger', function (Logger) {
    return {
      restrict: 'E',
      scope: { item: '=ngModel', checked:'=' },
      templateUrl: 'app/main/due-item.html',
      link: function (scope, elm, atr) {
        function stopEvent(e) {
          e.preventDefault();
          e.stopPropagation();
        }

				scope.delete = function(e) {
          stopEvent(e);
          scope.$parent.delete(scope.item);
        };

        scope.handle = function(e) {
          stopEvent(e);
          scope.$parent.handle(scope.item);
        };
			}
		};
	}]);
