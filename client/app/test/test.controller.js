/* Created by Leo on 29/07/2015. */
'use strict';

angular.module('due2App')
  .controller('TestCtrl', ['$scope','$timeout','$window','Logger', function ($scope,$timeout,$window,Logger) {
    var iH = 60;
    var N = 100;
    var MINOFFSET = 200;
    var w = angular.element($window);
    var scrollable = document.getElementById('scrollable');
    var content = document.getElementById('content');

    var is = [];
    for(var i=0;i<N;i++)
      is.push(i-(N/2));
    $scope.items = is;

    $timeout(function() {
      var dh = ((w.height() / iH)/2-1)*iH;
      scrollable.scrollTop = (iH*N)/2-dh;
    }, 100);

    function addPrev() {
      var n = $scope.items[0];
      var dH = (N/2)*iH;
      for(var i=0;i<N/2;i++)
        $scope.items.splice(0, 0, n-i);
      scrollable.scrollTop += dH;
      $scope.$apply();
    }
    function addNext() {
      var n = $scope.items[$scope.items.length-1];
      for(var i=0;i<N/2;i++)
        $scope.items.push(i+n);
      $scope.$apply();
    }


    angular.element(scrollable).bind("scroll", function() {
      var pos = scrollable.scrollTop;
      var max = content.offsetHeight - w.height();
      //Logger.monitor('Scroll pos | Content height | max | pos+minoff',pos+'  |  '+content.offsetHeight+'  |  '+max+'  |  '+(pos+MINOFFSET));
      if (pos<=MINOFFSET) addPrev();
      if (pos+MINOFFSET>=max) addNext();
    });

  }]);
