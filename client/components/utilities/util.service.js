'use strict';

angular.module('due2App')
  .factory('Util',[function(){
    
    function toDays(d) {
      return Math.floor((((d.getTime() / 1000) / 60) / 60) / 24);
    }
    function toDate(n) {
      return new Date(n*24*60*60*1000);
    }
    function toDateStr(n) {
      var d = toDate(n);
      return d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear();
    }
    
    return {
      toDate: toDate,
      toDays: toDays,
      toDateStr: toDateStr
    }
  }]);