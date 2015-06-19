'use strict';

angular.module('due2App')
  .factory('Modal', ['$rootScope','$modal','Util',function ($rootScope,$modal,Util) {
    var modal_DELETE = 'delete';
    var modal_YESNOCANCEL = 'yesnocancel';
    /**
     * Opens a modal
     * @param  {Object} scope      - an object to be merged with modal's scope
     * @param  {String} modalClass - (optional) class(es) to be applied to the modal
     * @return {Object}            - the instance $modal.open() returns
     */
    function openModal(scope, modalClass) {
      var modalScope = $rootScope.$new();
      scope = scope || {};
      modalClass = modalClass || 'modal-default';

      angular.extend(modalScope, scope);

      if ($rootScope.userdata)
        $rootScope.userdata.ismodal = true;

      return $modal.open({
        templateUrl: 'components/modal/modal.html',
        windowClass: modalClass,
        scope: modalScope
      });
    }

    function resetModalState() {
      if ($rootScope.userdata)
        $rootScope.userdata.ismodal = false;
    }

    return {
      MODAL_DELETE:modal_DELETE,
      MODAL_YESNOCANCEL:modal_YESNOCANCEL,

      /* Confirmation modals */
      confirm: {
        /**
         * Returns options for right ask modal form
         * @param type
         */
        getAskOptions: function(type) {
          var args = Array.prototype.slice.call(arguments),
            type = args.shift();
          var opt = {
            title: '',
            body: '',
            ok: 'OK',
            okClass: 'btn-warning',
            okResult: 'ok',
            cancel: 'Cancel',
            cancelClass: 'btn-default',
            no: '',
            noClass: 'btn-danger',
            noResult: 'no',
            modalClass: 'modal-warning'
          };
          switch(type) {
            case(modal_DELETE):
              opt.title = 'Confirm Delete';
              opt.body = '<p>Are you sure you want to delete <strong>' + args[0] + '</strong> ?</p>';
              opt.ok = 'Delete';
              opt.okClass = 'btn-danger';
              opt.modalClass = 'modal-danger';
              break;
            case(modal_YESNOCANCEL):
              opt.ok = 'Yes';
              opt.no = 'No';
              break;
          }
          return opt;
        },


        /**
         * Create a function to open a generic confirmation modal (ex. ng-click='myModalFn(options, arg1, arg2...)')
         * @param  {Function} exc - callback, ran when execution is confirmed
         * @param  {Function} dsc - callback, ran when execution is discard
         * @return {Function}     - the function to open the modal (ex. myModalFn)
         */
        ask: function(exc, dsc) {
          exc = exc || angular.noop;
          dsc = dsc || angular.noop;

          /**
           * Open a execution confirmation modal
           * @param  options   - class of modal options
           * @param  {All}     - any additional args are passed staight to del callback
           */
          return function() {
            var args = Array.prototype.slice.call(arguments),
              options = args.shift(),
              execModal;

            var buttons = [];
            if (options.ok) buttons.push({
                classes: options.okClass,
                text: options.ok,
                click: function(e) {
                  args.push(options.okResult);
                  execModal.close(e);
                }
              });
            if (options.no) buttons.push({
                classes: options.noClass,
                text: options.no,
                click: function(e) {
                  args.push(options.noResult);
                  execModal.close(e);
                }
              });
            if (options.cancel) buttons.push({
                classes: options.cancelClass,
                text: options.cancel,
                click: function(e) {
                  execModal.dismiss(e);
                }
              });

            execModal = openModal({
              modal: {
                dismissable: true,
                title: options.title,
                html: options.body,
                buttons: buttons
              }
            }, options.modalClass);

            execModal.result.then(function(event) {
              exc.apply(event, args);
              resetModalState();
            }, function(event){
              dsc.apply(event, args);
              resetModalState();
            });
          };
        },


        /**
         * Modifica una scadenza ...
         * @param cb
         * @returns {Function}
         */
        edit: function(cb) {
          cb = cb || angular.noop;

          return function() {
            var args = Array.prototype.slice.call(arguments);

            var editModal = openModal({
              modal: {
                item: args[0],
                dismissable: true,
                idle: false,
                title: args[0].name,
                template: 'components/modal/modal-edit.html',
                buttons: [{
                  classes: 'btn-success',
                  text: 'Ok',
                  click: function(e) {
                    editModal.close(e);
                  }
                },{
                  classes: 'btn-warning',
                  text: 'Cancel',
                  click: function(e) {
                    editModal.dismiss(e);
                  }
                }]
              }
            }, 'modal-edit');

            editModal.result.then(function(event) {
              cb.apply(event, args);
              resetModalState();
            }, function() {
              resetModalState();
            });
          };
        }

      }
    };
  }]);
