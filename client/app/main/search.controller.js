/**
 * Created by Leo on 19/06/2015.
 */
'use strict';

angular.module('due2App')
  .filter('options', [function() {

    function checkInfo(info) {
      info.tot = info.tot || {};
      info.count = info.count || {};
    }

    return function(items, state, expired, info) {
      var filtered = [];
      info = info || {};
      checkInfo(info);
      if (items && items.length>0) {
        items.forEach(function (i) {
          if ((!state || i.data.state != 2) && (!expired || i.data.expired)) {
            info.tot[i.type] = info.tot[i.type] ? info.tot[i.type] + i.data.realvalue : i.data.realvalue;
            info.count[i.type] = info.count[i.type] ? info.count[i.type]+1 : 1;
            filtered.push(i);
          }
        });
        info.count.tot = filtered.length;
      }
      return filtered;
    }
  }])
  .controller('SearchCtrl', ['$scope','$http','Cache','Util','Logger', function($scope,$http,Cache,Util,Logger) {
    $scope.searchtext = '';
    $scope.cache = Cache.data;
    var page = $scope.$parent.overpage;
    $scope.expired = (page.params && page.params.expired==true) ? true : false;
    $scope.undone = (page.params && page.params.undone==true) ? true : false;
    $scope.details = (page.params && page.params.details==true) ? true : false;
    $scope.getDateStr = function(i) {
      return Util.toDateStr(i.date);
    };
    $scope.goto = function(i) {
      $scope.$parent.goto(Util.toDate(i.date));
    };
  }]);
