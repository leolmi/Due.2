/**
 * Created by Leo on 19/06/2015.
 */
'use strict';

angular.module('due2App')
  .filter('options', [function() {
    return function(items, state, expired) {
      var filtered = [];
      if (items && items.length>0) {
        items.forEach(function (i) {
          if ((!state || i.data.state != 2) && (!expired || i.data.expired))
            filtered.push(i);
        });
      }
      return filtered;
    }
  }])
  .controller('SearchCtrl', ['$scope','$http','Util','Logger', function($scope,$http,Util,Logger) {
    $scope.searchtext = '';

    $http.get('/api/dues/0/99999999999')
      .success(function(dues) {
        dues.forEach(function(due){ Util.injectData(due); });
        $scope.alldues = dues;
      })
      .error(function(err){
        Logger.error('Error loading dues!', err);
      });

  }]);
