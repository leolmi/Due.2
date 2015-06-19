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

    function injectState(item) {
      var state = 0;
      item.data.realvalue = item.value;
      if (item.state && item.state.length>0) {
        var tot = 0.0;
        item.state.forEach(function(v){
          tot += v.value;
        });
        state = (tot>=item.value) ? 2 : 1;
        item.data.realvalue = tot >= item.value ? tot : item.value - tot;
      }
      else if (item.automatic && item.data.expired){
        state = 2;
      }
      item.data.state = state;
    }

    function injectData(item) {
      var today = toDays(new Date());
      item.data = {
        expired: item.date<today,
        delta: Math.abs(item.date-today)
      };
      injectState(item);
    }

    return {
      toDate: toDate,
      toDays: toDays,
      toDateStr: toDateStr,
      injectData: injectData
    }
  }]);
