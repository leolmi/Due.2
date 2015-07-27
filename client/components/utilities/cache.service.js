/**
 * Created by Leo on 20/06/2015.
 */
'use strict';

angular.module('due2App')
  .factory('Cache',['$http','socket','$filter','Util','Logger',function($http,socket,$filter,Util,Logger) {
    var _idle = false;
    var _cache = {
      items: [],
      summary: {},
      central: 0,
      tags: []
    };
    function init() {
      _cache.items = [];
      _cache.summary = {};
      _cache.central = Util.toDays(new Date());
      _cache.tags = [];
    }

    function clear(){
      socket.unsyncUpdates('due');
      init();
    }


    function refreshSummary() {
      var s = {};
      $filter('options')(_cache.items, true, true, s);
      _cache.summary = s;
    }

    function refresh(item) {
      var r = $.grep(_cache.items, function(i){ return i._id==item._id});
      if (r.length<=0) return;
      Util.injectData(r[0]);
      _cache.tags = _.union(_cache.tags, item.budgets);
    }

    function refreshOnUpdate(event, item) {
      if (event!='deleted')
        refresh(item);
      refreshSummary();
    }

    function load(cb) {
      init();
      cb = cb || angular.noop;
      if (_idle) {
        cb();
        return;
      }
      _idle = true;
      $http.get('/api/dues/0/99999999999')
        .success(function(dues) {
          dues.forEach(function(due){
            Util.injectData(due);
            _cache.tags =  _.union(_cache.tags, due.budgets);
          });
          _cache.items = dues;
          refreshSummary();
          socket.syncUpdates('due', _cache.items, refreshOnUpdate);
          _idle = false;
          cb();
        })
        .error(function(err){
          _idle = false;
          Logger.error('Error loading dues!', err);
          cb();
        });
    }

    function get(id) {
      var result = $.grep(_cache.items, function(i) { return i._id==id; });
      return (result.length>0) ? result[0] : undefined;
    }

    return {
      load:load,
      clear:clear,
      //refresh:refresh,
      idle:_idle,
      data:_cache,
      get:get
    }
  }]);
