/**
 * Created by Leo on 23/06/2015.
 */
'use strict';

angular.module('due2App')
  .directive('dragitem', ['Logger',function(Logger) {
    return function(scope, element) {
      // this gives us the native JS object
      var el = element[0];
      el.draggable = true;
      el.addEventListener('dragstart',function(e) {
        var escope =  angular.element(el).scope();
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('Item', escope.i._id);
      },false);
    }
  }])
  .directive('dropitem', ['Logger',function(Logger) {
    return {
      scope: { drop: '=' },
      link: function (scope, elm, atr) {
        var el = elm[0];
        el.addEventListener('dragenter',function(e) {
          elm.addClass('over');
          return false;
        },false);

        el.addEventListener('dragleave',function(e) {
          elm.removeClass('over');
          return false;
        },false);
        el.addEventListener('dragover',function(e) {
          e.dataTransfer.dropEffect = 'move';
          if (e.preventDefault) e.preventDefault();
          return false;
        },false);
        el.addEventListener('drop',function(e) {
          if (e.stopPropagation) e.stopPropagation();
          elm.removeClass('over');
          var id = e.dataTransfer.getData('Item');
          if (id && typeof(scope.drop) === "function")
            scope.$apply(scope.drop(id));
          return false;
        },false);
      }
    }
  }])
