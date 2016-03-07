
$ViewProvider.$inject = [];
function $ViewProvider() {

  this.$get = $get;
  /**
   * @ngdoc object
   * @name ui.router.state.$view
   *
   * @requires ui.router.util.$templateFactory
   * @requires $rootScope
   *
   * @description
   *
   */
  $get.$inject = ['$rootScope', '$templateFactory'];
  function $get(   $rootScope,   $templateFactory) {
    return {
  ***REMOVED*** $view.load('full.viewName', { template: ..., controller: ..., resolve: ..., async: false, params: ... ***REMOVED***)
      /**
       * @ngdoc function
       * @name ui.router.state.$view#load
       * @methodOf ui.router.state.$view
       *
       * @description
       *
       * @param {string***REMOVED*** name name
       * @param {object***REMOVED*** options option object.
       */
      load: function load(name, options) {
        var result, defaults = {
          template: null, controller: null, view: null, locals: null, notify: true, async: true, params: {***REMOVED***
    ***REMOVED***;
        options = extend(defaults, options);

        if (options.view) {
          result = $templateFactory.fromConfig(options.view, options.params, options.locals);
    ***REMOVED***
        return result;
  ***REMOVED***
***REMOVED***;
  ***REMOVED***
***REMOVED***

angular.module('ui.router.state').provider('$view', $ViewProvider);
