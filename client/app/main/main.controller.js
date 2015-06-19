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
  .controller('MainCtrl', ['$scope','$rootScope','$timeout','$window','$http','socket','Auth','$location','Modal','Util','Logger', function ($scope,$rootScope,$timeout,$window,$http,socket,Auth,$location,Modal,Util,Logger) {
    $scope.itemHeight = 60;
    $scope.visibleDues = [];
    var w = angular.element($window);
    w.bind('resize', function () { loadDues(); });

    if (!$rootScope.userdata) {
      $rootScope.userdata = {
        central: Util.toDays(new Date())
      };
    }


    function rebuildDays() {
      var days = [];
      var today = Util.toDays(new Date());
      for(var d=$rootScope.userdata.from; d<=$rootScope.userdata.to; d++){
        var date = Util.toDate(d);
        var wd = date.getDay();
        var num = date.getDate();
        if (num==1 && days.length>0)
          days[days.length-1].last = true;
        days.push({
          N:d,
          year: date.getFullYear(),
          month: Util.months[date.getMonth()],
          desc: Util.daysOfWeek[wd],
          num: num,
          we: wd==0 || wd==6,
          today: (today==d),
          central: d==$rootScope.userdata.central
        });
      }
      $scope.days = days;
    }

    // Carica gli elementi
    function loadDuesBase(cb) {
      cb = cb || angular.noop;
      $http.get('/api/dues/'+$rootScope.userdata.from+'/'+$rootScope.userdata.to)
        .success(function(dues) {
          dues.forEach(function(due){ Util.injectData(due); });
          $scope.visibleDues = dues;
          socket.syncUpdates('due', $scope.visibleDues);
          cb();
        })
        .error(function(err){
          cb();
          Logger.error('Error loading dues!', err);
        });
    }

    // Carica gli elementi
    function loadDues(cb) {
      var offset = 0;
      var hN2 = Math.floor((w.height() / $scope.itemHeight)/2);
      $rootScope.userdata.from = $rootScope.userdata.central-hN2+offset;
      $rootScope.userdata.to = $rootScope.userdata.central+hN2+offset;
      rebuildDays();

      if ($scope.loading_prm)
        $timeout.cancel($scope.loading_prm);
      $scope.loading_prm = $timeout(function() {
        $scope.loading = true;
        loadDuesBase(cb);
      }, 300);

      $scope.loading_prm.then(
        function() {
          $scope.loading = false;
        },
        function() {
          $scope.loading = false;
        }
      );
    }

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.profile = function() {
      $scope.overpage = { template: 'app/main/overpage-settings.html' };
    };

    $scope.settings = function() {
      $scope.overpage = { template: 'app/main/overpage-options.html' };
    };


    var modalCreate = Modal.confirm.edit(function(item) {
      if (item.real_date)
        item.date = Util.toDays(item.real_date);
      $http.post('/api/dues', item)
        .success(function(due){
          //.....
        })
        .error(function(err) {
          Logger.error("Error creating new due", JSON.stringify(err));
        });
    });

    $scope.context = $rootScope.userdata;

    $scope.newelement = function() {
      var item = {
        name: 'New Due',
        date: $rootScope.userdata.central,
        type: 'out',
        value: 0
      };
      modalCreate(item);
    };

    $scope.goto = function() {
      $scope.overpage = { template: 'app/main/overpage-goto.html' };
    };

    $scope.search = function() {
      $scope.overpage = { template: 'app/main/overpage-search.html' };
    };

    $scope.buttons = [{
      style: 'fa-power-off',
      action: $scope.logout
    },{
      separator: true
    },{
      style: 'fa-user',
      action: $scope.profile
    },{
      style: 'fa-cog',
      action: $scope.settings
    },{
      separator: true
    },{
      style: 'fa-bookmark-o',
      action: $scope.newelement
    },{
      style: 'fa-map-marker',
      action: $scope.goto
    },{
      separator: true
    },{
      style: 'fa-search',
      action: $scope.search
    }];

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('due');
      $timeout.cancel($scope.loading_prm);
    });

    var modalEdit = Modal.confirm.edit(function(item) {
      $http.put('/api/dues/'+item._id, item)
        .success(function() {
          Logger.ok('Due "'+item.name+'" successfully updated!');
        })
        .error(function(err) {
          Logger.error("Error creating new due", JSON.stringify(err));
        });
    });

    $scope.edit = function(item){ modalEdit(item); };

    $scope.closeOverlay = function() {
      $scope.submenu = undefined;
      $scope.overpage = undefined;
    };

    $scope.scrollData = function(value) {
      $rootScope.userdata.central += value;
      loadDues();
    };

    $scope.goto = function(date) {
      var todate = Util.toDays(date);
      if (todate) {
        $rootScope.userdata.central = todate;
        loadDues();
        $scope.closeOverlay();
      }
    };

    loadDues();
  }]);

//     $scope.deleteThing = function(thing) {
//       $http.delete('/api/things/' + thing._id);
//     };
