'use strict';

angular.module('due2App')
  .directive('ngMouseWheel', function() {
    return function(scope, element, attrs) {
      element.bind("DOMMouseScroll mousewheel onmousewheel", function(e) {
        // cross-browser wheel delta
        e = e || window.event; // old IE support
        if (e.originalEvent) e = e.originalEvent;
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        if(delta != 0) {
          scope.$apply(function(){
            scope.$eval(scope[attrs.ngMouseWheel](-delta));
          });
          // for IE
          e.returnValue = false;
          // for Chrome and Firefox
          if(e.preventDefault)
            e.preventDefault();
        }
      });
    };
  })
  .controller('MainCtrl', ['$scope','$rootScope','Cache','$timeout','$window','$http','$filter','socket','Auth','$location','Modal','Util','Logger',
    function ($scope,$rootScope,Cache,$timeout,$window,$http,$filter,socket,Auth,$location,Modal,Util,Logger) {
    $scope.itemHeight = 60;
    $scope.visibleDues = [];
    var w = angular.element($window);
    w.bind('resize', function () { loadDues(); });
    $scope.showdetails = false;
    $scope.cache = Cache.data;

    function rebuildDays() {
      var days = [];
      var today = Util.toDays(new Date());
      for(var d=Cache.data.from; d<=Cache.data.to; d++){
        var date = Util.toDate(d);
        var wd = date.getDay();
        var num = date.getDate();
        if (num==1 && days.length>0)
          days[days.length-1].last = true;
        days.push({
          N:d,
          distance: d-today,
          year: date.getFullYear(),
          month: Util.months[date.getMonth()],
          desc: Util.daysOfWeek[wd],
          num: num,
          we: wd==0 || wd==6,
          today: (today==d),
          central: d==Cache.data.central
        });
      }
      $scope.days = days;
    }

    //// Carica gli elementi
    //function loadDuesBase(cb) {
    //  cb = cb || angular.noop;
    //  $http.get('/api/dues/'+$rootScope.userdata.from+'/'+$rootScope.userdata.to)
    //    .success(function(dues) {
    //      dues.forEach(function(due){ Util.injectData(due); });
    //      $scope.visibleDues = dues;
    //      socket.syncUpdates('due', $scope.visibleDues);
    //      cb();
    //    })
    //    .error(function(err){
    //      cb();
    //      Logger.error('Error loading dues!', err);
    //    });
    //}

    //// Carica gli elementi
    //function loadDues(cb) {
    //  var offset = 0;
    //  var hN2 = Math.floor((w.height() / $scope.itemHeight)/2);
    //  $rootScope.userdata.from = $rootScope.userdata.central-hN2+offset;
    //  $rootScope.userdata.to = $rootScope.userdata.central+hN2+offset;
    //  rebuildDays();
    //
    //  if ($scope.loading_prm)
    //    $timeout.cancel($scope.loading_prm);
    //  $scope.loading_prm = $timeout(function() {
    //    $scope.loading = true;
    //    loadDuesBase(cb);
    //  }, 300);
    //
    //  $scope.loading_prm.then(
    //    function() {
    //      $scope.loading = false;
    //    },
    //    function() {
    //      $scope.loading = false;
    //    }
    //  );
    //}

    $scope.logout = function() {
      Auth.logout();
      $rootScope.user = undefined;
      $location.path('/login');
      Cache.clear();
    };

    function openPage(template, params){
      $scope.overpage = {
        template: template,
        params: params
      };
    }

    $scope.profile = function() {
      openPage('app/main/overpage-settings.html');
    };

    $scope.settings = function() {
      openPage('app/main/overpage-options.html');
    };


    var modalCreate = Modal.confirm.edit(function(item) {
      if (item.real_date)
        item.date = Util.toDays(item.real_date);
      $http.post('/api/dues', item)
        .error(function(err) {
          Logger.error("Error creating new due", JSON.stringify(err));
        });
    });

    $scope.newelement = function() {
      var item = {
        name: 'New Due',
        date: Cache.data.central,
        type: 'out',
        value: 0
      };
      modalCreate(item);
    };

    $scope.gotopage = function() {
      openPage('app/main/overpage-goto.html');
    };

    $scope.search = function(params) {
      openPage('app/main/overpage-search.html', params);
    };

    $scope.buttons = [{
      style: 'fa-power-off',
      action: $scope.logout
    },{
      style: 'fa-cog',
      action: $scope.profile
    },{
      separator: true
    },{
      style: 'fa-search',
      action: $scope.search
    },{
      style: 'fa-map-marker',
      action: $scope.gotopage
    },{
      separator: true
    },{
      style: 'fa-bookmark-o',
      action: $scope.newelement
    }];

    $scope.$on('$destroy', function () {
    //  socket.unsyncUpdates('due');
    //  $timeout.cancel($scope.loading_prm);
      Cache.clear();
    });

    function updateItem(item) {
      $http.put('/api/dues/'+item._id, item)
        .success(function() {
          Logger.ok('Due "'+item.name+'" successfully updated!');
        })
        .error(function(err) {
          Logger.error("Error creating new due", JSON.stringify(err));
        });
    }

    var modalEdit = Modal.confirm.edit(function(item) {
      updateItem(item);
    });

    $scope.edit = function(item){ modalEdit(item); };

    $scope.closeOverlay = function() {
      $scope.submenu = undefined;
      $scope.overpage = undefined;
    };

    $scope.scrollData = function(value) {
      Cache.data.central += value;
      loadDues();
    };

    $scope.goto = function(date) {
      var todate = Util.toDays(date);
      if (todate) {
        Cache.data.central = todate;
        loadDues();
        $scope.closeOverlay();
      }
    };

    var modalDelete = Modal.confirm.ask(function(item) {
      $http.delete('/api/dues/' + item._id)
        .success(function() {
          Logger.ok('Due successfully deleted!');
        })
        .error(function(err){
          Logger.error('Error during due deletion!', err);
        });
    });

    $scope.delete = function(item) {
      var opt = Modal.confirm.getAskOptions(Modal.MODAL_DELETE, item.name);
      modalDelete(opt, item);
    };

    var modalHandle = Modal.confirm.handle(function(item, state) {
      item.state.push(state);
      updateItem(item);
    });

    $scope.handle = function(item) {
      var state = {
        date: Util.toDays(new Date()),
        value: item.data.realvalue.toFixed(2)
      };
      modalHandle(item, state);
    };

    function loadDues() {
      var offset = 0;
      var hN2 = Math.floor((w.height() / $scope.itemHeight) / 2);
      Cache.data.from = Cache.data.central - hN2 + offset;
      Cache.data.to = Cache.data.central + hN2 + offset;
      rebuildDays();
    }

    $scope.details = function() {
      $scope.search({undone: true, expired: true, details: true});
    };

    $scope.gotoday = function() {
      $scope.goto(new Date());
    };

    function Init() {
      Cache.load(function() { loadDues(); });
    }


    Init();
    //loadDues();
  }]);
