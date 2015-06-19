/**
 * Created by Leo on 19/06/2015.
 */
'use strict';

angular.module('due2App')
  .controller('SearchCtrl', ['$scope','$http','Util','Logger', function($scope,$http,Util,Logger) {
    $scope.searchtext = '';
    $scope.extendedFilter = {};

    $http.get('/api/dues/0/99999999999')
      .success(function(dues) {
        dues.forEach(function(due){ Util.injectData(due); });
        $scope.alldues = dues;
      })
      .error(function(err){
        Logger.error('Error loading dues!', err);
      });

  }]);
