/**
 * Created by Leo on 20/06/2015.
 */
'use strict'

angular.module('due2App')
  .factory('Cache',['$http','socket','Util','Logger',function($http,socket,Util,Logger) {
    var _cache = {};
    var _idle = false;

    function clear(){
      socket.unsyncUpdates('due');
      _cache.items = [];
    }

    function load(cb) {
      cb = cb || angular.noop;
      if (_idle) {
        cb()
        return;
      }
      _idle = true;
      $http.get('/api/dues/0/99999999999')
        .success(function(dues) {
          dues.forEach(function(due){ Util.injectData(due); });
          _cache.items = dues;
          socket.syncUpdates('due', _cache.items);
          _idle = false;
        })
        .error(function(err){
          _idle = false;
          Logger.error('Error loading dues!', err);
        });
    }

    return {
      load:load,
      clear:clear,
      idle:_idle,
      data:_cache
    }
  }]);
