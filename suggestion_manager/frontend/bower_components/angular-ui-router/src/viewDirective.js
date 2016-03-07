var ngMajorVer = angular.version.major;
var ngMinorVer = angular.version.minor;
/**
 * @ngdoc directive
 * @name ui.router.state.directive:ui-view
 *
 * @requires ui.router.state.$state
 * @requires $compile
 * @requires $controller
 * @requires $injector
 * @requires ui.router.state.$uiViewScroll
 * @requires $document
 *
 * @restrict ECA
 *
 * @description
 * The ui-view directive tells $state where to place your templates.
 *
 * @param {string=***REMOVED*** name A view name. The name should be unique amongst the other views in the
 * same state. You can have views of the same name that live in different states.
 *
 * @param {string=***REMOVED*** autoscroll It allows you to set the scroll behavior of the browser window
 * when a view is populated. By default, $anchorScroll is overridden by ui-router's custom scroll
 * service, {@link ui.router.state.$uiViewScroll***REMOVED***. This custom service let's you
 * scroll ui-view elements into view when they are populated during a state activation.
 *
 * @param {string=***REMOVED*** noanimation If truthy, the non-animated renderer will be selected (no animations
 * will be applied to the ui-view)
 *
 * *Note: To revert back to old [`$anchorScroll`](http://docs.angularjs.org/api/ng.$anchorScroll)
 * functionality, call `$uiViewScrollProvider.useAnchorScroll()`.*
 *
 * @param {string=***REMOVED*** onload Expression to evaluate whenever the view updates.
 * 
 * @example
 * A view can be unnamed or named. 
 * <pre>
 * <!-- Unnamed -->
 * <div ui-view></div> 
 * 
 * <!-- Named -->
 * <div ui-view="viewName"></div>
 * </pre>
 *
 * You can only have one unnamed view within any template (or root html). If you are only using a 
 * single view and it is unnamed then you can populate it like so:
 * <pre>
 * <div ui-view></div> 
 * $stateProvider.state("home", {
 *   template: "<h1>HELLO!</h1>"
 * ***REMOVED***)
 * </pre>
 * 
 * The above is a convenient shortcut equivalent to specifying your view explicitly with the {@link ui.router.state.$stateProvider#views `views`***REMOVED***
 * config property, by name, in this case an empty name:
 * <pre>
 * $stateProvider.state("home", {
 *   views: {
 *     "": {
 *       template: "<h1>HELLO!</h1>"
 * ***REMOVED***
 *   ***REMOVED***    
 * ***REMOVED***)
 * </pre>
 * 
 * But typically you'll only use the views property if you name your view or have more than one view 
 * in the same template. There's not really a compelling reason to name a view if its the only one, 
 * but you could if you wanted, like so:
 * <pre>
 * <div ui-view="main"></div>
 * </pre> 
 * <pre>
 * $stateProvider.state("home", {
 *   views: {
 *     "main": {
 *       template: "<h1>HELLO!</h1>"
 * ***REMOVED***
 *   ***REMOVED***    
 * ***REMOVED***)
 * </pre>
 * 
 * Really though, you'll use views to set up multiple views:
 * <pre>
 * <div ui-view></div>
 * <div ui-view="chart"></div> 
 * <div ui-view="data"></div> 
 * </pre>
 * 
 * <pre>
 * $stateProvider.state("home", {
 *   views: {
 *     "": {
 *       template: "<h1>HELLO!</h1>"
 * ***REMOVED***,
 *     "chart": {
 *       template: "<chart_thing/>"
 * ***REMOVED***,
 *     "data": {
 *       template: "<data_thing/>"
 * ***REMOVED***
 *   ***REMOVED***    
 * ***REMOVED***)
 * </pre>
 *
 * Examples for `autoscroll`:
 *
 * <pre>
 * <!-- If autoscroll present with no expression,
 *      then scroll ui-view into view -->
 * <ui-view autoscroll/>
 *
 * <!-- If autoscroll present with valid expression,
 *      then scroll ui-view into view if expression evaluates to true -->
 * <ui-view autoscroll='true'/>
 * <ui-view autoscroll='false'/>
 * <ui-view autoscroll='scopeVariable'/>
 * </pre>
 */
$ViewDirective.$inject = ['$state', '$injector', '$uiViewScroll', '$interpolate'];
function $ViewDirective(   $state,   $injector,   $uiViewScroll,   $interpolate) {

  function getService() {
    return ($injector.has) ? function(service) {
      return $injector.has(service) ? $injector.get(service) : null;
***REMOVED*** : function(service) {
  ***REMOVED***
        return $injector.get(service);
  ***REMOVED*** catch (e) {
        return null;
  ***REMOVED***
***REMOVED***;
  ***REMOVED***

  var service = getService(),
      $animator = service('$animator'),
      $animate = service('$animate');

  // Returns a set of DOM manipulation functions based on which Angular version
  // it should use
  function getRenderer(attrs, scope) {
    var statics = {
      enter: function (element, target, cb) { target.after(element); cb(); ***REMOVED***,
      leave: function (element, cb) { element.remove(); cb(); ***REMOVED***
***REMOVED***;

    if (!!attrs.noanimation) return statics;

    function animEnabled(element) {
      if (ngMajorVer === 1 && ngMinorVer >= 4) return !!$animate.enabled(element);
      if (ngMajorVer === 1 && ngMinorVer >= 2) return !!$animate.enabled();
      return (!!$animator);
***REMOVED***

***REMOVED*** ng 1.2+
    if ($animate) {
      return {
        enter: function(element, target, cb) {
          if (!animEnabled(element)) {
            statics.enter(element, target, cb);
      ***REMOVED*** else if (angular.version.minor > 2) {
            $animate.enter(element, null, target).then(cb);
      ***REMOVED*** ***REMOVED***
            $animate.enter(element, null, target, cb);
      ***REMOVED***
    ***REMOVED***,
        leave: function(element, cb) {
          if (!animEnabled(element)) {
            statics.leave(element, cb);
      ***REMOVED*** else if (angular.version.minor > 2) {
            $animate.leave(element).then(cb);
      ***REMOVED*** ***REMOVED***
            $animate.leave(element, cb);
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***;
***REMOVED***

***REMOVED*** ng 1.1.5
    if ($animator) {
      var animate = $animator && $animator(scope, attrs);

      return {
        enter: function(element, target, cb) {animate.enter(element, null, target); cb(); ***REMOVED***,
        leave: function(element, cb) { animate.leave(element); cb(); ***REMOVED***
  ***REMOVED***;
***REMOVED***

    return statics;
  ***REMOVED***

  var directive = {
    restrict: 'ECA',
    terminal: true,
    priority: 400,
    transclude: 'element',
    compile: function (tElement, tAttrs, $transclude) {
      return function (scope, $element, attrs) {
        var previousEl, currentEl, currentScope, latestLocals,
            onloadExp     = attrs.onload || '',
            autoScrollExp = attrs.autoscroll,
            renderer      = getRenderer(attrs, scope);

        scope.$on('$stateChangeSuccess', function() {
          updateView(false);
    ***REMOVED***);

        updateView(true);

        function cleanupLastView() {
          var _previousEl = previousEl;
          var _currentScope = currentScope;

          if (_currentScope) {
            _currentScope._willBeDestroyed = true;
      ***REMOVED***

          function cleanOld() {
            if (_previousEl) {
              _previousEl.remove();
        ***REMOVED***

            if (_currentScope) {
              _currentScope.$destroy();
        ***REMOVED***
      ***REMOVED***

          if (currentEl) {
            renderer.leave(currentEl, function() {
              cleanOld();
              previousEl = null;
        ***REMOVED***);

            previousEl = currentEl;
      ***REMOVED*** ***REMOVED***
            cleanOld();
            previousEl = null;
      ***REMOVED***

          currentEl = null;
          currentScope = null;
    ***REMOVED***

        function updateView(firstTime) {
          var newScope,
              name            = getUiViewName(scope, attrs, $element, $interpolate),
              previousLocals  = name && $state.$current && $state.$current.locals[name];

          if (!firstTime && previousLocals === latestLocals || scope._willBeDestroyed) return; // nothing to do
          newScope = scope.$new();
          latestLocals = $state.$current.locals[name];

          /**
           * @ngdoc event
           * @name ui.router.state.directive:ui-view#$viewContentLoading
           * @eventOf ui.router.state.directive:ui-view
           * @eventType emits on ui-view directive scope
           * @description
           *
           * Fired once the view **begins loading**, *before* the DOM is rendered.
           *
           * @param {Object***REMOVED*** event Event object.
           * @param {string***REMOVED*** viewName Name of the view.
           */
          newScope.$emit('$viewContentLoading', name);

          var clone = $transclude(newScope, function(clone) {
            renderer.enter(clone, $element, function onUiViewEnter() {
              if(currentScope) {
                currentScope.$emit('$viewContentAnimationEnded');
          ***REMOVED***

              if (angular.isDefined(autoScrollExp) && !autoScrollExp || scope.$eval(autoScrollExp)) {
                $uiViewScroll(clone);
          ***REMOVED***
        ***REMOVED***);
            cleanupLastView();
      ***REMOVED***);

          currentEl = clone;
          currentScope = newScope;
          /**
           * @ngdoc event
           * @name ui.router.state.directive:ui-view#$viewContentLoaded
           * @eventOf ui.router.state.directive:ui-view
           * @eventType emits on ui-view directive scope
           * @description
           * Fired once the view is **loaded**, *after* the DOM is rendered.
           *
           * @param {Object***REMOVED*** event Event object.
           * @param {string***REMOVED*** viewName Name of the view.
           */
          currentScope.$emit('$viewContentLoaded', name);
          currentScope.$eval(onloadExp);
    ***REMOVED***
  ***REMOVED***;
***REMOVED***
  ***REMOVED***;

  return directive;
***REMOVED***

$ViewDirectiveFill.$inject = ['$compile', '$controller', '$state', '$interpolate'];
function $ViewDirectiveFill (  $compile,   $controller,   $state,   $interpolate) {
  return {
    restrict: 'ECA',
    priority: -400,
    compile: function (tElement) {
      var initial = tElement.html();
      return function (scope, $element, attrs) {
        var current = $state.$current,
            name = getUiViewName(scope, attrs, $element, $interpolate),
            locals  = current && current.locals[name];

        if (! locals) {
          return;
    ***REMOVED***

        $element.data('$uiView', { name: name, state: locals.$$state ***REMOVED***);
        $element.html(locals.$template ? locals.$template : initial);

        var link = $compile($element.contents());

        if (locals.$$controller) {
          locals.$scope = scope;
          locals.$element = $element;
          var controller = $controller(locals.$$controller, locals);
          if (locals.$$controllerAs) {
            scope[locals.$$controllerAs] = controller;
      ***REMOVED***
          $element.data('$ngControllerController', controller);
          $element.children().data('$ngControllerController', controller);
    ***REMOVED***

        link(scope);
  ***REMOVED***;
***REMOVED***
  ***REMOVED***;
***REMOVED***

/**
 * Shared ui-view code for both directives:
 * Given scope, element, and its attributes, return the view's name
 */
function getUiViewName(scope, attrs, element, $interpolate) {
  var name = $interpolate(attrs.uiView || attrs.name || '')(scope);
  var inherited = element.inheritedData('$uiView');
  return name.indexOf('@') >= 0 ?  name :  (name + '@' + (inherited ? inherited.state.name : ''));
***REMOVED***

angular.module('ui.router.state').directive('uiView', $ViewDirective);
angular.module('ui.router.state').directive('uiView', $ViewDirectiveFill);
