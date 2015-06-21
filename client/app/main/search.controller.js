/**
 * Created by Leo on 19/06/2015.
 */
'use strict';

angular.module('due2App')
  .filter('options', [function() {
    return function(items, state, expired, info) {
      var filtered = [];
      info = info || {};
      info.tot = info.tot || {};
      if (items && items.length>0) {
        items.forEach(function (i) {
          if ((!state || i.data.state != 2) && (!expired || i.data.expired)) {
            info.tot[i.type] += i.data.realvalue;
            filtered.push(i);
          }
        });
      }
      return filtered;
    }
  }])
  .controller('SearchCtrl', ['$scope','$http','Cache','Util','Logger', function($scope,$http,Cache,Util,Logger) {
    $scope.searchtext = '';
    $scope.cache = Cache.data;
  }]);
