/**
 * @license AngularJS v1.5.0
 * (c) 2010-2016 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

/* jshint ignore:start */
var noop        = angular.noop;
var copy        = angular.copy;
var extend      = angular.extend;
var jqLite      = angular.element;
var forEach     = angular.forEach;
var isArray     = angular.isArray;
var isString    = angular.isString;
var isObject    = angular.isObject;
var isUndefined = angular.isUndefined;
var isDefined   = angular.isDefined;
var isFunction  = angular.isFunction;
var isElement   = angular.isElement;

var ELEMENT_NODE = 1;
var COMMENT_NODE = 8;

var ADD_CLASS_SUFFIX = '-add';
var REMOVE_CLASS_SUFFIX = '-remove';
var EVENT_CLASS_PREFIX = 'ng-';
var ACTIVE_CLASS_SUFFIX = '-active';
var PREPARE_CLASS_SUFFIX = '-prepare';

var NG_ANIMATE_CLASSNAME = 'ng-animate';
var NG_ANIMATE_CHILDREN_DATA = '$$ngAnimateChildren';

// Detect proper transitionend/animationend event names.
var CSS_PREFIX = '', TRANSITION_PROP, TRANSITIONEND_EVENT, ANIMATION_PROP, ANIMATIONEND_EVENT;

// If unprefixed events are not supported but webkit-prefixed are, use the latter.
// Otherwise, just use W3C names, browsers not supporting them at all will just ignore them.
// Note: Chrome implements `window.onwebkitanimationend` and doesn't implement `window.onanimationend`
// but at the same time dispatches the `animationend` event and not `webkitAnimationEnd`.
// Register both events in case `window.onanimationend` is not supported because of that,
// do the same for `transitionend` as Safari is likely to exhibit similar behavior.
// Also, the only modern browser that uses vendor prefixes for transitions/keyframes is webkit
// therefore there is no reason to test anymore for other vendor prefixes:
// http://caniuse.com/#search=transition
if (isUndefined(window.ontransitionend) && isDefined(window.onwebkittransitionend)) {
  CSS_PREFIX = '-webkit-';
  TRANSITION_PROP = 'WebkitTransition';
  TRANSITIONEND_EVENT = 'webkitTransitionEnd transitionend';
***REMOVED*** ***REMOVED***
  TRANSITION_PROP = 'transition';
  TRANSITIONEND_EVENT = 'transitionend';
***REMOVED***

if (isUndefined(window.onanimationend) && isDefined(window.onwebkitanimationend)) {
  CSS_PREFIX = '-webkit-';
  ANIMATION_PROP = 'WebkitAnimation';
  ANIMATIONEND_EVENT = 'webkitAnimationEnd animationend';
***REMOVED*** ***REMOVED***
  ANIMATION_PROP = 'animation';
  ANIMATIONEND_EVENT = 'animationend';
***REMOVED***

var DURATION_KEY = 'Duration';
var PROPERTY_KEY = 'Property';
var DELAY_KEY = 'Delay';
var TIMING_KEY = 'TimingFunction';
var ANIMATION_ITERATION_COUNT_KEY = 'IterationCount';
var ANIMATION_PLAYSTATE_KEY = 'PlayState';
var SAFE_FAST_FORWARD_DURATION_VALUE = 9999;

var ANIMATION_DELAY_PROP = ANIMATION_PROP + DELAY_KEY;
var ANIMATION_DURATION_PROP = ANIMATION_PROP + DURATION_KEY;
var TRANSITION_DELAY_PROP = TRANSITION_PROP + DELAY_KEY;
var TRANSITION_DURATION_PROP = TRANSITION_PROP + DURATION_KEY;

var isPromiseLike = function(p) {
  return p && p.then ? true : false;
***REMOVED***;

var ngMinErr = angular.$$minErr('ng');
function assertArg(arg, name, reason) {
  if (!arg) {
    throw ngMinErr('areq', "Argument '{0***REMOVED***' is {1***REMOVED***", (name || '?'), (reason || "required"));
  ***REMOVED***
  return arg;
***REMOVED***

function mergeClasses(a,b) {
  if (!a && !b) return '';
  if (!a) return b;
  if (!b) return a;
  if (isArray(a)) a = a.join(' ');
  if (isArray(b)) b = b.join(' ');
  return a + ' ' + b;
***REMOVED***

function packageStyles(options) {
  var styles = {***REMOVED***;
  if (options && (options.to || options.from)) {
    styles.to = options.to;
    styles.from = options.from;
  ***REMOVED***
  return styles;
***REMOVED***

function pendClasses(classes, fix, isPrefix) {
  var className = '';
  classes = isArray(classes)
      ? classes
      : classes && isString(classes) && classes.length
          ? classes.split(/\s+/)
          : [];
  forEach(classes, function(klass, i) {
    if (klass && klass.length > 0) {
      className += (i > 0) ? ' ' : '';
      className += isPrefix ? fix + klass
                            : klass + fix;
***REMOVED***
  ***REMOVED***);
  return className;
***REMOVED***

function removeFromArray(arr, val) {
  var index = arr.indexOf(val);
  if (val >= 0) {
    arr.splice(index, 1);
  ***REMOVED***
***REMOVED***

function stripCommentsFromElement(element) {
  if (element instanceof jqLite) {
    switch (element.length) {
      case 0:
        return [];
        break;

      case 1:
    ***REMOVED*** there is no point of stripping anything if the element
    ***REMOVED*** is the only element within the jqLite wrapper.
    ***REMOVED*** (it's important that we retain the element instance.)
        if (element[0].nodeType === ELEMENT_NODE) {
          return element;
    ***REMOVED***
        break;

      default:
        return jqLite(extractElementNode(element));
        break;
***REMOVED***
  ***REMOVED***

  if (element.nodeType === ELEMENT_NODE) {
    return jqLite(element);
  ***REMOVED***
***REMOVED***

function extractElementNode(element) {
  if (!element[0]) return element;
  for (var i = 0; i < element.length; i++) {
    var elm = element[i];
    if (elm.nodeType == ELEMENT_NODE) {
      return elm;
***REMOVED***
  ***REMOVED***
***REMOVED***

function $$addClass($$jqLite, element, className) {
  forEach(element, function(elm) {
    $$jqLite.addClass(elm, className);
  ***REMOVED***);
***REMOVED***

function $$removeClass($$jqLite, element, className) {
  forEach(element, function(elm) {
    $$jqLite.removeClass(elm, className);
  ***REMOVED***);
***REMOVED***

function applyAnimationClassesFactory($$jqLite) {
  return function(element, options) {
    if (options.addClass) {
      $$addClass($$jqLite, element, options.addClass);
      options.addClass = null;
***REMOVED***
    if (options.removeClass) {
      $$removeClass($$jqLite, element, options.removeClass);
      options.removeClass = null;
***REMOVED***
  ***REMOVED***
***REMOVED***

function prepareAnimationOptions(options) {
  options = options || {***REMOVED***;
  if (!options.$$prepared) {
    var domOperation = options.domOperation || noop;
    options.domOperation = function() {
      options.$$domOperationFired = true;
      domOperation();
      domOperation = noop;
***REMOVED***;
    options.$$prepared = true;
  ***REMOVED***
  return options;
***REMOVED***

function applyAnimationStyles(element, options) {
  applyAnimationFromStyles(element, options);
  applyAnimationToStyles(element, options);
***REMOVED***

function applyAnimationFromStyles(element, options) {
  if (options.from) {
    element.css(options.from);
    options.from = null;
  ***REMOVED***
***REMOVED***

function applyAnimationToStyles(element, options) {
  if (options.to) {
    element.css(options.to);
    options.to = null;
  ***REMOVED***
***REMOVED***

function mergeAnimationDetails(element, oldAnimation, newAnimation) {
  var target = oldAnimation.options || {***REMOVED***;
  var newOptions = newAnimation.options || {***REMOVED***;

  var toAdd = (target.addClass || '') + ' ' + (newOptions.addClass || '');
  var toRemove = (target.removeClass || '') + ' ' + (newOptions.removeClass || '');
  var classes = resolveElementClasses(element.attr('class'), toAdd, toRemove);

  if (newOptions.preparationClasses) {
    target.preparationClasses = concatWithSpace(newOptions.preparationClasses, target.preparationClasses);
    delete newOptions.preparationClasses;
  ***REMOVED***

  // noop is basically when there is no callback; otherwise something has been set
  var realDomOperation = target.domOperation !== noop ? target.domOperation : null;

  extend(target, newOptions);

  // TODO(matsko or sreeramu): proper fix is to maintain all animation callback in array and call at last,but now only leave has the callback so no issue with this.
  if (realDomOperation) {
    target.domOperation = realDomOperation;
  ***REMOVED***

  if (classes.addClass) {
    target.addClass = classes.addClass;
  ***REMOVED*** ***REMOVED***
    target.addClass = null;
  ***REMOVED***

  if (classes.removeClass) {
    target.removeClass = classes.removeClass;
  ***REMOVED*** ***REMOVED***
    target.removeClass = null;
  ***REMOVED***

  oldAnimation.addClass = target.addClass;
  oldAnimation.removeClass = target.removeClass;

  return target;
***REMOVED***

function resolveElementClasses(existing, toAdd, toRemove) {
  var ADD_CLASS = 1;
  var REMOVE_CLASS = -1;

  var flags = {***REMOVED***;
  existing = splitClassesToLookup(existing);

  toAdd = splitClassesToLookup(toAdd);
  forEach(toAdd, function(value, key) {
    flags[key] = ADD_CLASS;
  ***REMOVED***);

  toRemove = splitClassesToLookup(toRemove);
  forEach(toRemove, function(value, key) {
    flags[key] = flags[key] === ADD_CLASS ? null : REMOVE_CLASS;
  ***REMOVED***);

  var classes = {
    addClass: '',
    removeClass: ''
  ***REMOVED***;

  forEach(flags, function(val, klass) {
    var prop, allow;
    if (val === ADD_CLASS) {
      prop = 'addClass';
      allow = !existing[klass];
***REMOVED*** else if (val === REMOVE_CLASS) {
      prop = 'removeClass';
      allow = existing[klass];
***REMOVED***
    if (allow) {
      if (classes[prop].length) {
        classes[prop] += ' ';
  ***REMOVED***
      classes[prop] += klass;
***REMOVED***
  ***REMOVED***);

  function splitClassesToLookup(classes) {
    if (isString(classes)) {
      classes = classes.split(' ');
***REMOVED***

    var obj = {***REMOVED***;
    forEach(classes, function(klass) {
  ***REMOVED*** sometimes the split leaves empty string values
  ***REMOVED*** incase extra spaces were applied to the options
      if (klass.length) {
        obj[klass] = true;
  ***REMOVED***
***REMOVED***);
    return obj;
  ***REMOVED***

  return classes;
***REMOVED***

function getDomNode(element) {
  return (element instanceof angular.element) ? element[0] : element;
***REMOVED***

function applyGeneratedPreparationClasses(element, event, options) {
  var classes = '';
  if (event) {
    classes = pendClasses(event, EVENT_CLASS_PREFIX, true);
  ***REMOVED***
  if (options.addClass) {
    classes = concatWithSpace(classes, pendClasses(options.addClass, ADD_CLASS_SUFFIX));
  ***REMOVED***
  if (options.removeClass) {
    classes = concatWithSpace(classes, pendClasses(options.removeClass, REMOVE_CLASS_SUFFIX));
  ***REMOVED***
  if (classes.length) {
    options.preparationClasses = classes;
    element.addClass(classes);
  ***REMOVED***
***REMOVED***

function clearGeneratedClasses(element, options) {
  if (options.preparationClasses) {
    element.removeClass(options.preparationClasses);
    options.preparationClasses = null;
  ***REMOVED***
  if (options.activeClasses) {
    element.removeClass(options.activeClasses);
    options.activeClasses = null;
  ***REMOVED***
***REMOVED***

function blockTransitions(node, duration) {
  // we use a negative delay value since it performs blocking
  // yet it doesn't kill any existing transitions running on the
  // same element which makes this safe for class-based animations
  var value = duration ? '-' + duration + 's' : '';
  applyInlineStyle(node, [TRANSITION_DELAY_PROP, value]);
  return [TRANSITION_DELAY_PROP, value];
***REMOVED***

function blockKeyframeAnimations(node, applyBlock) {
  var value = applyBlock ? 'paused' : '';
  var key = ANIMATION_PROP + ANIMATION_PLAYSTATE_KEY;
  applyInlineStyle(node, [key, value]);
  return [key, value];
***REMOVED***

function applyInlineStyle(node, styleTuple) {
  var prop = styleTuple[0];
  var value = styleTuple[1];
  node.style[prop] = value;
***REMOVED***

function concatWithSpace(a,b) {
  if (!a) return b;
  if (!b) return a;
  return a + ' ' + b;
***REMOVED***

var $$rAFSchedulerFactory = ['$$rAF', function($$rAF) {
  var queue, cancelFn;

  function scheduler(tasks) {
***REMOVED*** we make a copy since RAFScheduler mutates the state
***REMOVED*** of the passed in array variable and this would be difficult
***REMOVED*** to track down on the outside code
    queue = queue.concat(tasks);
    nextTick();
  ***REMOVED***

  queue = scheduler.queue = [];

  /* waitUntilQuiet does two things:
   * 1. It will run the FINAL `fn` value only when an uncanceled RAF has passed through
   * 2. It will delay the next wave of tasks from running until the quiet `fn` has run.
   *
   * The motivation here is that animation code can request more time from the scheduler
   * before the next wave runs. This allows for certain DOM properties such as classes to
   * be resolved in time for the next animation to run.
   */
  scheduler.waitUntilQuiet = function(fn) {
    if (cancelFn) cancelFn();

    cancelFn = $$rAF(function() {
      cancelFn = null;
      fn();
      nextTick();
***REMOVED***);
  ***REMOVED***;

  return scheduler;

  function nextTick() {
    if (!queue.length) return;

    var items = queue.shift();
    for (var i = 0; i < items.length; i++) {
      items[i]();
***REMOVED***

    if (!cancelFn) {
      $$rAF(function() {
        if (!cancelFn) nextTick();
  ***REMOVED***);
***REMOVED***
  ***REMOVED***
***REMOVED***];

/**
 * @ngdoc directive
 * @name ngAnimateChildren
 * @restrict AE
 * @element ANY
 *
 * @description
 *
 * ngAnimateChildren allows you to specify that children of this element should animate even if any
 * of the children's parents are currently animating. By default, when an element has an active `enter`, `leave`, or `move`
 * (structural) animation, child elements that also have an active structural animation are not animated.
 *
 * Note that even if `ngAnimteChildren` is set, no child animations will run when the parent element is removed from the DOM (`leave` animation).
 *
 *
 * @param {string***REMOVED*** ngAnimateChildren If the value is empty, `true` or `on`,
 *     then child animations are allowed. If the value is `false`, child animations are not allowed.
 *
 * @example
 * <example module="ngAnimateChildren" name="ngAnimateChildren" deps="angular-animate.js" animations="true">
     <file name="index.html">
       <div ng-controller="mainController as main">
         <label>Show container? <input type="checkbox" ng-model="main.enterElement" /></label>
         <label>Animate children? <input type="checkbox" ng-model="main.animateChildren" /></label>
         <hr>
         <div ng-animate-children="{{main.animateChildren***REMOVED******REMOVED***">
           <div ng-if="main.enterElement" class="container">
             List of items:
             <div ng-repeat="item in [0, 1, 2, 3]" class="item">Item {{item***REMOVED******REMOVED***</div>
           </div>
         </div>
       </div>
     </file>
     <file name="animations.css">

      .container.ng-enter,
      .container.ng-leave {
        transition: all ease 1.5s;
  ***REMOVED***

      .container.ng-enter,
      .container.ng-leave-active {
        opacity: 0;
  ***REMOVED***

      .container.ng-leave,
      .container.ng-enter-active {
        opacity: 1;
  ***REMOVED***

      .item {
        background: firebrick;
        color: #FFF;
        margin-bottom: 10px;
  ***REMOVED***

      .item.ng-enter,
      .item.ng-leave {
        transition: transform 1.5s ease;
  ***REMOVED***

      .item.ng-enter {
        transform: translateX(50px);
  ***REMOVED***

      .item.ng-enter-active {
        transform: translateX(0);
  ***REMOVED***
    </file>
    <file name="script.js">
      angular.module('ngAnimateChildren', ['ngAnimate'])
        .controller('mainController', function() {
          this.animateChildren = false;
          this.enterElement = false;
    ***REMOVED***);
    </file>
  </example>
 */
var $$AnimateChildrenDirective = ['$interpolate', function($interpolate) {
  return {
    link: function(scope, element, attrs) {
      var val = attrs.ngAnimateChildren;
      if (angular.isString(val) && val.length === 0) { //empty attribute
        element.data(NG_ANIMATE_CHILDREN_DATA, true);
  ***REMOVED*** ***REMOVED***
    ***REMOVED*** Interpolate and set the value, so that it is available to
    ***REMOVED*** animations that run right after compilation
        setData($interpolate(val)(scope));
        attrs.$observe('ngAnimateChildren', setData);
  ***REMOVED***

      function setData(value) {
        value = value === 'on' || value === 'true';
        element.data(NG_ANIMATE_CHILDREN_DATA, value);
  ***REMOVED***
***REMOVED***
  ***REMOVED***;
***REMOVED***];

var ANIMATE_TIMER_KEY = '$$animateCss';

/**
 * @ngdoc service
 * @name $animateCss
 * @kind object
 *
 * @description
 * The `$animateCss` service is a useful utility to trigger customized CSS-based transitions/keyframes
 * from a JavaScript-based animation or directly from a directive. The purpose of `$animateCss` is NOT
 * to side-step how `$animate` and ngAnimate work, but the goal is to allow pre-existing animations or
 * directives to create more complex animations that can be purely driven using CSS code.
 *
 * Note that only browsers that support CSS transitions and/or keyframe animations are capable of
 * rendering animations triggered via `$animateCss` (bad news for IE9 and lower).
 *
 * ## Usage
 * Once again, `$animateCss` is designed to be used inside of a registered JavaScript animation that
 * is powered by ngAnimate. It is possible to use `$animateCss` directly inside of a directive, however,
 * any automatic control over cancelling animations and/or preventing animations from being run on
 * child elements will not be handled by Angular. For this to work as expected, please use `$animate` to
 * trigger the animation and then setup a JavaScript animation that injects `$animateCss` to trigger
 * the CSS animation.
 *
 * The example below shows how we can create a folding animation on an element using `ng-if`:
 *
 * ```html
 * <!-- notice the `fold-animation` CSS class -->
 * <div ng-if="onOff" class="fold-animation">
 *   This element will go BOOM
 * </div>
 * <button ng-click="onOff=true">Fold In</button>
 * ```
 *
 * Now we create the **JavaScript animation** that will trigger the CSS transition:
 *
 * ```js
 * ngModule.animation('.fold-animation', ['$animateCss', function($animateCss) {
 *   return {
 *     enter: function(element, doneFn) {
 *       var height = element[0].offsetHeight;
 *       return $animateCss(element, {
 *         from: { height:'0px' ***REMOVED***,
 *         to: { height:height + 'px' ***REMOVED***,
 *         duration: 1 // one second
 *   ***REMOVED***);
 * ***REMOVED***
 *   ***REMOVED***
 * ***REMOVED***]);
 * ```
 *
 * ## More Advanced Uses
 *
 * `$animateCss` is the underlying code that ngAnimate uses to power **CSS-based animations** behind the scenes. Therefore CSS hooks
 * like `.ng-EVENT`, `.ng-EVENT-active`, `.ng-EVENT-stagger` are all features that can be triggered using `$animateCss` via JavaScript code.
 *
 * This also means that just about any combination of adding classes, removing classes, setting styles, dynamically setting a keyframe animation,
 * applying a hardcoded duration or delay value, changing the animation easing or applying a stagger animation are all options that work with
 * `$animateCss`. The service itself is smart enough to figure out the combination of options and examine the element styling properties in order
 * to provide a working animation that will run in CSS.
 *
 * The example below showcases a more advanced version of the `.fold-animation` from the example above:
 *
 * ```js
 * ngModule.animation('.fold-animation', ['$animateCss', function($animateCss) {
 *   return {
 *     enter: function(element, doneFn) {
 *       var height = element[0].offsetHeight;
 *       return $animateCss(element, {
 *         addClass: 'red large-text pulse-twice',
 *         easing: 'ease-out',
 *         from: { height:'0px' ***REMOVED***,
 *         to: { height:height + 'px' ***REMOVED***,
 *         duration: 1 // one second
 *   ***REMOVED***);
 * ***REMOVED***
 *   ***REMOVED***
 * ***REMOVED***]);
 * ```
 *
 * Since we're adding/removing CSS classes then the CSS transition will also pick those up:
 *
 * ```css
 * /&#42; since a hardcoded duration value of 1 was provided in the JavaScript animation code,
 * the CSS classes below will be transitioned despite them being defined as regular CSS classes &#42;/
 * .red { background:red; ***REMOVED***
 * .large-text { font-size:20px; ***REMOVED***
 *
 * /&#42; we can also use a keyframe animation and $animateCss will make it work alongside the transition &#42;/
 * .pulse-twice {
 *   animation: 0.5s pulse linear 2;
 *   -webkit-animation: 0.5s pulse linear 2;
 * ***REMOVED***
 *
 * @keyframes pulse {
 *   from { transform: scale(0.5); ***REMOVED***
 *   to { transform: scale(1.5); ***REMOVED***
 * ***REMOVED***
 *
 * @-webkit-keyframes pulse {
 *   from { -webkit-transform: scale(0.5); ***REMOVED***
 *   to { -webkit-transform: scale(1.5); ***REMOVED***
 * ***REMOVED***
 * ```
 *
 * Given this complex combination of CSS classes, styles and options, `$animateCss` will figure everything out and make the animation happen.
 *
 * ## How the Options are handled
 *
 * `$animateCss` is very versatile and intelligent when it comes to figuring out what configurations to apply to the element to ensure the animation
 * works with the options provided. Say for example we were adding a class that contained a keyframe value and we wanted to also animate some inline
 * styles using the `from` and `to` properties.
 *
 * ```js
 * var animator = $animateCss(element, {
 *   from: { background:'red' ***REMOVED***,
 *   to: { background:'blue' ***REMOVED***
 * ***REMOVED***);
 * animator.start();
 * ```
 *
 * ```css
 * .rotating-animation {
 *   animation:0.5s rotate linear;
 *   -webkit-animation:0.5s rotate linear;
 * ***REMOVED***
 *
 * @keyframes rotate {
 *   from { transform: rotate(0deg); ***REMOVED***
 *   to { transform: rotate(360deg); ***REMOVED***
 * ***REMOVED***
 *
 * @-webkit-keyframes rotate {
 *   from { -webkit-transform: rotate(0deg); ***REMOVED***
 *   to { -webkit-transform: rotate(360deg); ***REMOVED***
 * ***REMOVED***
 * ```
 *
 * The missing pieces here are that we do not have a transition set (within the CSS code nor within the `$animateCss` options) and the duration of the animation is
 * going to be detected from what the keyframe styles on the CSS class are. In this event, `$animateCss` will automatically create an inline transition
 * style matching the duration detected from the keyframe style (which is present in the CSS class that is being added) and then prepare both the transition
 * and keyframe animations to run in parallel on the element. Then when the animation is underway the provided `from` and `to` CSS styles will be applied
 * and spread across the transition and keyframe animation.
 *
 * ## What is returned
 *
 * `$animateCss` works in two stages: a preparation phase and an animation phase. Therefore when `$animateCss` is first called it will NOT actually
 * start the animation. All that is going on here is that the element is being prepared for the animation (which means that the generated CSS classes are
 * added and removed on the element). Once `$animateCss` is called it will return an object with the following properties:
 *
 * ```js
 * var animator = $animateCss(element, { ... ***REMOVED***);
 * ```
 *
 * Now what do the contents of our `animator` variable look like:
 *
 * ```js
 * {
 *   // starts the animation
 *   start: Function,
 *
 *   // ends (aborts) the animation
 *   end: Function
 * ***REMOVED***
 * ```
 *
 * To actually start the animation we need to run `animation.start()` which will then return a promise that we can hook into to detect when the animation ends.
 * If we choose not to run the animation then we MUST run `animation.end()` to perform a cleanup on the element (since some CSS classes and styles may have been
 * applied to the element during the preparation phase). Note that all other properties such as duration, delay, transitions and keyframes are just properties
 * and that changing them will not reconfigure the parameters of the animation.
 *
 * ### runner.done() vs runner.then()
 * It is documented that `animation.start()` will return a promise object and this is true, however, there is also an additional method available on the
 * runner called `.done(callbackFn)`. The done method works the same as `.finally(callbackFn)`, however, it does **not trigger a digest to occur**.
 * Therefore, for performance reasons, it's always best to use `runner.done(callback)` instead of `runner.then()`, `runner.catch()` or `runner.finally()`
 * unless you really need a digest to kick off afterwards.
 *
 * Keep in mind that, to make this easier, ngAnimate has tweaked the JS animations API to recognize when a runner instance is returned from $animateCss
 * (so there is no need to call `runner.done(doneFn)` inside of your JavaScript animation code).
 * Check the {@link ngAnimate.$animateCss#usage animation code above***REMOVED*** to see how this works.
 *
 * @param {DOMElement***REMOVED*** element the element that will be animated
 * @param {object***REMOVED*** options the animation-related options that will be applied during the animation
 *
 * * `event` - The DOM event (e.g. enter, leave, move). When used, a generated CSS class of `ng-EVENT` and `ng-EVENT-active` will be applied
 * to the element during the animation. Multiple events can be provided when spaces are used as a separator. (Note that this will not perform any DOM operation.)
 * * `structural` - Indicates that the `ng-` prefix will be added to the event class. Setting to `false` or omitting will turn `ng-EVENT` and
 * `ng-EVENT-active` in `EVENT` and `EVENT-active`. Unused if `event` is omitted.
 * * `easing` - The CSS easing value that will be applied to the transition or keyframe animation (or both).
 * * `transitionStyle` - The raw CSS transition style that will be used (e.g. `1s linear all`).
 * * `keyframeStyle` - The raw CSS keyframe animation style that will be used (e.g. `1s my_animation linear`).
 * * `from` - The starting CSS styles (a key/value object) that will be applied at the start of the animation.
 * * `to` - The ending CSS styles (a key/value object) that will be applied across the animation via a CSS transition.
 * * `addClass` - A space separated list of CSS classes that will be added to the element and spread across the animation.
 * * `removeClass` - A space separated list of CSS classes that will be removed from the element and spread across the animation.
 * * `duration` - A number value representing the total duration of the transition and/or keyframe (note that a value of 1 is 1000ms). If a value of `0`
 * is provided then the animation will be skipped entirely.
 * * `delay` - A number value representing the total delay of the transition and/or keyframe (note that a value of 1 is 1000ms). If a value of `true` is
 * used then whatever delay value is detected from the CSS classes will be mirrored on the elements styles (e.g. by setting delay true then the style value
 * of the element will be `transition-delay: DETECTED_VALUE`). Using `true` is useful when you want the CSS classes and inline styles to all share the same
 * CSS delay value.
 * * `stagger` - A numeric time value representing the delay between successively animated elements
 * ({@link ngAnimate#css-staggering-animations Click here to learn how CSS-based staggering works in ngAnimate.***REMOVED***)
 * * `staggerIndex` - The numeric index representing the stagger item (e.g. a value of 5 is equal to the sixth item in the stagger; therefore when a
 *   `stagger` option value of `0.1` is used then there will be a stagger delay of `600ms`)
 * * `applyClassesEarly` - Whether or not the classes being added or removed will be used when detecting the animation. This is set by `$animate` when enter/leave/move animations are fired to ensure that the CSS classes are resolved in time. (Note that this will prevent any transitions from occurring on the classes being added and removed.)
 * * `cleanupStyles` - Whether or not the provided `from` and `to` styles will be removed once
 *    the animation is closed. This is useful for when the styles are used purely for the sake of
 *    the animation and do not have a lasting visual effect on the element (e.g. a collapse and open animation).
 *    By default this value is set to `false`.
 *
 * @return {object***REMOVED*** an object with start and end methods and details about the animation.
 *
 * * `start` - The method to start the animation. This will return a `Promise` when called.
 * * `end` - This method will cancel the animation and remove all applied CSS classes and styles.
 */
var ONE_SECOND = 1000;
var BASE_TEN = 10;

var ELAPSED_TIME_MAX_DECIMAL_PLACES = 3;
var CLOSING_TIME_BUFFER = 1.5;

var DETECT_CSS_PROPERTIES = {
  transitionDuration:      TRANSITION_DURATION_PROP,
  transitionDelay:         TRANSITION_DELAY_PROP,
  transitionProperty:      TRANSITION_PROP + PROPERTY_KEY,
  animationDuration:       ANIMATION_DURATION_PROP,
  animationDelay:          ANIMATION_DELAY_PROP,
  animationIterationCount: ANIMATION_PROP + ANIMATION_ITERATION_COUNT_KEY
***REMOVED***;

var DETECT_STAGGER_CSS_PROPERTIES = {
  transitionDuration:      TRANSITION_DURATION_PROP,
  transitionDelay:         TRANSITION_DELAY_PROP,
  animationDuration:       ANIMATION_DURATION_PROP,
  animationDelay:          ANIMATION_DELAY_PROP
***REMOVED***;

function getCssKeyframeDurationStyle(duration) {
  return [ANIMATION_DURATION_PROP, duration + 's'];
***REMOVED***

function getCssDelayStyle(delay, isKeyframeAnimation) {
  var prop = isKeyframeAnimation ? ANIMATION_DELAY_PROP : TRANSITION_DELAY_PROP;
  return [prop, delay + 's'];
***REMOVED***

function computeCssStyles($window, element, properties) {
  var styles = Object.create(null);
  var detectedStyles = $window.getComputedStyle(element) || {***REMOVED***;
  forEach(properties, function(formalStyleName, actualStyleName) {
    var val = detectedStyles[formalStyleName];
    if (val) {
      var c = val.charAt(0);

  ***REMOVED*** only numerical-based values have a negative sign or digit as the first value
      if (c === '-' || c === '+' || c >= 0) {
        val = parseMaxTime(val);
  ***REMOVED***

  ***REMOVED*** by setting this to null in the event that the delay is not set or is set directly as 0
  ***REMOVED*** then we can still allow for negative values to be used later on and not mistake this
  ***REMOVED*** value for being greater than any other negative value.
      if (val === 0) {
        val = null;
  ***REMOVED***
      styles[actualStyleName] = val;
***REMOVED***
  ***REMOVED***);

  return styles;
***REMOVED***

function parseMaxTime(str) {
  var maxValue = 0;
  var values = str.split(/\s*,\s*/);
  forEach(values, function(value) {
***REMOVED*** it's always safe to consider only second values and omit `ms` values since
***REMOVED*** getComputedStyle will always handle the conversion for us
    if (value.charAt(value.length - 1) == 's') {
      value = value.substring(0, value.length - 1);
***REMOVED***
    value = parseFloat(value) || 0;
    maxValue = maxValue ? Math.max(value, maxValue) : value;
  ***REMOVED***);
  return maxValue;
***REMOVED***

function truthyTimingValue(val) {
  return val === 0 || val != null;
***REMOVED***

function getCssTransitionDurationStyle(duration, applyOnlyDuration) {
  var style = TRANSITION_PROP;
  var value = duration + 's';
  if (applyOnlyDuration) {
    style += DURATION_KEY;
  ***REMOVED*** ***REMOVED***
    value += ' linear all';
  ***REMOVED***
  return [style, value];
***REMOVED***

function createLocalCacheLookup() {
  var cache = Object.create(null);
  return {
    flush: function() {
      cache = Object.create(null);
***REMOVED***,

    count: function(key) {
      var entry = cache[key];
      return entry ? entry.total : 0;
***REMOVED***,

    get: function(key) {
      var entry = cache[key];
      return entry && entry.value;
***REMOVED***,

    put: function(key, value) {
      if (!cache[key]) {
        cache[key] = { total: 1, value: value ***REMOVED***;
  ***REMOVED*** ***REMOVED***
        cache[key].total++;
  ***REMOVED***
***REMOVED***
  ***REMOVED***;
***REMOVED***

// we do not reassign an already present style value since
// if we detect the style property value again we may be
// detecting styles that were added via the `from` styles.
// We make use of `isDefined` here since an empty string
// or null value (which is what getPropertyValue will return
// for a non-existing style) will still be marked as a valid
// value for the style (a falsy value implies that the style
// is to be removed at the end of the animation). If we had a simple
// "OR" statement then it would not be enough to catch that.
function registerRestorableStyles(backup, node, properties) {
  forEach(properties, function(prop) {
    backup[prop] = isDefined(backup[prop])
        ? backup[prop]
        : node.style.getPropertyValue(prop);
  ***REMOVED***);
***REMOVED***

var $AnimateCssProvider = ['$animateProvider', function($animateProvider) {
  var gcsLookup = createLocalCacheLookup();
  var gcsStaggerLookup = createLocalCacheLookup();

  this.$get = ['$window', '$$jqLite', '$$AnimateRunner', '$timeout',
               '$$forceReflow', '$sniffer', '$$rAFScheduler', '$$animateQueue',
       function($window,   $$jqLite,   $$AnimateRunner,   $timeout,
                $$forceReflow,   $sniffer,   $$rAFScheduler, $$animateQueue) {

    var applyAnimationClasses = applyAnimationClassesFactory($$jqLite);

    var parentCounter = 0;
    function gcsHashFn(node, extraClasses) {
      var KEY = "$$ngAnimateParentKey";
      var parentNode = node.parentNode;
      var parentID = parentNode[KEY] || (parentNode[KEY] = ++parentCounter);
      return parentID + '-' + node.getAttribute('class') + '-' + extraClasses;
***REMOVED***

    function computeCachedCssStyles(node, className, cacheKey, properties) {
      var timings = gcsLookup.get(cacheKey);

      if (!timings) {
        timings = computeCssStyles($window, node, properties);
        if (timings.animationIterationCount === 'infinite') {
          timings.animationIterationCount = 1;
    ***REMOVED***
  ***REMOVED***

  ***REMOVED*** we keep putting this in multiple times even though the value and the cacheKey are the same
  ***REMOVED*** because we're keeping an internal tally of how many duplicate animations are detected.
      gcsLookup.put(cacheKey, timings);
      return timings;
***REMOVED***

    function computeCachedCssStaggerStyles(node, className, cacheKey, properties) {
      var stagger;

  ***REMOVED*** if we have one or more existing matches of matching elements
  ***REMOVED*** containing the same parent + CSS styles (which is how cacheKey works)
  ***REMOVED*** then staggering is possible
      if (gcsLookup.count(cacheKey) > 0) {
        stagger = gcsStaggerLookup.get(cacheKey);

        if (!stagger) {
          var staggerClassName = pendClasses(className, '-stagger');

          $$jqLite.addClass(node, staggerClassName);

          stagger = computeCssStyles($window, node, properties);

      ***REMOVED*** force the conversion of a null value to zero incase not set
          stagger.animationDuration = Math.max(stagger.animationDuration, 0);
          stagger.transitionDuration = Math.max(stagger.transitionDuration, 0);

          $$jqLite.removeClass(node, staggerClassName);

          gcsStaggerLookup.put(cacheKey, stagger);
    ***REMOVED***
  ***REMOVED***

      return stagger || {***REMOVED***;
***REMOVED***

    var cancelLastRAFRequest;
    var rafWaitQueue = [];
    function waitUntilQuiet(callback) {
      rafWaitQueue.push(callback);
      $$rAFScheduler.waitUntilQuiet(function() {
        gcsLookup.flush();
        gcsStaggerLookup.flush();

    ***REMOVED*** DO NOT REMOVE THIS LINE OR REFACTOR OUT THE `pageWidth` variable.
    ***REMOVED*** PLEASE EXAMINE THE `$$forceReflow` service to understand why.
        var pageWidth = $$forceReflow();

    ***REMOVED*** we use a for loop to ensure that if the queue is changed
    ***REMOVED*** during this looping then it will consider new requests
        for (var i = 0; i < rafWaitQueue.length; i++) {
          rafWaitQueue[i](pageWidth);
    ***REMOVED***
        rafWaitQueue.length = 0;
  ***REMOVED***);
***REMOVED***

    function computeTimings(node, className, cacheKey) {
      var timings = computeCachedCssStyles(node, className, cacheKey, DETECT_CSS_PROPERTIES);
      var aD = timings.animationDelay;
      var tD = timings.transitionDelay;
      timings.maxDelay = aD && tD
          ? Math.max(aD, tD)
          : (aD || tD);
      timings.maxDuration = Math.max(
          timings.animationDuration * timings.animationIterationCount,
          timings.transitionDuration);

      return timings;
***REMOVED***

    return function init(element, initialOptions) {
  ***REMOVED*** all of the animation functions should create
  ***REMOVED*** a copy of the options data, however, if a
  ***REMOVED*** parent service has already created a copy then
  ***REMOVED*** we should stick to using that
      var options = initialOptions || {***REMOVED***;
      if (!options.$$prepared) {
        options = prepareAnimationOptions(copy(options));
  ***REMOVED***

      var restoreStyles = {***REMOVED***;
      var node = getDomNode(element);
      if (!node
          || !node.parentNode
          || !$$animateQueue.enabled()) {
        return closeAndReturnNoopAnimator();
  ***REMOVED***

      var temporaryStyles = [];
      var classes = element.attr('class');
      var styles = packageStyles(options);
      var animationClosed;
      var animationPaused;
      var animationCompleted;
      var runner;
      var runnerHost;
      var maxDelay;
      var maxDelayTime;
      var maxDuration;
      var maxDurationTime;
      var startTime;
      var events = [];

      if (options.duration === 0 || (!$sniffer.animations && !$sniffer.transitions)) {
        return closeAndReturnNoopAnimator();
  ***REMOVED***

      var method = options.event && isArray(options.event)
            ? options.event.join(' ')
            : options.event;

      var isStructural = method && options.structural;
      var structuralClassName = '';
      var addRemoveClassName = '';

      if (isStructural) {
        structuralClassName = pendClasses(method, EVENT_CLASS_PREFIX, true);
  ***REMOVED*** else if (method) {
        structuralClassName = method;
  ***REMOVED***

      if (options.addClass) {
        addRemoveClassName += pendClasses(options.addClass, ADD_CLASS_SUFFIX);
  ***REMOVED***

      if (options.removeClass) {
        if (addRemoveClassName.length) {
          addRemoveClassName += ' ';
    ***REMOVED***
        addRemoveClassName += pendClasses(options.removeClass, REMOVE_CLASS_SUFFIX);
  ***REMOVED***

  ***REMOVED*** there may be a situation where a structural animation is combined together
  ***REMOVED*** with CSS classes that need to resolve before the animation is computed.
  ***REMOVED*** However this means that there is no explicit CSS code to block the animation
  ***REMOVED*** from happening (by setting 0s none in the class name). If this is the case
  ***REMOVED*** we need to apply the classes before the first rAF so we know to continue if
  ***REMOVED*** there actually is a detected transition or keyframe animation
      if (options.applyClassesEarly && addRemoveClassName.length) {
        applyAnimationClasses(element, options);
  ***REMOVED***

      var preparationClasses = [structuralClassName, addRemoveClassName].join(' ').trim();
      var fullClassName = classes + ' ' + preparationClasses;
      var activeClasses = pendClasses(preparationClasses, ACTIVE_CLASS_SUFFIX);
      var hasToStyles = styles.to && Object.keys(styles.to).length > 0;
      var containsKeyframeAnimation = (options.keyframeStyle || '').length > 0;

  ***REMOVED*** there is no way we can trigger an animation if no styles and
  ***REMOVED*** no classes are being applied which would then trigger a transition,
  ***REMOVED*** unless there a is raw keyframe value that is applied to the element.
      if (!containsKeyframeAnimation
           && !hasToStyles
           && !preparationClasses) {
        return closeAndReturnNoopAnimator();
  ***REMOVED***

      var cacheKey, stagger;
      if (options.stagger > 0) {
        var staggerVal = parseFloat(options.stagger);
        stagger = {
          transitionDelay: staggerVal,
          animationDelay: staggerVal,
          transitionDuration: 0,
          animationDuration: 0
    ***REMOVED***;
  ***REMOVED*** ***REMOVED***
        cacheKey = gcsHashFn(node, fullClassName);
        stagger = computeCachedCssStaggerStyles(node, preparationClasses, cacheKey, DETECT_STAGGER_CSS_PROPERTIES);
  ***REMOVED***

      if (!options.$$skipPreparationClasses) {
        $$jqLite.addClass(element, preparationClasses);
  ***REMOVED***

      var applyOnlyDuration;

      if (options.transitionStyle) {
        var transitionStyle = [TRANSITION_PROP, options.transitionStyle];
        applyInlineStyle(node, transitionStyle);
        temporaryStyles.push(transitionStyle);
  ***REMOVED***

      if (options.duration >= 0) {
        applyOnlyDuration = node.style[TRANSITION_PROP].length > 0;
        var durationStyle = getCssTransitionDurationStyle(options.duration, applyOnlyDuration);

    ***REMOVED*** we set the duration so that it will be picked up by getComputedStyle later
        applyInlineStyle(node, durationStyle);
        temporaryStyles.push(durationStyle);
  ***REMOVED***

      if (options.keyframeStyle) {
        var keyframeStyle = [ANIMATION_PROP, options.keyframeStyle];
        applyInlineStyle(node, keyframeStyle);
        temporaryStyles.push(keyframeStyle);
  ***REMOVED***

      var itemIndex = stagger
          ? options.staggerIndex >= 0
              ? options.staggerIndex
              : gcsLookup.count(cacheKey)
          : 0;

      var isFirst = itemIndex === 0;

  ***REMOVED*** this is a pre-emptive way of forcing the setup classes to be added and applied INSTANTLY
  ***REMOVED*** without causing any combination of transitions to kick in. By adding a negative delay value
  ***REMOVED*** it forces the setup class' transition to end immediately. We later then remove the negative
  ***REMOVED*** transition delay to allow for the transition to naturally do it's thing. The beauty here is
  ***REMOVED*** that if there is no transition defined then nothing will happen and this will also allow
  ***REMOVED*** other transitions to be stacked on top of each other without any chopping them out.
      if (isFirst && !options.skipBlocking) {
        blockTransitions(node, SAFE_FAST_FORWARD_DURATION_VALUE);
  ***REMOVED***

      var timings = computeTimings(node, fullClassName, cacheKey);
      var relativeDelay = timings.maxDelay;
      maxDelay = Math.max(relativeDelay, 0);
      maxDuration = timings.maxDuration;

      var flags = {***REMOVED***;
      flags.hasTransitions          = timings.transitionDuration > 0;
      flags.hasAnimations           = timings.animationDuration > 0;
      flags.hasTransitionAll        = flags.hasTransitions && timings.transitionProperty == 'all';
      flags.applyTransitionDuration = hasToStyles && (
                                        (flags.hasTransitions && !flags.hasTransitionAll)
                                         || (flags.hasAnimations && !flags.hasTransitions));
      flags.applyAnimationDuration  = options.duration && flags.hasAnimations;
      flags.applyTransitionDelay    = truthyTimingValue(options.delay) && (flags.applyTransitionDuration || flags.hasTransitions);
      flags.applyAnimationDelay     = truthyTimingValue(options.delay) && flags.hasAnimations;
      flags.recalculateTimingStyles = addRemoveClassName.length > 0;

      if (flags.applyTransitionDuration || flags.applyAnimationDuration) {
        maxDuration = options.duration ? parseFloat(options.duration) : maxDuration;

        if (flags.applyTransitionDuration) {
          flags.hasTransitions = true;
          timings.transitionDuration = maxDuration;
          applyOnlyDuration = node.style[TRANSITION_PROP + PROPERTY_KEY].length > 0;
          temporaryStyles.push(getCssTransitionDurationStyle(maxDuration, applyOnlyDuration));
    ***REMOVED***

        if (flags.applyAnimationDuration) {
          flags.hasAnimations = true;
          timings.animationDuration = maxDuration;
          temporaryStyles.push(getCssKeyframeDurationStyle(maxDuration));
    ***REMOVED***
  ***REMOVED***

      if (maxDuration === 0 && !flags.recalculateTimingStyles) {
        return closeAndReturnNoopAnimator();
  ***REMOVED***

      if (options.delay != null) {
        var delayStyle;
        if (typeof options.delay !== "boolean") {
          delayStyle = parseFloat(options.delay);
      ***REMOVED*** number in options.delay means we have to recalculate the delay for the closing timeout
          maxDelay = Math.max(delayStyle, 0);
    ***REMOVED***

        if (flags.applyTransitionDelay) {
          temporaryStyles.push(getCssDelayStyle(delayStyle));
    ***REMOVED***

        if (flags.applyAnimationDelay) {
          temporaryStyles.push(getCssDelayStyle(delayStyle, true));
    ***REMOVED***
  ***REMOVED***

  ***REMOVED*** we need to recalculate the delay value since we used a pre-emptive negative
  ***REMOVED*** delay value and the delay value is required for the final event checking. This
  ***REMOVED*** property will ensure that this will happen after the RAF phase has passed.
      if (options.duration == null && timings.transitionDuration > 0) {
        flags.recalculateTimingStyles = flags.recalculateTimingStyles || isFirst;
  ***REMOVED***

      maxDelayTime = maxDelay * ONE_SECOND;
      maxDurationTime = maxDuration * ONE_SECOND;
      if (!options.skipBlocking) {
        flags.blockTransition = timings.transitionDuration > 0;
        flags.blockKeyframeAnimation = timings.animationDuration > 0 &&
                                       stagger.animationDelay > 0 &&
                                       stagger.animationDuration === 0;
  ***REMOVED***

      if (options.from) {
        if (options.cleanupStyles) {
          registerRestorableStyles(restoreStyles, node, Object.keys(options.from));
    ***REMOVED***
        applyAnimationFromStyles(element, options);
  ***REMOVED***

      if (flags.blockTransition || flags.blockKeyframeAnimation) {
        applyBlocking(maxDuration);
  ***REMOVED*** else if (!options.skipBlocking) {
        blockTransitions(node, false);
  ***REMOVED***

  ***REMOVED*** TODO(matsko): for 1.5 change this code to have an animator object for better debugging
      return {
        $$willAnimate: true,
        end: endFn,
        start: function() {
          if (animationClosed) return;

          runnerHost = {
            end: endFn,
            cancel: cancelFn,
            resume: null, //this will be set during the start() phase
            pause: null
      ***REMOVED***;

          runner = new $$AnimateRunner(runnerHost);

          waitUntilQuiet(start);

      ***REMOVED*** we don't have access to pause/resume the animation
      ***REMOVED*** since it hasn't run yet. AnimateRunner will therefore
      ***REMOVED*** set noop functions for resume and pause and they will
      ***REMOVED*** later be overridden once the animation is triggered
          return runner;
    ***REMOVED***
  ***REMOVED***;

      function endFn() {
        close();
  ***REMOVED***

      function cancelFn() {
        close(true);
  ***REMOVED***

      function close(rejected) { // jshint ignore:line
    ***REMOVED*** if the promise has been called already then we shouldn't close
    ***REMOVED*** the animation again
        if (animationClosed || (animationCompleted && animationPaused)) return;
        animationClosed = true;
        animationPaused = false;

        if (!options.$$skipPreparationClasses) {
          $$jqLite.removeClass(element, preparationClasses);
    ***REMOVED***
        $$jqLite.removeClass(element, activeClasses);

        blockKeyframeAnimations(node, false);
        blockTransitions(node, false);

        forEach(temporaryStyles, function(entry) {
      ***REMOVED*** There is only one way to remove inline style properties entirely from elements.
      ***REMOVED*** By using `removeProperty` this works, but we need to convert camel-cased CSS
      ***REMOVED*** styles down to hyphenated values.
          node.style[entry[0]] = '';
    ***REMOVED***);

        applyAnimationClasses(element, options);
        applyAnimationStyles(element, options);

        if (Object.keys(restoreStyles).length) {
          forEach(restoreStyles, function(value, prop) {
            value ? node.style.setProperty(prop, value)
                  : node.style.removeProperty(prop);
      ***REMOVED***);
    ***REMOVED***

    ***REMOVED*** the reason why we have this option is to allow a synchronous closing callback
    ***REMOVED*** that is fired as SOON as the animation ends (when the CSS is removed) or if
    ***REMOVED*** the animation never takes off at all. A good example is a leave animation since
    ***REMOVED*** the element must be removed just after the animation is over or else the element
    ***REMOVED*** will appear on screen for one animation frame causing an overbearing flicker.
        if (options.onDone) {
          options.onDone();
    ***REMOVED***

        if (events && events.length) {
      ***REMOVED*** Remove the transitionend / animationend listener(s)
          element.off(events.join(' '), onAnimationProgress);
    ***REMOVED***

    ***REMOVED***Cancel the fallback closing timeout and remove the timer data
        var animationTimerData = element.data(ANIMATE_TIMER_KEY);
        if (animationTimerData) {
          $timeout.cancel(animationTimerData[0].timer);
          element.removeData(ANIMATE_TIMER_KEY);
    ***REMOVED***

    ***REMOVED*** if the preparation function fails then the promise is not setup
        if (runner) {
          runner.complete(!rejected);
    ***REMOVED***
  ***REMOVED***

      function applyBlocking(duration) {
        if (flags.blockTransition) {
          blockTransitions(node, duration);
    ***REMOVED***

        if (flags.blockKeyframeAnimation) {
          blockKeyframeAnimations(node, !!duration);
    ***REMOVED***
  ***REMOVED***

      function closeAndReturnNoopAnimator() {
        runner = new $$AnimateRunner({
          end: endFn,
          cancel: cancelFn
    ***REMOVED***);

    ***REMOVED*** should flush the cache animation
        waitUntilQuiet(noop);
        close();

        return {
          $$willAnimate: false,
          start: function() {
            return runner;
      ***REMOVED***,
          end: endFn
    ***REMOVED***;
  ***REMOVED***

      function onAnimationProgress(event) {
        event.stopPropagation();
        var ev = event.originalEvent || event;

    ***REMOVED*** we now always use `Date.now()` due to the recent changes with
    ***REMOVED*** event.timeStamp in Firefox, Webkit and Chrome (see #13494 for more info)
        var timeStamp = ev.$manualTimeStamp || Date.now();

        /* Firefox (or possibly just Gecko) likes to not round values up
         * when a ms measurement is used for the animation */
        var elapsedTime = parseFloat(ev.elapsedTime.toFixed(ELAPSED_TIME_MAX_DECIMAL_PLACES));

        /* $manualTimeStamp is a mocked timeStamp value which is set
         * within browserTrigger(). This is only here so that tests can
         * mock animations properly. Real events fallback to event.timeStamp,
         * or, if they don't, then a timeStamp is automatically created for them.
         * We're checking to see if the timeStamp surpasses the expected delay,
         * but we're using elapsedTime instead of the timeStamp on the 2nd
         * pre-condition since animationPauseds sometimes close off early */
        if (Math.max(timeStamp - startTime, 0) >= maxDelayTime && elapsedTime >= maxDuration) {
      ***REMOVED*** we set this flag to ensure that if the transition is paused then, when resumed,
      ***REMOVED*** the animation will automatically close itself since transitions cannot be paused.
          animationCompleted = true;
          close();
    ***REMOVED***
  ***REMOVED***

      function start() {
        if (animationClosed) return;
        if (!node.parentNode) {
          close();
          return;
    ***REMOVED***

    ***REMOVED*** even though we only pause keyframe animations here the pause flag
    ***REMOVED*** will still happen when transitions are used. Only the transition will
    ***REMOVED*** not be paused since that is not possible. If the animation ends when
    ***REMOVED*** paused then it will not complete until unpaused or cancelled.
        var playPause = function(playAnimation) {
          if (!animationCompleted) {
            animationPaused = !playAnimation;
            if (timings.animationDuration) {
              var value = blockKeyframeAnimations(node, animationPaused);
              animationPaused
                  ? temporaryStyles.push(value)
                  : removeFromArray(temporaryStyles, value);
        ***REMOVED***
      ***REMOVED*** else if (animationPaused && playAnimation) {
            animationPaused = false;
            close();
      ***REMOVED***
    ***REMOVED***;

    ***REMOVED*** checking the stagger duration prevents an accidentally cascade of the CSS delay style
    ***REMOVED*** being inherited from the parent. If the transition duration is zero then we can safely
    ***REMOVED*** rely that the delay value is an intentional stagger delay style.
        var maxStagger = itemIndex > 0
                         && ((timings.transitionDuration && stagger.transitionDuration === 0) ||
                            (timings.animationDuration && stagger.animationDuration === 0))
                         && Math.max(stagger.animationDelay, stagger.transitionDelay);
        if (maxStagger) {
          $timeout(triggerAnimationStart,
                   Math.floor(maxStagger * itemIndex * ONE_SECOND),
                   false);
    ***REMOVED*** ***REMOVED***
          triggerAnimationStart();
    ***REMOVED***

    ***REMOVED*** this will decorate the existing promise runner with pause/resume methods
        runnerHost.resume = function() {
          playPause(true);
    ***REMOVED***;

        runnerHost.pause = function() {
          playPause(false);
    ***REMOVED***;

        function triggerAnimationStart() {
      ***REMOVED*** just incase a stagger animation kicks in when the animation
      ***REMOVED*** itself was cancelled entirely
          if (animationClosed) return;

          applyBlocking(false);

          forEach(temporaryStyles, function(entry) {
            var key = entry[0];
            var value = entry[1];
            node.style[key] = value;
      ***REMOVED***);

          applyAnimationClasses(element, options);
          $$jqLite.addClass(element, activeClasses);

          if (flags.recalculateTimingStyles) {
            fullClassName = node.className + ' ' + preparationClasses;
            cacheKey = gcsHashFn(node, fullClassName);

            timings = computeTimings(node, fullClassName, cacheKey);
            relativeDelay = timings.maxDelay;
            maxDelay = Math.max(relativeDelay, 0);
            maxDuration = timings.maxDuration;

            if (maxDuration === 0) {
              close();
              return;
        ***REMOVED***

            flags.hasTransitions = timings.transitionDuration > 0;
            flags.hasAnimations = timings.animationDuration > 0;
      ***REMOVED***

          if (flags.applyAnimationDelay) {
            relativeDelay = typeof options.delay !== "boolean" && truthyTimingValue(options.delay)
                  ? parseFloat(options.delay)
                  : relativeDelay;

            maxDelay = Math.max(relativeDelay, 0);
            timings.animationDelay = relativeDelay;
            delayStyle = getCssDelayStyle(relativeDelay, true);
            temporaryStyles.push(delayStyle);
            node.style[delayStyle[0]] = delayStyle[1];
      ***REMOVED***

          maxDelayTime = maxDelay * ONE_SECOND;
          maxDurationTime = maxDuration * ONE_SECOND;

          if (options.easing) {
            var easeProp, easeVal = options.easing;
            if (flags.hasTransitions) {
              easeProp = TRANSITION_PROP + TIMING_KEY;
              temporaryStyles.push([easeProp, easeVal]);
              node.style[easeProp] = easeVal;
        ***REMOVED***
            if (flags.hasAnimations) {
              easeProp = ANIMATION_PROP + TIMING_KEY;
              temporaryStyles.push([easeProp, easeVal]);
              node.style[easeProp] = easeVal;
        ***REMOVED***
      ***REMOVED***

          if (timings.transitionDuration) {
            events.push(TRANSITIONEND_EVENT);
      ***REMOVED***

          if (timings.animationDuration) {
            events.push(ANIMATIONEND_EVENT);
      ***REMOVED***

          startTime = Date.now();
          var timerTime = maxDelayTime + CLOSING_TIME_BUFFER * maxDurationTime;
          var endTime = startTime + timerTime;

          var animationsData = element.data(ANIMATE_TIMER_KEY) || [];
          var setupFallbackTimer = true;
          if (animationsData.length) {
            var currentTimerData = animationsData[0];
            setupFallbackTimer = endTime > currentTimerData.expectedEndTime;
            if (setupFallbackTimer) {
              $timeout.cancel(currentTimerData.timer);
        ***REMOVED*** ***REMOVED***
              animationsData.push(close);
        ***REMOVED***
      ***REMOVED***

          if (setupFallbackTimer) {
            var timer = $timeout(onAnimationExpired, timerTime, false);
            animationsData[0] = {
              timer: timer,
              expectedEndTime: endTime
        ***REMOVED***;
            animationsData.push(close);
            element.data(ANIMATE_TIMER_KEY, animationsData);
      ***REMOVED***

          if (events.length) {
            element.on(events.join(' '), onAnimationProgress);
      ***REMOVED***

          if (options.to) {
            if (options.cleanupStyles) {
              registerRestorableStyles(restoreStyles, node, Object.keys(options.to));
        ***REMOVED***
            applyAnimationToStyles(element, options);
      ***REMOVED***
    ***REMOVED***

        function onAnimationExpired() {
          var animationsData = element.data(ANIMATE_TIMER_KEY);

      ***REMOVED*** this will be false in the event that the element was
      ***REMOVED*** removed from the DOM (via a leave animation or something
      ***REMOVED*** similar)
          if (animationsData) {
            for (var i = 1; i < animationsData.length; i++) {
              animationsData[i]();
        ***REMOVED***
            element.removeData(ANIMATE_TIMER_KEY);
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED***;
  ***REMOVED***];
***REMOVED***];

var $$AnimateCssDriverProvider = ['$$animationProvider', function($$animationProvider) {
  $$animationProvider.drivers.push('$$animateCssDriver');

  var NG_ANIMATE_SHIM_CLASS_NAME = 'ng-animate-shim';
  var NG_ANIMATE_ANCHOR_CLASS_NAME = 'ng-anchor';

  var NG_OUT_ANCHOR_CLASS_NAME = 'ng-anchor-out';
  var NG_IN_ANCHOR_CLASS_NAME = 'ng-anchor-in';

  function isDocumentFragment(node) {
    return node.parentNode && node.parentNode.nodeType === 11;
  ***REMOVED***

  this.$get = ['$animateCss', '$rootScope', '$$AnimateRunner', '$rootElement', '$sniffer', '$$jqLite', '$document',
       function($animateCss,   $rootScope,   $$AnimateRunner,   $rootElement,   $sniffer,   $$jqLite,   $document) {

***REMOVED*** only browsers that support these properties can render animations
    if (!$sniffer.animations && !$sniffer.transitions) return noop;

    var bodyNode = $document[0].body;
    var rootNode = getDomNode($rootElement);

    var rootBodyElement = jqLite(
  ***REMOVED*** this is to avoid using something that exists outside of the body
  ***REMOVED*** we also special case the doc fragment case because our unit test code
  ***REMOVED*** appends the $rootElement to the body after the app has been bootstrapped
      isDocumentFragment(rootNode) || bodyNode.contains(rootNode) ? rootNode : bodyNode
    );

    var applyAnimationClasses = applyAnimationClassesFactory($$jqLite);

    return function initDriverFn(animationDetails) {
      return animationDetails.from && animationDetails.to
          ? prepareFromToAnchorAnimation(animationDetails.from,
                                         animationDetails.to,
                                         animationDetails.classes,
                                         animationDetails.anchors)
          : prepareRegularAnimation(animationDetails);
***REMOVED***;

    function filterCssClasses(classes) {
  ***REMOVED***remove all the `ng-` stuff
      return classes.replace(/\bng-\S+\b/g, '');
***REMOVED***

    function getUniqueValues(a, b) {
      if (isString(a)) a = a.split(' ');
      if (isString(b)) b = b.split(' ');
      return a.filter(function(val) {
        return b.indexOf(val) === -1;
  ***REMOVED***).join(' ');
***REMOVED***

    function prepareAnchoredAnimation(classes, outAnchor, inAnchor) {
      var clone = jqLite(getDomNode(outAnchor).cloneNode(true));
      var startingClasses = filterCssClasses(getClassVal(clone));

      outAnchor.addClass(NG_ANIMATE_SHIM_CLASS_NAME);
      inAnchor.addClass(NG_ANIMATE_SHIM_CLASS_NAME);

      clone.addClass(NG_ANIMATE_ANCHOR_CLASS_NAME);

      rootBodyElement.append(clone);

      var animatorIn, animatorOut = prepareOutAnimation();

  ***REMOVED*** the user may not end up using the `out` animation and
  ***REMOVED*** only making use of the `in` animation or vice-versa.
  ***REMOVED*** In either case we should allow this and not assume the
  ***REMOVED*** animation is over unless both animations are not used.
      if (!animatorOut) {
        animatorIn = prepareInAnimation();
        if (!animatorIn) {
          return end();
    ***REMOVED***
  ***REMOVED***

      var startingAnimator = animatorOut || animatorIn;

      return {
        start: function() {
          var runner;

          var currentAnimation = startingAnimator.start();
          currentAnimation.done(function() {
            currentAnimation = null;
            if (!animatorIn) {
              animatorIn = prepareInAnimation();
              if (animatorIn) {
                currentAnimation = animatorIn.start();
                currentAnimation.done(function() {
                  currentAnimation = null;
                  end();
                  runner.complete();
            ***REMOVED***);
                return currentAnimation;
          ***REMOVED***
        ***REMOVED***
        ***REMOVED*** in the event that there is no `in` animation
            end();
            runner.complete();
      ***REMOVED***);

          runner = new $$AnimateRunner({
            end: endFn,
            cancel: endFn
      ***REMOVED***);

          return runner;

          function endFn() {
            if (currentAnimation) {
              currentAnimation.end();
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***;

      function calculateAnchorStyles(anchor) {
        var styles = {***REMOVED***;

        var coords = getDomNode(anchor).getBoundingClientRect();

    ***REMOVED*** we iterate directly since safari messes up and doesn't return
    ***REMOVED*** all the keys for the coords object when iterated
        forEach(['width','height','top','left'], function(key) {
          var value = coords[key];
          switch (key) {
            case 'top':
              value += bodyNode.scrollTop;
              break;
            case 'left':
              value += bodyNode.scrollLeft;
              break;
      ***REMOVED***
          styles[key] = Math.floor(value) + 'px';
    ***REMOVED***);
        return styles;
  ***REMOVED***

      function prepareOutAnimation() {
        var animator = $animateCss(clone, {
          addClass: NG_OUT_ANCHOR_CLASS_NAME,
          delay: true,
          from: calculateAnchorStyles(outAnchor)
    ***REMOVED***);

    ***REMOVED*** read the comment within `prepareRegularAnimation` to understand
    ***REMOVED*** why this check is necessary
        return animator.$$willAnimate ? animator : null;
  ***REMOVED***

      function getClassVal(element) {
        return element.attr('class') || '';
  ***REMOVED***

      function prepareInAnimation() {
        var endingClasses = filterCssClasses(getClassVal(inAnchor));
        var toAdd = getUniqueValues(endingClasses, startingClasses);
        var toRemove = getUniqueValues(startingClasses, endingClasses);

        var animator = $animateCss(clone, {
          to: calculateAnchorStyles(inAnchor),
          addClass: NG_IN_ANCHOR_CLASS_NAME + ' ' + toAdd,
          removeClass: NG_OUT_ANCHOR_CLASS_NAME + ' ' + toRemove,
          delay: true
    ***REMOVED***);

    ***REMOVED*** read the comment within `prepareRegularAnimation` to understand
    ***REMOVED*** why this check is necessary
        return animator.$$willAnimate ? animator : null;
  ***REMOVED***

      function end() {
        clone.remove();
        outAnchor.removeClass(NG_ANIMATE_SHIM_CLASS_NAME);
        inAnchor.removeClass(NG_ANIMATE_SHIM_CLASS_NAME);
  ***REMOVED***
***REMOVED***

    function prepareFromToAnchorAnimation(from, to, classes, anchors) {
      var fromAnimation = prepareRegularAnimation(from, noop);
      var toAnimation = prepareRegularAnimation(to, noop);

      var anchorAnimations = [];
      forEach(anchors, function(anchor) {
        var outElement = anchor['out'];
        var inElement = anchor['in'];
        var animator = prepareAnchoredAnimation(classes, outElement, inElement);
        if (animator) {
          anchorAnimations.push(animator);
    ***REMOVED***
  ***REMOVED***);

  ***REMOVED*** no point in doing anything when there are no elements to animate
      if (!fromAnimation && !toAnimation && anchorAnimations.length === 0) return;

      return {
        start: function() {
          var animationRunners = [];

          if (fromAnimation) {
            animationRunners.push(fromAnimation.start());
      ***REMOVED***

          if (toAnimation) {
            animationRunners.push(toAnimation.start());
      ***REMOVED***

          forEach(anchorAnimations, function(animation) {
            animationRunners.push(animation.start());
      ***REMOVED***);

          var runner = new $$AnimateRunner({
            end: endFn,
            cancel: endFn // CSS-driven animations cannot be cancelled, only ended
      ***REMOVED***);

          $$AnimateRunner.all(animationRunners, function(status) {
            runner.complete(status);
      ***REMOVED***);

          return runner;

          function endFn() {
            forEach(animationRunners, function(runner) {
              runner.end();
        ***REMOVED***);
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***;
***REMOVED***

    function prepareRegularAnimation(animationDetails) {
      var element = animationDetails.element;
      var options = animationDetails.options || {***REMOVED***;

      if (animationDetails.structural) {
        options.event = animationDetails.event;
        options.structural = true;
        options.applyClassesEarly = true;

    ***REMOVED*** we special case the leave animation since we want to ensure that
    ***REMOVED*** the element is removed as soon as the animation is over. Otherwise
    ***REMOVED*** a flicker might appear or the element may not be removed at all
        if (animationDetails.event === 'leave') {
          options.onDone = options.domOperation;
    ***REMOVED***
  ***REMOVED***

  ***REMOVED*** We assign the preparationClasses as the actual animation event since
  ***REMOVED*** the internals of $animateCss will just suffix the event token values
  ***REMOVED*** with `-active` to trigger the animation.
      if (options.preparationClasses) {
        options.event = concatWithSpace(options.event, options.preparationClasses);
  ***REMOVED***

      var animator = $animateCss(element, options);

  ***REMOVED*** the driver lookup code inside of $$animation attempts to spawn a
  ***REMOVED*** driver one by one until a driver returns a.$$willAnimate animator object.
  ***REMOVED*** $animateCss will always return an object, however, it will pass in
  ***REMOVED*** a flag as a hint as to whether an animation was detected or not
      return animator.$$willAnimate ? animator : null;
***REMOVED***
  ***REMOVED***];
***REMOVED***];

// TODO(matsko): use caching here to speed things up for detection
// TODO(matsko): add documentation
//  by the time...

var $$AnimateJsProvider = ['$animateProvider', function($animateProvider) {
  this.$get = ['$injector', '$$AnimateRunner', '$$jqLite',
       function($injector,   $$AnimateRunner,   $$jqLite) {

    var applyAnimationClasses = applyAnimationClassesFactory($$jqLite);
     ***REMOVED*** $animateJs(element, 'enter');
    return function(element, event, classes, options) {
      var animationClosed = false;

  ***REMOVED*** the `classes` argument is optional and if it is not used
  ***REMOVED*** then the classes will be resolved from the element's className
  ***REMOVED*** property as well as options.addClass/options.removeClass.
      if (arguments.length === 3 && isObject(classes)) {
        options = classes;
        classes = null;
  ***REMOVED***

      options = prepareAnimationOptions(options);
      if (!classes) {
        classes = element.attr('class') || '';
        if (options.addClass) {
          classes += ' ' + options.addClass;
    ***REMOVED***
        if (options.removeClass) {
          classes += ' ' + options.removeClass;
    ***REMOVED***
  ***REMOVED***

      var classesToAdd = options.addClass;
      var classesToRemove = options.removeClass;

  ***REMOVED*** the lookupAnimations function returns a series of animation objects that are
  ***REMOVED*** matched up with one or more of the CSS classes. These animation objects are
  ***REMOVED*** defined via the module.animation factory function. If nothing is detected then
  ***REMOVED*** we don't return anything which then makes $animation query the next driver.
      var animations = lookupAnimations(classes);
      var before, after;
      if (animations.length) {
        var afterFn, beforeFn;
        if (event == 'leave') {
          beforeFn = 'leave';
          afterFn = 'afterLeave'; // TODO(matsko): get rid of this
    ***REMOVED*** ***REMOVED***
          beforeFn = 'before' + event.charAt(0).toUpperCase() + event.substr(1);
          afterFn = event;
    ***REMOVED***

        if (event !== 'enter' && event !== 'move') {
          before = packageAnimations(element, event, options, animations, beforeFn);
    ***REMOVED***
        after  = packageAnimations(element, event, options, animations, afterFn);
  ***REMOVED***

  ***REMOVED*** no matching animations
      if (!before && !after) return;

      function applyOptions() {
        options.domOperation();
        applyAnimationClasses(element, options);
  ***REMOVED***

      function close() {
        animationClosed = true;
        applyOptions();
        applyAnimationStyles(element, options);
  ***REMOVED***

      var runner;

      return {
        $$willAnimate: true,
        end: function() {
          if (runner) {
            runner.end();
      ***REMOVED*** ***REMOVED***
            close();
            runner = new $$AnimateRunner();
            runner.complete(true);
      ***REMOVED***
          return runner;
    ***REMOVED***,
        start: function() {
          if (runner) {
            return runner;
      ***REMOVED***

          runner = new $$AnimateRunner();
          var closeActiveAnimations;
          var chain = [];

          if (before) {
            chain.push(function(fn) {
              closeActiveAnimations = before(fn);
        ***REMOVED***);
      ***REMOVED***

          if (chain.length) {
            chain.push(function(fn) {
              applyOptions();
              fn(true);
        ***REMOVED***);
      ***REMOVED*** ***REMOVED***
            applyOptions();
      ***REMOVED***

          if (after) {
            chain.push(function(fn) {
              closeActiveAnimations = after(fn);
        ***REMOVED***);
      ***REMOVED***

          runner.setHost({
            end: function() {
              endAnimations();
        ***REMOVED***,
            cancel: function() {
              endAnimations(true);
        ***REMOVED***
      ***REMOVED***);

          $$AnimateRunner.chain(chain, onComplete);
          return runner;

          function onComplete(success) {
            close(success);
            runner.complete(success);
      ***REMOVED***

          function endAnimations(cancelled) {
            if (!animationClosed) {
              (closeActiveAnimations || noop)(cancelled);
              onComplete(cancelled);
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***;

      function executeAnimationFn(fn, element, event, options, onDone) {
        var args;
        switch (event) {
          case 'animate':
            args = [element, options.from, options.to, onDone];
            break;

          case 'setClass':
            args = [element, classesToAdd, classesToRemove, onDone];
            break;

          case 'addClass':
            args = [element, classesToAdd, onDone];
            break;

          case 'removeClass':
            args = [element, classesToRemove, onDone];
            break;

          default:
            args = [element, onDone];
            break;
    ***REMOVED***

        args.push(options);

        var value = fn.apply(fn, args);
        if (value) {
          if (isFunction(value.start)) {
            value = value.start();
      ***REMOVED***

          if (value instanceof $$AnimateRunner) {
            value.done(onDone);
      ***REMOVED*** else if (isFunction(value)) {
        ***REMOVED*** optional onEnd / onCancel callback
            return value;
      ***REMOVED***
    ***REMOVED***

        return noop;
  ***REMOVED***

      function groupEventedAnimations(element, event, options, animations, fnName) {
        var operations = [];
        forEach(animations, function(ani) {
          var animation = ani[fnName];
          if (!animation) return;

      ***REMOVED*** note that all of these animations will run in parallel
          operations.push(function() {
            var runner;
            var endProgressCb;

            var resolved = false;
            var onAnimationComplete = function(rejected) {
              if (!resolved) {
                resolved = true;
                (endProgressCb || noop)(rejected);
                runner.complete(!rejected);
          ***REMOVED***
        ***REMOVED***;

            runner = new $$AnimateRunner({
              end: function() {
                onAnimationComplete();
          ***REMOVED***,
              cancel: function() {
                onAnimationComplete(true);
          ***REMOVED***
        ***REMOVED***);

            endProgressCb = executeAnimationFn(animation, element, event, options, function(result) {
              var cancelled = result === false;
              onAnimationComplete(cancelled);
        ***REMOVED***);

            return runner;
      ***REMOVED***);
    ***REMOVED***);

        return operations;
  ***REMOVED***

      function packageAnimations(element, event, options, animations, fnName) {
        var operations = groupEventedAnimations(element, event, options, animations, fnName);
        if (operations.length === 0) {
          var a,b;
          if (fnName === 'beforeSetClass') {
            a = groupEventedAnimations(element, 'removeClass', options, animations, 'beforeRemoveClass');
            b = groupEventedAnimations(element, 'addClass', options, animations, 'beforeAddClass');
      ***REMOVED*** else if (fnName === 'setClass') {
            a = groupEventedAnimations(element, 'removeClass', options, animations, 'removeClass');
            b = groupEventedAnimations(element, 'addClass', options, animations, 'addClass');
      ***REMOVED***

          if (a) {
            operations = operations.concat(a);
      ***REMOVED***
          if (b) {
            operations = operations.concat(b);
      ***REMOVED***
    ***REMOVED***

        if (operations.length === 0) return;

    ***REMOVED*** TODO(matsko): add documentation
        return function startAnimation(callback) {
          var runners = [];
          if (operations.length) {
            forEach(operations, function(animateFn) {
              runners.push(animateFn());
        ***REMOVED***);
      ***REMOVED***

          runners.length ? $$AnimateRunner.all(runners, callback) : callback();

          return function endFn(reject) {
            forEach(runners, function(runner) {
              reject ? runner.cancel() : runner.end();
        ***REMOVED***);
      ***REMOVED***;
    ***REMOVED***;
  ***REMOVED***
***REMOVED***;

    function lookupAnimations(classes) {
      classes = isArray(classes) ? classes : classes.split(' ');
      var matches = [], flagMap = {***REMOVED***;
      for (var i=0; i < classes.length; i++) {
        var klass = classes[i],
            animationFactory = $animateProvider.$$registeredAnimations[klass];
        if (animationFactory && !flagMap[klass]) {
          matches.push($injector.get(animationFactory));
          flagMap[klass] = true;
    ***REMOVED***
  ***REMOVED***
      return matches;
***REMOVED***
  ***REMOVED***];
***REMOVED***];

var $$AnimateJsDriverProvider = ['$$animationProvider', function($$animationProvider) {
  $$animationProvider.drivers.push('$$animateJsDriver');
  this.$get = ['$$animateJs', '$$AnimateRunner', function($$animateJs, $$AnimateRunner) {
    return function initDriverFn(animationDetails) {
      if (animationDetails.from && animationDetails.to) {
        var fromAnimation = prepareAnimation(animationDetails.from);
        var toAnimation = prepareAnimation(animationDetails.to);
        if (!fromAnimation && !toAnimation) return;

        return {
          start: function() {
            var animationRunners = [];

            if (fromAnimation) {
              animationRunners.push(fromAnimation.start());
        ***REMOVED***

            if (toAnimation) {
              animationRunners.push(toAnimation.start());
        ***REMOVED***

            $$AnimateRunner.all(animationRunners, done);

            var runner = new $$AnimateRunner({
              end: endFnFactory(),
              cancel: endFnFactory()
        ***REMOVED***);

            return runner;

            function endFnFactory() {
              return function() {
                forEach(animationRunners, function(runner) {
              ***REMOVED*** at this point we cannot cancel animations for groups just yet. 1.5+
                  runner.end();
            ***REMOVED***);
          ***REMOVED***;
        ***REMOVED***

            function done(status) {
              runner.complete(status);
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***;
  ***REMOVED*** ***REMOVED***
        return prepareAnimation(animationDetails);
  ***REMOVED***
***REMOVED***;

    function prepareAnimation(animationDetails) {
  ***REMOVED*** TODO(matsko): make sure to check for grouped animations and delegate down to normal animations
      var element = animationDetails.element;
      var event = animationDetails.event;
      var options = animationDetails.options;
      var classes = animationDetails.classes;
      return $$animateJs(element, event, classes, options);
***REMOVED***
  ***REMOVED***];
***REMOVED***];

var NG_ANIMATE_ATTR_NAME = 'data-ng-animate';
var NG_ANIMATE_PIN_DATA = '$ngAnimatePin';
var $$AnimateQueueProvider = ['$animateProvider', function($animateProvider) {
  var PRE_DIGEST_STATE = 1;
  var RUNNING_STATE = 2;
  var ONE_SPACE = ' ';

  var rules = this.rules = {
    skip: [],
    cancel: [],
    join: []
  ***REMOVED***;

  function makeTruthyCssClassMap(classString) {
    if (!classString) {
      return null;
***REMOVED***

    var keys = classString.split(ONE_SPACE);
    var map = Object.create(null);

    forEach(keys, function(key) {
      map[key] = true;
***REMOVED***);
    return map;
  ***REMOVED***

  function hasMatchingClasses(newClassString, currentClassString) {
    if (newClassString && currentClassString) {
      var currentClassMap = makeTruthyCssClassMap(currentClassString);
      return newClassString.split(ONE_SPACE).some(function(className) {
        return currentClassMap[className];
  ***REMOVED***);
***REMOVED***
  ***REMOVED***

  function isAllowed(ruleType, element, currentAnimation, previousAnimation) {
    return rules[ruleType].some(function(fn) {
      return fn(element, currentAnimation, previousAnimation);
***REMOVED***);
  ***REMOVED***

  function hasAnimationClasses(animation, and) {
    var a = (animation.addClass || '').length > 0;
    var b = (animation.removeClass || '').length > 0;
    return and ? a && b : a || b;
  ***REMOVED***

  rules.join.push(function(element, newAnimation, currentAnimation) {
***REMOVED*** if the new animation is class-based then we can just tack that on
    return !newAnimation.structural && hasAnimationClasses(newAnimation);
  ***REMOVED***);

  rules.skip.push(function(element, newAnimation, currentAnimation) {
***REMOVED*** there is no need to animate anything if no classes are being added and
***REMOVED*** there is no structural animation that will be triggered
    return !newAnimation.structural && !hasAnimationClasses(newAnimation);
  ***REMOVED***);

  rules.skip.push(function(element, newAnimation, currentAnimation) {
***REMOVED*** why should we trigger a new structural animation if the element will
***REMOVED*** be removed from the DOM anyway?
    return currentAnimation.event == 'leave' && newAnimation.structural;
  ***REMOVED***);

  rules.skip.push(function(element, newAnimation, currentAnimation) {
***REMOVED*** if there is an ongoing current animation then don't even bother running the class-based animation
    return currentAnimation.structural && currentAnimation.state === RUNNING_STATE && !newAnimation.structural;
  ***REMOVED***);

  rules.cancel.push(function(element, newAnimation, currentAnimation) {
***REMOVED*** there can never be two structural animations running at the same time
    return currentAnimation.structural && newAnimation.structural;
  ***REMOVED***);

  rules.cancel.push(function(element, newAnimation, currentAnimation) {
***REMOVED*** if the previous animation is already running, but the new animation will
***REMOVED*** be triggered, but the new animation is structural
    return currentAnimation.state === RUNNING_STATE && newAnimation.structural;
  ***REMOVED***);

  rules.cancel.push(function(element, newAnimation, currentAnimation) {
    var nA = newAnimation.addClass;
    var nR = newAnimation.removeClass;
    var cA = currentAnimation.addClass;
    var cR = currentAnimation.removeClass;

***REMOVED*** early detection to save the global CPU shortage :)
    if ((isUndefined(nA) && isUndefined(nR)) || (isUndefined(cA) && isUndefined(cR))) {
      return false;
***REMOVED***

    return hasMatchingClasses(nA, cR) || hasMatchingClasses(nR, cA);
  ***REMOVED***);

  this.$get = ['$$rAF', '$rootScope', '$rootElement', '$document', '$$HashMap',
               '$$animation', '$$AnimateRunner', '$templateRequest', '$$jqLite', '$$forceReflow',
       function($$rAF,   $rootScope,   $rootElement,   $document,   $$HashMap,
                $$animation,   $$AnimateRunner,   $templateRequest,   $$jqLite,   $$forceReflow) {

    var activeAnimationsLookup = new $$HashMap();
    var disabledElementsLookup = new $$HashMap();
    var animationsEnabled = null;

    function postDigestTaskFactory() {
      var postDigestCalled = false;
      return function(fn) {
    ***REMOVED*** we only issue a call to postDigest before
    ***REMOVED*** it has first passed. This prevents any callbacks
    ***REMOVED*** from not firing once the animation has completed
    ***REMOVED*** since it will be out of the digest cycle.
        if (postDigestCalled) {
          fn();
    ***REMOVED*** ***REMOVED***
          $rootScope.$$postDigest(function() {
            postDigestCalled = true;
            fn();
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***;
***REMOVED***

***REMOVED*** Wait until all directive and route-related templates are downloaded and
***REMOVED*** compiled. The $templateRequest.totalPendingRequests variable keeps track of
***REMOVED*** all of the remote templates being currently downloaded. If there are no
***REMOVED*** templates currently downloading then the watcher will still fire anyway.
    var deregisterWatch = $rootScope.$watch(
      function() { return $templateRequest.totalPendingRequests === 0; ***REMOVED***,
      function(isEmpty) {
        if (!isEmpty) return;
        deregisterWatch();

    ***REMOVED*** Now that all templates have been downloaded, $animate will wait until
    ***REMOVED*** the post digest queue is empty before enabling animations. By having two
    ***REMOVED*** calls to $postDigest calls we can ensure that the flag is enabled at the
    ***REMOVED*** very end of the post digest queue. Since all of the animations in $animate
    ***REMOVED*** use $postDigest, it's important that the code below executes at the end.
    ***REMOVED*** This basically means that the page is fully downloaded and compiled before
    ***REMOVED*** any animations are triggered.
        $rootScope.$$postDigest(function() {
          $rootScope.$$postDigest(function() {
        ***REMOVED*** we check for null directly in the event that the application already called
        ***REMOVED*** .enabled() with whatever arguments that it provided it with
            if (animationsEnabled === null) {
              animationsEnabled = true;
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED***);
  ***REMOVED***
    );

    var callbackRegistry = {***REMOVED***;

***REMOVED*** remember that the classNameFilter is set during the provider/config
***REMOVED*** stage therefore we can optimize here and setup a helper function
    var classNameFilter = $animateProvider.classNameFilter();
    var isAnimatableClassName = !classNameFilter
              ? function() { return true; ***REMOVED***
              : function(className) {
                return classNameFilter.test(className);
          ***REMOVED***;

    var applyAnimationClasses = applyAnimationClassesFactory($$jqLite);

    function normalizeAnimationDetails(element, animation) {
      return mergeAnimationDetails(element, animation, {***REMOVED***);
***REMOVED***

***REMOVED*** IE9-11 has no method "contains" in SVG element and in Node.prototype. Bug #10259.
    var contains = Node.prototype.contains || function(arg) {
  ***REMOVED*** jshint bitwise: false
      return this === arg || !!(this.compareDocumentPosition(arg) & 16);
  ***REMOVED*** jshint bitwise: true
***REMOVED***;

    function findCallbacks(parent, element, event) {
      var targetNode = getDomNode(element);
      var targetParentNode = getDomNode(parent);

      var matches = [];
      var entries = callbackRegistry[event];
      if (entries) {
        forEach(entries, function(entry) {
          if (contains.call(entry.node, targetNode)) {
            matches.push(entry.callback);
      ***REMOVED*** else if (event === 'leave' && contains.call(entry.node, targetParentNode)) {
            matches.push(entry.callback);
      ***REMOVED***
    ***REMOVED***);
  ***REMOVED***

      return matches;
***REMOVED***

    return {
      on: function(event, container, callback) {
        var node = extractElementNode(container);
        callbackRegistry[event] = callbackRegistry[event] || [];
        callbackRegistry[event].push({
          node: node,
          callback: callback
    ***REMOVED***);
  ***REMOVED***,

      off: function(event, container, callback) {
        var entries = callbackRegistry[event];
        if (!entries) return;

        callbackRegistry[event] = arguments.length === 1
            ? null
            : filterFromRegistry(entries, container, callback);

        function filterFromRegistry(list, matchContainer, matchCallback) {
          var containerNode = extractElementNode(matchContainer);
          return list.filter(function(entry) {
            var isMatch = entry.node === containerNode &&
                            (!matchCallback || entry.callback === matchCallback);
            return !isMatch;
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***,

      pin: function(element, parentElement) {
        assertArg(isElement(element), 'element', 'not an element');
        assertArg(isElement(parentElement), 'parentElement', 'not an element');
        element.data(NG_ANIMATE_PIN_DATA, parentElement);
  ***REMOVED***,

      push: function(element, event, options, domOperation) {
        options = options || {***REMOVED***;
        options.domOperation = domOperation;
        return queueAnimation(element, event, options);
  ***REMOVED***,

  ***REMOVED*** this method has four signatures:
  ***REMOVED***  () - global getter
  ***REMOVED***  (bool) - global setter
  ***REMOVED***  (element) - element getter
  ***REMOVED***  (element, bool) - element setter<F37>
      enabled: function(element, bool) {
        var argCount = arguments.length;

        if (argCount === 0) {
      ***REMOVED*** () - Global getter
          bool = !!animationsEnabled;
    ***REMOVED*** ***REMOVED***
          var hasElement = isElement(element);

          if (!hasElement) {
        ***REMOVED*** (bool) - Global setter
            bool = animationsEnabled = !!element;
      ***REMOVED*** ***REMOVED***
            var node = getDomNode(element);
            var recordExists = disabledElementsLookup.get(node);

            if (argCount === 1) {
          ***REMOVED*** (element) - Element getter
              bool = !recordExists;
        ***REMOVED*** ***REMOVED***
          ***REMOVED*** (element, bool) - Element setter
              disabledElementsLookup.put(node, !bool);
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***

        return bool;
  ***REMOVED***
***REMOVED***;

    function queueAnimation(element, event, initialOptions) {
  ***REMOVED*** we always make a copy of the options since
  ***REMOVED*** there should never be any side effects on
  ***REMOVED*** the input data when running `$animateCss`.
      var options = copy(initialOptions);

      var node, parent;
      element = stripCommentsFromElement(element);
      if (element) {
        node = getDomNode(element);
        parent = element.parent();
  ***REMOVED***

      options = prepareAnimationOptions(options);

  ***REMOVED*** we create a fake runner with a working promise.
  ***REMOVED*** These methods will become available after the digest has passed
      var runner = new $$AnimateRunner();

  ***REMOVED*** this is used to trigger callbacks in postDigest mode
      var runInNextPostDigestOrNow = postDigestTaskFactory();

      if (isArray(options.addClass)) {
        options.addClass = options.addClass.join(' ');
  ***REMOVED***

      if (options.addClass && !isString(options.addClass)) {
        options.addClass = null;
  ***REMOVED***

      if (isArray(options.removeClass)) {
        options.removeClass = options.removeClass.join(' ');
  ***REMOVED***

      if (options.removeClass && !isString(options.removeClass)) {
        options.removeClass = null;
  ***REMOVED***

      if (options.from && !isObject(options.from)) {
        options.from = null;
  ***REMOVED***

      if (options.to && !isObject(options.to)) {
        options.to = null;
  ***REMOVED***

  ***REMOVED*** there are situations where a directive issues an animation for
  ***REMOVED*** a jqLite wrapper that contains only comment nodes... If this
  ***REMOVED*** happens then there is no way we can perform an animation
      if (!node) {
        close();
        return runner;
  ***REMOVED***

      var className = [node.className, options.addClass, options.removeClass].join(' ');
      if (!isAnimatableClassName(className)) {
        close();
        return runner;
  ***REMOVED***

      var isStructural = ['enter', 'move', 'leave'].indexOf(event) >= 0;

  ***REMOVED*** this is a hard disable of all animations for the application or on
  ***REMOVED*** the element itself, therefore  there is no need to continue further
  ***REMOVED*** past this point if not enabled
  ***REMOVED*** Animations are also disabled if the document is currently hidden (page is not visible
  ***REMOVED*** to the user), because browsers slow down or do not flush calls to requestAnimationFrame
      var skipAnimations = !animationsEnabled || $document[0].hidden || disabledElementsLookup.get(node);
      var existingAnimation = (!skipAnimations && activeAnimationsLookup.get(node)) || {***REMOVED***;
      var hasExistingAnimation = !!existingAnimation.state;

  ***REMOVED*** there is no point in traversing the same collection of parent ancestors if a followup
  ***REMOVED*** animation will be run on the same element that already did all that checking work
      if (!skipAnimations && (!hasExistingAnimation || existingAnimation.state != PRE_DIGEST_STATE)) {
        skipAnimations = !areAnimationsAllowed(element, parent, event);
  ***REMOVED***

      if (skipAnimations) {
        close();
        return runner;
  ***REMOVED***

      if (isStructural) {
        closeChildAnimations(element);
  ***REMOVED***

      var newAnimation = {
        structural: isStructural,
        element: element,
        event: event,
        addClass: options.addClass,
        removeClass: options.removeClass,
        close: close,
        options: options,
        runner: runner
  ***REMOVED***;

      if (hasExistingAnimation) {
        var skipAnimationFlag = isAllowed('skip', element, newAnimation, existingAnimation);
        if (skipAnimationFlag) {
          if (existingAnimation.state === RUNNING_STATE) {
            close();
            return runner;
      ***REMOVED*** ***REMOVED***
            mergeAnimationDetails(element, existingAnimation, newAnimation);
            return existingAnimation.runner;
      ***REMOVED***
    ***REMOVED***
        var cancelAnimationFlag = isAllowed('cancel', element, newAnimation, existingAnimation);
        if (cancelAnimationFlag) {
          if (existingAnimation.state === RUNNING_STATE) {
        ***REMOVED*** this will end the animation right away and it is safe
        ***REMOVED*** to do so since the animation is already running and the
        ***REMOVED*** runner callback code will run in async
            existingAnimation.runner.end();
      ***REMOVED*** else if (existingAnimation.structural) {
        ***REMOVED*** this means that the animation is queued into a digest, but
        ***REMOVED*** hasn't started yet. Therefore it is safe to run the close
        ***REMOVED*** method which will call the runner methods in async.
            existingAnimation.close();
      ***REMOVED*** ***REMOVED***
        ***REMOVED*** this will merge the new animation options into existing animation options
            mergeAnimationDetails(element, existingAnimation, newAnimation);

            return existingAnimation.runner;
      ***REMOVED***
    ***REMOVED*** ***REMOVED***
      ***REMOVED*** a joined animation means that this animation will take over the existing one
      ***REMOVED*** so an example would involve a leave animation taking over an enter. Then when
      ***REMOVED*** the postDigest kicks in the enter will be ignored.
          var joinAnimationFlag = isAllowed('join', element, newAnimation, existingAnimation);
          if (joinAnimationFlag) {
            if (existingAnimation.state === RUNNING_STATE) {
              normalizeAnimationDetails(element, newAnimation);
        ***REMOVED*** ***REMOVED***
              applyGeneratedPreparationClasses(element, isStructural ? event : null, options);

              event = newAnimation.event = existingAnimation.event;
              options = mergeAnimationDetails(element, existingAnimation, newAnimation);

          ***REMOVED***we return the same runner since only the option values of this animation will
          ***REMOVED***be fed into the `existingAnimation`.
              return existingAnimation.runner;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  ***REMOVED*** ***REMOVED***
    ***REMOVED*** normalization in this case means that it removes redundant CSS classes that
    ***REMOVED*** already exist (addClass) or do not exist (removeClass) on the element
        normalizeAnimationDetails(element, newAnimation);
  ***REMOVED***

  ***REMOVED*** when the options are merged and cleaned up we may end up not having to do
  ***REMOVED*** an animation at all, therefore we should check this before issuing a post
  ***REMOVED*** digest callback. Structural animations will always run no matter what.
      var isValidAnimation = newAnimation.structural;
      if (!isValidAnimation) {
    ***REMOVED*** animate (from/to) can be quickly checked first, otherwise we check if any classes are present
        isValidAnimation = (newAnimation.event === 'animate' && Object.keys(newAnimation.options.to || {***REMOVED***).length > 0)
                            || hasAnimationClasses(newAnimation);
  ***REMOVED***

      if (!isValidAnimation) {
        close();
        clearElementAnimationState(element);
        return runner;
  ***REMOVED***

  ***REMOVED*** the counter keeps track of cancelled animations
      var counter = (existingAnimation.counter || 0) + 1;
      newAnimation.counter = counter;

      markElementAnimationState(element, PRE_DIGEST_STATE, newAnimation);

      $rootScope.$$postDigest(function() {
        var animationDetails = activeAnimationsLookup.get(node);
        var animationCancelled = !animationDetails;
        animationDetails = animationDetails || {***REMOVED***;

    ***REMOVED*** if addClass/removeClass is called before something like enter then the
    ***REMOVED*** registered parent element may not be present. The code below will ensure
    ***REMOVED*** that a final value for parent element is obtained
        var parentElement = element.parent() || [];

    ***REMOVED*** animate/structural/class-based animations all have requirements. Otherwise there
    ***REMOVED*** is no point in performing an animation. The parent node must also be set.
        var isValidAnimation = parentElement.length > 0
                                && (animationDetails.event === 'animate'
                                    || animationDetails.structural
                                    || hasAnimationClasses(animationDetails));

    ***REMOVED*** this means that the previous animation was cancelled
    ***REMOVED*** even if the follow-up animation is the same event
        if (animationCancelled || animationDetails.counter !== counter || !isValidAnimation) {
      ***REMOVED*** if another animation did not take over then we need
      ***REMOVED*** to make sure that the domOperation and options are
      ***REMOVED*** handled accordingly
          if (animationCancelled) {
            applyAnimationClasses(element, options);
            applyAnimationStyles(element, options);
      ***REMOVED***

      ***REMOVED*** if the event changed from something like enter to leave then we do
      ***REMOVED*** it, otherwise if it's the same then the end result will be the same too
          if (animationCancelled || (isStructural && animationDetails.event !== event)) {
            options.domOperation();
            runner.end();
      ***REMOVED***

      ***REMOVED*** in the event that the element animation was not cancelled or a follow-up animation
      ***REMOVED*** isn't allowed to animate from here then we need to clear the state of the element
      ***REMOVED*** so that any future animations won't read the expired animation data.
          if (!isValidAnimation) {
            clearElementAnimationState(element);
      ***REMOVED***

          return;
    ***REMOVED***

    ***REMOVED*** this combined multiple class to addClass / removeClass into a setClass event
    ***REMOVED*** so long as a structural event did not take over the animation
        event = !animationDetails.structural && hasAnimationClasses(animationDetails, true)
            ? 'setClass'
            : animationDetails.event;

        markElementAnimationState(element, RUNNING_STATE);
        var realRunner = $$animation(element, event, animationDetails.options);

        realRunner.done(function(status) {
          close(!status);
          var animationDetails = activeAnimationsLookup.get(node);
          if (animationDetails && animationDetails.counter === counter) {
            clearElementAnimationState(getDomNode(element));
      ***REMOVED***
          notifyProgress(runner, event, 'close', {***REMOVED***);
    ***REMOVED***);

    ***REMOVED*** this will update the runner's flow-control events based on
    ***REMOVED*** the `realRunner` object.
        runner.setHost(realRunner);
        notifyProgress(runner, event, 'start', {***REMOVED***);
  ***REMOVED***);

      return runner;

      function notifyProgress(runner, event, phase, data) {
        runInNextPostDigestOrNow(function() {
          var callbacks = findCallbacks(parent, element, event);
          if (callbacks.length) {
        ***REMOVED*** do not optimize this call here to RAF because
        ***REMOVED*** we don't know how heavy the callback code here will
        ***REMOVED*** be and if this code is buffered then this can
        ***REMOVED*** lead to a performance regression.
            $$rAF(function() {
              forEach(callbacks, function(callback) {
                callback(element, phase, data);
          ***REMOVED***);
        ***REMOVED***);
      ***REMOVED***
    ***REMOVED***);
        runner.progress(event, phase, data);
  ***REMOVED***

      function close(reject) { // jshint ignore:line
        clearGeneratedClasses(element, options);
        applyAnimationClasses(element, options);
        applyAnimationStyles(element, options);
        options.domOperation();
        runner.complete(!reject);
  ***REMOVED***
***REMOVED***

    function closeChildAnimations(element) {
      var node = getDomNode(element);
      var children = node.querySelectorAll('[' + NG_ANIMATE_ATTR_NAME + ']');
      forEach(children, function(child) {
        var state = parseInt(child.getAttribute(NG_ANIMATE_ATTR_NAME));
        var animationDetails = activeAnimationsLookup.get(child);
        if (animationDetails) {
          switch (state) {
            case RUNNING_STATE:
              animationDetails.runner.end();
              /* falls through */
            case PRE_DIGEST_STATE:
              activeAnimationsLookup.remove(child);
              break;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***);
***REMOVED***

    function clearElementAnimationState(element) {
      var node = getDomNode(element);
      node.removeAttribute(NG_ANIMATE_ATTR_NAME);
      activeAnimationsLookup.remove(node);
***REMOVED***

    function isMatchingElement(nodeOrElmA, nodeOrElmB) {
      return getDomNode(nodeOrElmA) === getDomNode(nodeOrElmB);
***REMOVED***

    /**
     * This fn returns false if any of the following is true:
     * a) animations on any parent element are disabled, and animations on the element aren't explicitly allowed
     * b) a parent element has an ongoing structural animation, and animateChildren is false
     * c) the element is not a child of the body
     * d) the element is not a child of the $rootElement
     */
    function areAnimationsAllowed(element, parentElement, event) {
      var bodyElement = jqLite($document[0].body);
      var bodyElementDetected = isMatchingElement(element, bodyElement) || element[0].nodeName === 'HTML';
      var rootElementDetected = isMatchingElement(element, $rootElement);
      var parentAnimationDetected = false;
      var animateChildren;
      var elementDisabled = disabledElementsLookup.get(getDomNode(element));

      var parentHost = element.data(NG_ANIMATE_PIN_DATA);
      if (parentHost) {
        parentElement = parentHost;
  ***REMOVED***

      while (parentElement && parentElement.length) {
        if (!rootElementDetected) {
      ***REMOVED*** angular doesn't want to attempt to animate elements outside of the application
      ***REMOVED*** therefore we need to ensure that the rootElement is an ancestor of the current element
          rootElementDetected = isMatchingElement(parentElement, $rootElement);
    ***REMOVED***

        var parentNode = parentElement[0];
        if (parentNode.nodeType !== ELEMENT_NODE) {
      ***REMOVED*** no point in inspecting the #document element
          break;
    ***REMOVED***

        var details = activeAnimationsLookup.get(parentNode) || {***REMOVED***;
    ***REMOVED*** either an enter, leave or move animation will commence
    ***REMOVED*** therefore we can't allow any animations to take place
    ***REMOVED*** but if a parent animation is class-based then that's ok
        if (!parentAnimationDetected) {
          var parentElementDisabled = disabledElementsLookup.get(parentNode);

          if (parentElementDisabled === true && elementDisabled !== false) {
        ***REMOVED*** disable animations if the user hasn't explicitly enabled animations on the
        ***REMOVED*** current element
            elementDisabled = true;
        ***REMOVED*** element is disabled via parent element, no need to check anything else
            break;
      ***REMOVED*** else if (parentElementDisabled === false) {
            elementDisabled = false;
      ***REMOVED***
          parentAnimationDetected = details.structural;
    ***REMOVED***

        if (isUndefined(animateChildren) || animateChildren === true) {
          var value = parentElement.data(NG_ANIMATE_CHILDREN_DATA);
          if (isDefined(value)) {
            animateChildren = value;
      ***REMOVED***
    ***REMOVED***

    ***REMOVED*** there is no need to continue traversing at this point
        if (parentAnimationDetected && animateChildren === false) break;

        if (!bodyElementDetected) {
      ***REMOVED*** we also need to ensure that the element is or will be a part of the body element
      ***REMOVED*** otherwise it is pointless to even issue an animation to be rendered
          bodyElementDetected = isMatchingElement(parentElement, bodyElement);
    ***REMOVED***

        if (bodyElementDetected && rootElementDetected) {
      ***REMOVED*** If both body and root have been found, any other checks are pointless,
      ***REMOVED*** as no animation data should live outside the application
          break;
    ***REMOVED***

        if (!rootElementDetected) {
      ***REMOVED*** If no rootElement is detected, check if the parentElement is pinned to another element
          parentHost = parentElement.data(NG_ANIMATE_PIN_DATA);
          if (parentHost) {
        ***REMOVED*** The pin target element becomes the next parent element
            parentElement = parentHost;
            continue;
      ***REMOVED***
    ***REMOVED***

        parentElement = parentElement.parent();
  ***REMOVED***

      var allowAnimation = (!parentAnimationDetected || animateChildren) && elementDisabled !== true;
      return allowAnimation && rootElementDetected && bodyElementDetected;
***REMOVED***

    function markElementAnimationState(element, state, details) {
      details = details || {***REMOVED***;
      details.state = state;

      var node = getDomNode(element);
      node.setAttribute(NG_ANIMATE_ATTR_NAME, state);

      var oldValue = activeAnimationsLookup.get(node);
      var newValue = oldValue
          ? extend(oldValue, details)
          : details;
      activeAnimationsLookup.put(node, newValue);
***REMOVED***
  ***REMOVED***];
***REMOVED***];

var $$AnimationProvider = ['$animateProvider', function($animateProvider) {
  var NG_ANIMATE_REF_ATTR = 'ng-animate-ref';

  var drivers = this.drivers = [];

  var RUNNER_STORAGE_KEY = '$$animationRunner';

  function setRunner(element, runner) {
    element.data(RUNNER_STORAGE_KEY, runner);
  ***REMOVED***

  function removeRunner(element) {
    element.removeData(RUNNER_STORAGE_KEY);
  ***REMOVED***

  function getRunner(element) {
    return element.data(RUNNER_STORAGE_KEY);
  ***REMOVED***

  this.$get = ['$$jqLite', '$rootScope', '$injector', '$$AnimateRunner', '$$HashMap', '$$rAFScheduler',
       function($$jqLite,   $rootScope,   $injector,   $$AnimateRunner,   $$HashMap,   $$rAFScheduler) {

    var animationQueue = [];
    var applyAnimationClasses = applyAnimationClassesFactory($$jqLite);

    function sortAnimations(animations) {
      var tree = { children: [] ***REMOVED***;
      var i, lookup = new $$HashMap();

  ***REMOVED*** this is done first beforehand so that the hashmap
  ***REMOVED*** is filled with a list of the elements that will be animated
      for (i = 0; i < animations.length; i++) {
        var animation = animations[i];
        lookup.put(animation.domNode, animations[i] = {
          domNode: animation.domNode,
          fn: animation.fn,
          children: []
    ***REMOVED***);
  ***REMOVED***

      for (i = 0; i < animations.length; i++) {
        processNode(animations[i]);
  ***REMOVED***

      return flatten(tree);

      function processNode(entry) {
        if (entry.processed) return entry;
        entry.processed = true;

        var elementNode = entry.domNode;
        var parentNode = elementNode.parentNode;
        lookup.put(elementNode, entry);

        var parentEntry;
        while (parentNode) {
          parentEntry = lookup.get(parentNode);
          if (parentEntry) {
            if (!parentEntry.processed) {
              parentEntry = processNode(parentEntry);
        ***REMOVED***
            break;
      ***REMOVED***
          parentNode = parentNode.parentNode;
    ***REMOVED***

        (parentEntry || tree).children.push(entry);
        return entry;
  ***REMOVED***

      function flatten(tree) {
        var result = [];
        var queue = [];
        var i;

        for (i = 0; i < tree.children.length; i++) {
          queue.push(tree.children[i]);
    ***REMOVED***

        var remainingLevelEntries = queue.length;
        var nextLevelEntries = 0;
        var row = [];

        for (i = 0; i < queue.length; i++) {
          var entry = queue[i];
          if (remainingLevelEntries <= 0) {
            remainingLevelEntries = nextLevelEntries;
            nextLevelEntries = 0;
            result.push(row);
            row = [];
      ***REMOVED***
          row.push(entry.fn);
          entry.children.forEach(function(childEntry) {
            nextLevelEntries++;
            queue.push(childEntry);
      ***REMOVED***);
          remainingLevelEntries--;
    ***REMOVED***

        if (row.length) {
          result.push(row);
    ***REMOVED***

        return result;
  ***REMOVED***
***REMOVED***

***REMOVED*** TODO(matsko): document the signature in a better way
    return function(element, event, options) {
      options = prepareAnimationOptions(options);
      var isStructural = ['enter', 'move', 'leave'].indexOf(event) >= 0;

  ***REMOVED*** there is no animation at the current moment, however
  ***REMOVED*** these runner methods will get later updated with the
  ***REMOVED*** methods leading into the driver's end/cancel methods
  ***REMOVED*** for now they just stop the animation from starting
      var runner = new $$AnimateRunner({
        end: function() { close(); ***REMOVED***,
        cancel: function() { close(true); ***REMOVED***
  ***REMOVED***);

      if (!drivers.length) {
        close();
        return runner;
  ***REMOVED***

      setRunner(element, runner);

      var classes = mergeClasses(element.attr('class'), mergeClasses(options.addClass, options.removeClass));
      var tempClasses = options.tempClasses;
      if (tempClasses) {
        classes += ' ' + tempClasses;
        options.tempClasses = null;
  ***REMOVED***

      var prepareClassName;
      if (isStructural) {
        prepareClassName = 'ng-' + event + PREPARE_CLASS_SUFFIX;
        $$jqLite.addClass(element, prepareClassName);
  ***REMOVED***

      animationQueue.push({
    ***REMOVED*** this data is used by the postDigest code and passed into
    ***REMOVED*** the driver step function
        element: element,
        classes: classes,
        event: event,
        structural: isStructural,
        options: options,
        beforeStart: beforeStart,
        close: close
  ***REMOVED***);

      element.on('$destroy', handleDestroyedElement);

  ***REMOVED*** we only want there to be one function called within the post digest
  ***REMOVED*** block. This way we can group animations for all the animations that
  ***REMOVED*** were apart of the same postDigest flush call.
      if (animationQueue.length > 1) return runner;

      $rootScope.$$postDigest(function() {
        var animations = [];
        forEach(animationQueue, function(entry) {
      ***REMOVED*** the element was destroyed early on which removed the runner
      ***REMOVED*** form its storage. This means we can't animate this element
      ***REMOVED*** at all and it already has been closed due to destruction.
          if (getRunner(entry.element)) {
            animations.push(entry);
      ***REMOVED*** ***REMOVED***
            entry.close();
      ***REMOVED***
    ***REMOVED***);

    ***REMOVED*** now any future animations will be in another postDigest
        animationQueue.length = 0;

        var groupedAnimations = groupAnimations(animations);
        var toBeSortedAnimations = [];

        forEach(groupedAnimations, function(animationEntry) {
          toBeSortedAnimations.push({
            domNode: getDomNode(animationEntry.from ? animationEntry.from.element : animationEntry.element),
            fn: function triggerAnimationStart() {
          ***REMOVED*** it's important that we apply the `ng-animate` CSS class and the
          ***REMOVED*** temporary classes before we do any driver invoking since these
          ***REMOVED*** CSS classes may be required for proper CSS detection.
              animationEntry.beforeStart();

              var startAnimationFn, closeFn = animationEntry.close;

          ***REMOVED*** in the event that the element was removed before the digest runs or
          ***REMOVED*** during the RAF sequencing then we should not trigger the animation.
              var targetElement = animationEntry.anchors
                  ? (animationEntry.from.element || animationEntry.to.element)
                  : animationEntry.element;

              if (getRunner(targetElement)) {
                var operation = invokeFirstDriver(animationEntry);
                if (operation) {
                  startAnimationFn = operation.start;
            ***REMOVED***
          ***REMOVED***

              if (!startAnimationFn) {
                closeFn();
          ***REMOVED*** ***REMOVED***
                var animationRunner = startAnimationFn();
                animationRunner.done(function(status) {
                  closeFn(!status);
            ***REMOVED***);
                updateAnimationRunners(animationEntry, animationRunner);
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED***);

    ***REMOVED*** we need to sort each of the animations in order of parent to child
    ***REMOVED*** relationships. This ensures that the child classes are applied at the
    ***REMOVED*** right time.
        $$rAFScheduler(sortAnimations(toBeSortedAnimations));
  ***REMOVED***);

      return runner;

  ***REMOVED*** TODO(matsko): change to reference nodes
      function getAnchorNodes(node) {
        var SELECTOR = '[' + NG_ANIMATE_REF_ATTR + ']';
        var items = node.hasAttribute(NG_ANIMATE_REF_ATTR)
              ? [node]
              : node.querySelectorAll(SELECTOR);
        var anchors = [];
        forEach(items, function(node) {
          var attr = node.getAttribute(NG_ANIMATE_REF_ATTR);
          if (attr && attr.length) {
            anchors.push(node);
      ***REMOVED***
    ***REMOVED***);
        return anchors;
  ***REMOVED***

      function groupAnimations(animations) {
        var preparedAnimations = [];
        var refLookup = {***REMOVED***;
        forEach(animations, function(animation, index) {
          var element = animation.element;
          var node = getDomNode(element);
          var event = animation.event;
          var enterOrMove = ['enter', 'move'].indexOf(event) >= 0;
          var anchorNodes = animation.structural ? getAnchorNodes(node) : [];

          if (anchorNodes.length) {
            var direction = enterOrMove ? 'to' : 'from';

            forEach(anchorNodes, function(anchor) {
              var key = anchor.getAttribute(NG_ANIMATE_REF_ATTR);
              refLookup[key] = refLookup[key] || {***REMOVED***;
              refLookup[key][direction] = {
                animationID: index,
                element: jqLite(anchor)
          ***REMOVED***;
        ***REMOVED***);
      ***REMOVED*** ***REMOVED***
            preparedAnimations.push(animation);
      ***REMOVED***
    ***REMOVED***);

        var usedIndicesLookup = {***REMOVED***;
        var anchorGroups = {***REMOVED***;
        forEach(refLookup, function(operations, key) {
          var from = operations.from;
          var to = operations.to;

          if (!from || !to) {
        ***REMOVED*** only one of these is set therefore we can't have an
        ***REMOVED*** anchor animation since all three pieces are required
            var index = from ? from.animationID : to.animationID;
            var indexKey = index.toString();
            if (!usedIndicesLookup[indexKey]) {
              usedIndicesLookup[indexKey] = true;
              preparedAnimations.push(animations[index]);
        ***REMOVED***
            return;
      ***REMOVED***

          var fromAnimation = animations[from.animationID];
          var toAnimation = animations[to.animationID];
          var lookupKey = from.animationID.toString();
          if (!anchorGroups[lookupKey]) {
            var group = anchorGroups[lookupKey] = {
              structural: true,
              beforeStart: function() {
                fromAnimation.beforeStart();
                toAnimation.beforeStart();
          ***REMOVED***,
              close: function() {
                fromAnimation.close();
                toAnimation.close();
          ***REMOVED***,
              classes: cssClassesIntersection(fromAnimation.classes, toAnimation.classes),
              from: fromAnimation,
              to: toAnimation,
              anchors: [] // TODO(matsko): change to reference nodes
        ***REMOVED***;

        ***REMOVED*** the anchor animations require that the from and to elements both have at least
        ***REMOVED*** one shared CSS class which effectively marries the two elements together to use
        ***REMOVED*** the same animation driver and to properly sequence the anchor animation.
            if (group.classes.length) {
              preparedAnimations.push(group);
        ***REMOVED*** ***REMOVED***
              preparedAnimations.push(fromAnimation);
              preparedAnimations.push(toAnimation);
        ***REMOVED***
      ***REMOVED***

          anchorGroups[lookupKey].anchors.push({
            'out': from.element, 'in': to.element
      ***REMOVED***);
    ***REMOVED***);

        return preparedAnimations;
  ***REMOVED***

      function cssClassesIntersection(a,b) {
        a = a.split(' ');
        b = b.split(' ');
        var matches = [];

        for (var i = 0; i < a.length; i++) {
          var aa = a[i];
          if (aa.substring(0,3) === 'ng-') continue;

          for (var j = 0; j < b.length; j++) {
            if (aa === b[j]) {
              matches.push(aa);
              break;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***

        return matches.join(' ');
  ***REMOVED***

      function invokeFirstDriver(animationDetails) {
    ***REMOVED*** we loop in reverse order since the more general drivers (like CSS and JS)
    ***REMOVED*** may attempt more elements, but custom drivers are more particular
        for (var i = drivers.length - 1; i >= 0; i--) {
          var driverName = drivers[i];
          if (!$injector.has(driverName)) continue; // TODO(matsko): remove this check

          var factory = $injector.get(driverName);
          var driver = factory(animationDetails);
          if (driver) {
            return driver;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***

      function beforeStart() {
        element.addClass(NG_ANIMATE_CLASSNAME);
        if (tempClasses) {
          $$jqLite.addClass(element, tempClasses);
    ***REMOVED***
        if (prepareClassName) {
          $$jqLite.removeClass(element, prepareClassName);
          prepareClassName = null;
    ***REMOVED***
  ***REMOVED***

      function updateAnimationRunners(animation, newRunner) {
        if (animation.from && animation.to) {
          update(animation.from.element);
          update(animation.to.element);
    ***REMOVED*** ***REMOVED***
          update(animation.element);
    ***REMOVED***

        function update(element) {
          getRunner(element).setHost(newRunner);
    ***REMOVED***
  ***REMOVED***

      function handleDestroyedElement() {
        var runner = getRunner(element);
        if (runner && (event !== 'leave' || !options.$$domOperationFired)) {
          runner.end();
    ***REMOVED***
  ***REMOVED***

      function close(rejected) { // jshint ignore:line
        element.off('$destroy', handleDestroyedElement);
        removeRunner(element);

        applyAnimationClasses(element, options);
        applyAnimationStyles(element, options);
        options.domOperation();

        if (tempClasses) {
          $$jqLite.removeClass(element, tempClasses);
    ***REMOVED***

        element.removeClass(NG_ANIMATE_CLASSNAME);
        runner.complete(!rejected);
  ***REMOVED***
***REMOVED***;
  ***REMOVED***];
***REMOVED***];

/**
 * @ngdoc directive
 * @name ngAnimateSwap
 * @restrict A
 * @scope
 *
 * @description
 *
 * ngAnimateSwap is a animation-oriented directive that allows for the container to
 * be removed and entered in whenever the associated expression changes. A
 * common usecase for this directive is a rotating banner component which
 * contains one image being present at a time. When the active image changes
 * then the old image will perform a `leave` animation and the new element
 * will be inserted via an `enter` animation.
 *
 * @example
 * <example name="ngAnimateSwap-directive" module="ngAnimateSwapExample"
 *          deps="angular-animate.js"
 *          animations="true" fixBase="true">
 *   <file name="index.html">
 *     <div class="container" ng-controller="AppCtrl">
 *       <div ng-animate-swap="number" class="cell swap-animation" ng-class="colorClass(number)">
 *         {{ number ***REMOVED******REMOVED***
 *       </div>
 *     </div>
 *   </file>
 *   <file name="script.js">
 *     angular.module('ngAnimateSwapExample', ['ngAnimate'])
 *       .controller('AppCtrl', ['$scope', '$interval', function($scope, $interval) {
 *         $scope.number = 0;
 *         $interval(function() {
 *           $scope.number++;
 *     ***REMOVED***, 1000);
 *
 *         var colors = ['red','blue','green','yellow','orange'];
 *         $scope.colorClass = function(number) {
 *           return colors[number % colors.length];
 *     ***REMOVED***;
 *   ***REMOVED***]);
 *   </file>
 *  <file name="animations.css">
 *  .container {
 *    height:250px;
 *    width:250px;
 *    position:relative;
 *    overflow:hidden;
 *    border:2px solid black;
 *  ***REMOVED***
 *  .container .cell {
 *    font-size:150px;
 *    text-align:center;
 *    line-height:250px;
 *    position:absolute;
 *    top:0;
 *    left:0;
 *    right:0;
 *    border-bottom:2px solid black;
 *  ***REMOVED***
 *  .swap-animation.ng-enter, .swap-animation.ng-leave {
 *    transition:0.5s linear all;
 *  ***REMOVED***
 *  .swap-animation.ng-enter {
 *    top:-250px;
 *  ***REMOVED***
 *  .swap-animation.ng-enter-active {
 *    top:0px;
 *  ***REMOVED***
 *  .swap-animation.ng-leave {
 *    top:0px;
 *  ***REMOVED***
 *  .swap-animation.ng-leave-active {
 *    top:250px;
 *  ***REMOVED***
 *  .red { background:red; ***REMOVED***
 *  .green { background:green; ***REMOVED***
 *  .blue { background:blue; ***REMOVED***
 *  .yellow { background:yellow; ***REMOVED***
 *  .orange { background:orange; ***REMOVED***
 *  </file>
 * </example>
 */
var ngAnimateSwapDirective = ['$animate', '$rootScope', function($animate, $rootScope) {
  return {
    restrict: 'A',
    transclude: 'element',
    terminal: true,
    priority: 600, // we use 600 here to ensure that the directive is caught before others
    link: function(scope, $element, attrs, ctrl, $transclude) {
      var previousElement, previousScope;
      scope.$watchCollection(attrs.ngAnimateSwap || attrs['for'], function(value) {
        if (previousElement) {
          $animate.leave(previousElement);
    ***REMOVED***
        if (previousScope) {
          previousScope.$destroy();
          previousScope = null;
    ***REMOVED***
        if (value || value === 0) {
          previousScope = scope.$new();
          $transclude(previousScope, function(element) {
            previousElement = element;
            $animate.enter(element, null, $element);
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***);
***REMOVED***
  ***REMOVED***;
***REMOVED***];

/* global angularAnimateModule: true,

   ngAnimateSwapDirective,
   $$AnimateAsyncRunFactory,
   $$rAFSchedulerFactory,
   $$AnimateChildrenDirective,
   $$AnimateQueueProvider,
   $$AnimationProvider,
   $AnimateCssProvider,
   $$AnimateCssDriverProvider,
   $$AnimateJsProvider,
   $$AnimateJsDriverProvider,
*/

/**
 * @ngdoc module
 * @name ngAnimate
 * @description
 *
 * The `ngAnimate` module provides support for CSS-based animations (keyframes and transitions) as well as JavaScript-based animations via
 * callback hooks. Animations are not enabled by default, however, by including `ngAnimate` the animation hooks are enabled for an Angular app.
 *
 * <div doc-module-components="ngAnimate"></div>
 *
 * # Usage
 * Simply put, there are two ways to make use of animations when ngAnimate is used: by using **CSS** and **JavaScript**. The former works purely based
 * using CSS (by using matching CSS selectors/styles) and the latter triggers animations that are registered via `module.animation()`. For
 * both CSS and JS animations the sole requirement is to have a matching `CSS class` that exists both in the registered animation and within
 * the HTML element that the animation will be triggered on.
 *
 * ## Directive Support
 * The following directives are "animation aware":
 *
 * | Directive                                                                                                | Supported Animations                                                     |
 * |----------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------|
 * | {@link ng.directive:ngRepeat#animations ngRepeat***REMOVED***                                                        | enter, leave and move                                                    |
 * | {@link ngRoute.directive:ngView#animations ngView***REMOVED***                                                       | enter and leave                                                          |
 * | {@link ng.directive:ngInclude#animations ngInclude***REMOVED***                                                      | enter and leave                                                          |
 * | {@link ng.directive:ngSwitch#animations ngSwitch***REMOVED***                                                        | enter and leave                                                          |
 * | {@link ng.directive:ngIf#animations ngIf***REMOVED***                                                                | enter and leave                                                          |
 * | {@link ng.directive:ngClass#animations ngClass***REMOVED***                                                          | add and remove (the CSS class(es) present)                               |
 * | {@link ng.directive:ngShow#animations ngShow***REMOVED*** & {@link ng.directive:ngHide#animations ngHide***REMOVED***            | add and remove (the ng-hide class value)                                 |
 * | {@link ng.directive:form#animation-hooks form***REMOVED*** & {@link ng.directive:ngModel#animation-hooks ngModel***REMOVED***    | add and remove (dirty, pristine, valid, invalid & all other validations) |
 * | {@link module:ngMessages#animations ngMessages***REMOVED***                                                          | add and remove (ng-active & ng-inactive)                                 |
 * | {@link module:ngMessages#animations ngMessage***REMOVED***                                                           | enter and leave                                                          |
 *
 * (More information can be found by visiting each the documentation associated with each directive.)
 *
 * ## CSS-based Animations
 *
 * CSS-based animations with ngAnimate are unique since they require no JavaScript code at all. By using a CSS class that we reference between our HTML
 * and CSS code we can create an animation that will be picked up by Angular when an the underlying directive performs an operation.
 *
 * The example below shows how an `enter` animation can be made possible on an element using `ng-if`:
 *
 * ```html
 * <div ng-if="bool" class="fade">
 *    Fade me in out
 * </div>
 * <button ng-click="bool=true">Fade In!</button>
 * <button ng-click="bool=false">Fade Out!</button>
 * ```
 *
 * Notice the CSS class **fade**? We can now create the CSS transition code that references this class:
 *
 * ```css
 * /&#42; The starting CSS styles for the enter animation &#42;/
 * .fade.ng-enter {
 *   transition:0.5s linear all;
 *   opacity:0;
 * ***REMOVED***
 *
 * /&#42; The finishing CSS styles for the enter animation &#42;/
 * .fade.ng-enter.ng-enter-active {
 *   opacity:1;
 * ***REMOVED***
 * ```
 *
 * The key thing to remember here is that, depending on the animation event (which each of the directives above trigger depending on what's going on) two
 * generated CSS classes will be applied to the element; in the example above we have `.ng-enter` and `.ng-enter-active`. For CSS transitions, the transition
 * code **must** be defined within the starting CSS class (in this case `.ng-enter`). The destination class is what the transition will animate towards.
 *
 * If for example we wanted to create animations for `leave` and `move` (ngRepeat triggers move) then we can do so using the same CSS naming conventions:
 *
 * ```css
 * /&#42; now the element will fade out before it is removed from the DOM &#42;/
 * .fade.ng-leave {
 *   transition:0.5s linear all;
 *   opacity:1;
 * ***REMOVED***
 * .fade.ng-leave.ng-leave-active {
 *   opacity:0;
 * ***REMOVED***
 * ```
 *
 * We can also make use of **CSS Keyframes** by referencing the keyframe animation within the starting CSS class:
 *
 * ```css
 * /&#42; there is no need to define anything inside of the destination
 * CSS class since the keyframe will take charge of the animation &#42;/
 * .fade.ng-leave {
 *   animation: my_fade_animation 0.5s linear;
 *   -webkit-animation: my_fade_animation 0.5s linear;
 * ***REMOVED***
 *
 * @keyframes my_fade_animation {
 *   from { opacity:1; ***REMOVED***
 *   to { opacity:0; ***REMOVED***
 * ***REMOVED***
 *
 * @-webkit-keyframes my_fade_animation {
 *   from { opacity:1; ***REMOVED***
 *   to { opacity:0; ***REMOVED***
 * ***REMOVED***
 * ```
 *
 * Feel free also mix transitions and keyframes together as well as any other CSS classes on the same element.
 *
 * ### CSS Class-based Animations
 *
 * Class-based animations (animations that are triggered via `ngClass`, `ngShow`, `ngHide` and some other directives) have a slightly different
 * naming convention. Class-based animations are basic enough that a standard transition or keyframe can be referenced on the class being added
 * and removed.
 *
 * For example if we wanted to do a CSS animation for `ngHide` then we place an animation on the `.ng-hide` CSS class:
 *
 * ```html
 * <div ng-show="bool" class="fade">
 *   Show and hide me
 * </div>
 * <button ng-click="bool=true">Toggle</button>
 *
 * <style>
 * .fade.ng-hide {
 *   transition:0.5s linear all;
 *   opacity:0;
 * ***REMOVED***
 * </style>
 * ```
 *
 * All that is going on here with ngShow/ngHide behind the scenes is the `.ng-hide` class is added/removed (when the hidden state is valid). Since
 * ngShow and ngHide are animation aware then we can match up a transition and ngAnimate handles the rest.
 *
 * In addition the addition and removal of the CSS class, ngAnimate also provides two helper methods that we can use to further decorate the animation
 * with CSS styles.
 *
 * ```html
 * <div ng-class="{on:onOff***REMOVED***" class="highlight">
 *   Highlight this box
 * </div>
 * <button ng-click="onOff=!onOff">Toggle</button>
 *
 * <style>
 * .highlight {
 *   transition:0.5s linear all;
 * ***REMOVED***
 * .highlight.on-add {
 *   background:white;
 * ***REMOVED***
 * .highlight.on {
 *   background:yellow;
 * ***REMOVED***
 * .highlight.on-remove {
 *   background:black;
 * ***REMOVED***
 * </style>
 * ```
 *
 * We can also make use of CSS keyframes by placing them within the CSS classes.
 *
 *
 * ### CSS Staggering Animations
 * A Staggering animation is a collection of animations that are issued with a slight delay in between each successive operation resulting in a
 * curtain-like effect. The ngAnimate module (versions >=1.2) supports staggering animations and the stagger effect can be
 * performed by creating a **ng-EVENT-stagger** CSS class and attaching that class to the base CSS class used for
 * the animation. The style property expected within the stagger class can either be a **transition-delay** or an
 * **animation-delay** property (or both if your animation contains both transitions and keyframe animations).
 *
 * ```css
 * .my-animation.ng-enter {
 *   /&#42; standard transition code &#42;/
 *   transition: 1s linear all;
 *   opacity:0;
 * ***REMOVED***
 * .my-animation.ng-enter-stagger {
 *   /&#42; this will have a 100ms delay between each successive leave animation &#42;/
 *   transition-delay: 0.1s;
 *
 *   /&#42; As of 1.4.4, this must always be set: it signals ngAnimate
 *     to not accidentally inherit a delay property from another CSS class &#42;/
 *   transition-duration: 0s;
 * ***REMOVED***
 * .my-animation.ng-enter.ng-enter-active {
 *   /&#42; standard transition styles &#42;/
 *   opacity:1;
 * ***REMOVED***
 * ```
 *
 * Staggering animations work by default in ngRepeat (so long as the CSS class is defined). Outside of ngRepeat, to use staggering animations
 * on your own, they can be triggered by firing multiple calls to the same event on $animate. However, the restrictions surrounding this
 * are that each of the elements must have the same CSS className value as well as the same parent element. A stagger operation
 * will also be reset if one or more animation frames have passed since the multiple calls to `$animate` were fired.
 *
 * The following code will issue the **ng-leave-stagger** event on the element provided:
 *
 * ```js
 * var kids = parent.children();
 *
 * $animate.leave(kids[0]); //stagger index=0
 * $animate.leave(kids[1]); //stagger index=1
 * $animate.leave(kids[2]); //stagger index=2
 * $animate.leave(kids[3]); //stagger index=3
 * $animate.leave(kids[4]); //stagger index=4
 *
 * window.requestAnimationFrame(function() {
 *   //stagger has reset itself
 *   $animate.leave(kids[5]); //stagger index=0
 *   $animate.leave(kids[6]); //stagger index=1
 *
 *   $scope.$digest();
 * ***REMOVED***);
 * ```
 *
 * Stagger animations are currently only supported within CSS-defined animations.
 *
 * ### The `ng-animate` CSS class
 *
 * When ngAnimate is animating an element it will apply the `ng-animate` CSS class to the element for the duration of the animation.
 * This is a temporary CSS class and it will be removed once the animation is over (for both JavaScript and CSS-based animations).
 *
 * Therefore, animations can be applied to an element using this temporary class directly via CSS.
 *
 * ```css
 * .zipper.ng-animate {
 *   transition:0.5s linear all;
 * ***REMOVED***
 * .zipper.ng-enter {
 *   opacity:0;
 * ***REMOVED***
 * .zipper.ng-enter.ng-enter-active {
 *   opacity:1;
 * ***REMOVED***
 * .zipper.ng-leave {
 *   opacity:1;
 * ***REMOVED***
 * .zipper.ng-leave.ng-leave-active {
 *   opacity:0;
 * ***REMOVED***
 * ```
 *
 * (Note that the `ng-animate` CSS class is reserved and it cannot be applied on an element directly since ngAnimate will always remove
 * the CSS class once an animation has completed.)
 *
 *
 * ### The `ng-[event]-prepare` class
 *
 * This is a special class that can be used to prevent unwanted flickering / flash of content before
 * the actual animation starts. The class is added as soon as an animation is initialized, but removed
 * before the actual animation starts (after waiting for a $digest).
 * It is also only added for *structural* animations (`enter`, `move`, and `leave`).
 *
 * In practice, flickering can appear when nesting elements with structural animations such as `ngIf`
 * into elements that have class-based animations such as `ngClass`.
 *
 * ```html
 * <div ng-class="{red: myProp***REMOVED***">
 *   <div ng-class="{blue: myProp***REMOVED***">
 *     <div class="message" ng-if="myProp"></div>
 *   </div>
 * </div>
 * ```
 *
 * It is possible that during the `enter` animation, the `.message` div will be briefly visible before it starts animating.
 * In that case, you can add styles to the CSS that make sure the element stays hidden before the animation starts:
 *
 * ```css
 * .message.ng-enter-prepare {
 *   opacity: 0;
 * ***REMOVED***
 *
 * ```
 *
 * ## JavaScript-based Animations
 *
 * ngAnimate also allows for animations to be consumed by JavaScript code. The approach is similar to CSS-based animations (where there is a shared
 * CSS class that is referenced in our HTML code) but in addition we need to register the JavaScript animation on the module. By making use of the
 * `module.animation()` module function we can register the animation.
 *
 * Let's see an example of a enter/leave animation using `ngRepeat`:
 *
 * ```html
 * <div ng-repeat="item in items" class="slide">
 *   {{ item ***REMOVED******REMOVED***
 * </div>
 * ```
 *
 * See the **slide** CSS class? Let's use that class to define an animation that we'll structure in our module code by using `module.animation`:
 *
 * ```js
 * myModule.animation('.slide', [function() {
 *   return {
 * ***REMOVED*** make note that other events (like addClass/removeClass)
 * ***REMOVED*** have different function input parameters
 *     enter: function(element, doneFn) {
 *       jQuery(element).fadeIn(1000, doneFn);
 *
 *   ***REMOVED*** remember to call doneFn so that angular
 *   ***REMOVED*** knows that the animation has concluded
 * ***REMOVED***,
 *
 *     move: function(element, doneFn) {
 *       jQuery(element).fadeIn(1000, doneFn);
 * ***REMOVED***,
 *
 *     leave: function(element, doneFn) {
 *       jQuery(element).fadeOut(1000, doneFn);
 * ***REMOVED***
 *   ***REMOVED***
 * ***REMOVED***]);
 * ```
 *
 * The nice thing about JS-based animations is that we can inject other services and make use of advanced animation libraries such as
 * greensock.js and velocity.js.
 *
 * If our animation code class-based (meaning that something like `ngClass`, `ngHide` and `ngShow` triggers it) then we can still define
 * our animations inside of the same registered animation, however, the function input arguments are a bit different:
 *
 * ```html
 * <div ng-class="color" class="colorful">
 *   this box is moody
 * </div>
 * <button ng-click="color='red'">Change to red</button>
 * <button ng-click="color='blue'">Change to blue</button>
 * <button ng-click="color='green'">Change to green</button>
 * ```
 *
 * ```js
 * myModule.animation('.colorful', [function() {
 *   return {
 *     addClass: function(element, className, doneFn) {
 *   ***REMOVED*** do some cool animation and call the doneFn
 * ***REMOVED***,
 *     removeClass: function(element, className, doneFn) {
 *   ***REMOVED*** do some cool animation and call the doneFn
 * ***REMOVED***,
 *     setClass: function(element, addedClass, removedClass, doneFn) {
 *   ***REMOVED*** do some cool animation and call the doneFn
 * ***REMOVED***
 *   ***REMOVED***
 * ***REMOVED***]);
 * ```
 *
 * ## CSS + JS Animations Together
 *
 * AngularJS 1.4 and higher has taken steps to make the amalgamation of CSS and JS animations more flexible. However, unlike earlier versions of Angular,
 * defining CSS and JS animations to work off of the same CSS class will not work anymore. Therefore the example below will only result in **JS animations taking
 * charge of the animation**:
 *
 * ```html
 * <div ng-if="bool" class="slide">
 *   Slide in and out
 * </div>
 * ```
 *
 * ```js
 * myModule.animation('.slide', [function() {
 *   return {
 *     enter: function(element, doneFn) {
 *       jQuery(element).slideIn(1000, doneFn);
 * ***REMOVED***
 *   ***REMOVED***
 * ***REMOVED***]);
 * ```
 *
 * ```css
 * .slide.ng-enter {
 *   transition:0.5s linear all;
 *   transform:translateY(-100px);
 * ***REMOVED***
 * .slide.ng-enter.ng-enter-active {
 *   transform:translateY(0);
 * ***REMOVED***
 * ```
 *
 * Does this mean that CSS and JS animations cannot be used together? Do JS-based animations always have higher priority? We can make up for the
 * lack of CSS animations by using the `$animateCss` service to trigger our own tweaked-out, CSS-based animations directly from
 * our own JS-based animation code:
 *
 * ```js
 * myModule.animation('.slide', ['$animateCss', function($animateCss) {
 *   return {
 *     enter: function(element) {
*    ***REMOVED*** this will trigger `.slide.ng-enter` and `.slide.ng-enter-active`.
 *       return $animateCss(element, {
 *         event: 'enter',
 *         structural: true
 *   ***REMOVED***);
 * ***REMOVED***
 *   ***REMOVED***
 * ***REMOVED***]);
 * ```
 *
 * The nice thing here is that we can save bandwidth by sticking to our CSS-based animation code and we don't need to rely on a 3rd-party animation framework.
 *
 * The `$animateCss` service is very powerful since we can feed in all kinds of extra properties that will be evaluated and fed into a CSS transition or
 * keyframe animation. For example if we wanted to animate the height of an element while adding and removing classes then we can do so by providing that
 * data into `$animateCss` directly:
 *
 * ```js
 * myModule.animation('.slide', ['$animateCss', function($animateCss) {
 *   return {
 *     enter: function(element) {
 *       return $animateCss(element, {
 *         event: 'enter',
 *         structural: true,
 *         addClass: 'maroon-setting',
 *         from: { height:0 ***REMOVED***,
 *         to: { height: 200 ***REMOVED***
 *   ***REMOVED***);
 * ***REMOVED***
 *   ***REMOVED***
 * ***REMOVED***]);
 * ```
 *
 * Now we can fill in the rest via our transition CSS code:
 *
 * ```css
 * /&#42; the transition tells ngAnimate to make the animation happen &#42;/
 * .slide.ng-enter { transition:0.5s linear all; ***REMOVED***
 *
 * /&#42; this extra CSS class will be absorbed into the transition
 * since the $animateCss code is adding the class &#42;/
 * .maroon-setting { background:red; ***REMOVED***
 * ```
 *
 * And `$animateCss` will figure out the rest. Just make sure to have the `done()` callback fire the `doneFn` function to signal when the animation is over.
 *
 * To learn more about what's possible be sure to visit the {@link ngAnimate.$animateCss $animateCss service***REMOVED***.
 *
 * ## Animation Anchoring (via `ng-animate-ref`)
 *
 * ngAnimate in AngularJS 1.4 comes packed with the ability to cross-animate elements between
 * structural areas of an application (like views) by pairing up elements using an attribute
 * called `ng-animate-ref`.
 *
 * Let's say for example we have two views that are managed by `ng-view` and we want to show
 * that there is a relationship between two components situated in within these views. By using the
 * `ng-animate-ref` attribute we can identify that the two components are paired together and we
 * can then attach an animation, which is triggered when the view changes.
 *
 * Say for example we have the following template code:
 *
 * ```html
 * <!-- index.html -->
 * <div ng-view class="view-animation">
 * </div>
 *
 * <!-- home.html -->
 * <a href="#/banner-page">
 *   <img src="./banner.jpg" class="banner" ng-animate-ref="banner">
 * </a>
 *
 * <!-- banner-page.html -->
 * <img src="./banner.jpg" class="banner" ng-animate-ref="banner">
 * ```
 *
 * Now, when the view changes (once the link is clicked), ngAnimate will examine the
 * HTML contents to see if there is a match reference between any components in the view
 * that is leaving and the view that is entering. It will scan both the view which is being
 * removed (leave) and inserted (enter) to see if there are any paired DOM elements that
 * contain a matching ref value.
 *
 * The two images match since they share the same ref value. ngAnimate will now create a
 * transport element (which is a clone of the first image element) and it will then attempt
 * to animate to the position of the second image element in the next view. For the animation to
 * work a special CSS class called `ng-anchor` will be added to the transported element.
 *
 * We can now attach a transition onto the `.banner.ng-anchor` CSS class and then
 * ngAnimate will handle the entire transition for us as well as the addition and removal of
 * any changes of CSS classes between the elements:
 *
 * ```css
 * .banner.ng-anchor {
 *   /&#42; this animation will last for 1 second since there are
 *          two phases to the animation (an `in` and an `out` phase) &#42;/
 *   transition:0.5s linear all;
 * ***REMOVED***
 * ```
 *
 * We also **must** include animations for the views that are being entered and removed
 * (otherwise anchoring wouldn't be possible since the new view would be inserted right away).
 *
 * ```css
 * .view-animation.ng-enter, .view-animation.ng-leave {
 *   transition:0.5s linear all;
 *   position:fixed;
 *   left:0;
 *   top:0;
 *   width:100%;
 * ***REMOVED***
 * .view-animation.ng-enter {
 *   transform:translateX(100%);
 * ***REMOVED***
 * .view-animation.ng-leave,
 * .view-animation.ng-enter.ng-enter-active {
 *   transform:translateX(0%);
 * ***REMOVED***
 * .view-animation.ng-leave.ng-leave-active {
 *   transform:translateX(-100%);
 * ***REMOVED***
 * ```
 *
 * Now we can jump back to the anchor animation. When the animation happens, there are two stages that occur:
 * an `out` and an `in` stage. The `out` stage happens first and that is when the element is animated away
 * from its origin. Once that animation is over then the `in` stage occurs which animates the
 * element to its destination. The reason why there are two animations is to give enough time
 * for the enter animation on the new element to be ready.
 *
 * The example above sets up a transition for both the in and out phases, but we can also target the out or
 * in phases directly via `ng-anchor-out` and `ng-anchor-in`.
 *
 * ```css
 * .banner.ng-anchor-out {
 *   transition: 0.5s linear all;
 *
 *   /&#42; the scale will be applied during the out animation,
 *          but will be animated away when the in animation runs &#42;/
 *   transform: scale(1.2);
 * ***REMOVED***
 *
 * .banner.ng-anchor-in {
 *   transition: 1s linear all;
 * ***REMOVED***
 * ```
 *
 *
 *
 *
 * ### Anchoring Demo
 *
  <example module="anchoringExample"
           name="anchoringExample"
           id="anchoringExample"
           deps="angular-animate.js;angular-route.js"
           animations="true">
    <file name="index.html">
      <a href="#/">Home</a>
      <hr />
      <div class="view-container">
        <div ng-view class="view"></div>
      </div>
    </file>
    <file name="script.js">
      angular.module('anchoringExample', ['ngAnimate', 'ngRoute'])
        .config(['$routeProvider', function($routeProvider) {
          $routeProvider.when('/', {
            templateUrl: 'home.html',
            controller: 'HomeController as home'
      ***REMOVED***);
          $routeProvider.when('/profile/:id', {
            templateUrl: 'profile.html',
            controller: 'ProfileController as profile'
      ***REMOVED***);
    ***REMOVED***])
        .run(['$rootScope', function($rootScope) {
          $rootScope.records = [
            { id:1, title: "Miss Beulah Roob" ***REMOVED***,
            { id:2, title: "Trent Morissette" ***REMOVED***,
            { id:3, title: "Miss Ava Pouros" ***REMOVED***,
            { id:4, title: "Rod Pouros" ***REMOVED***,
            { id:5, title: "Abdul Rice" ***REMOVED***,
            { id:6, title: "Laurie Rutherford Sr." ***REMOVED***,
            { id:7, title: "Nakia McLaughlin" ***REMOVED***,
            { id:8, title: "Jordon Blanda DVM" ***REMOVED***,
            { id:9, title: "Rhoda Hand" ***REMOVED***,
            { id:10, title: "Alexandrea Sauer" ***REMOVED***
          ];
    ***REMOVED***])
        .controller('HomeController', [function() {
      ***REMOVED***empty
    ***REMOVED***])
        .controller('ProfileController', ['$rootScope', '$routeParams', function($rootScope, $routeParams) {
          var index = parseInt($routeParams.id, 10);
          var record = $rootScope.records[index - 1];

          this.title = record.title;
          this.id = record.id;
    ***REMOVED***]);
    </file>
    <file name="home.html">
      <h2>Welcome to the home page</h1>
      <p>Please click on an element</p>
      <a class="record"
         ng-href="#/profile/{{ record.id ***REMOVED******REMOVED***"
         ng-animate-ref="{{ record.id ***REMOVED******REMOVED***"
         ng-repeat="record in records">
        {{ record.title ***REMOVED******REMOVED***
      </a>
    </file>
    <file name="profile.html">
      <div class="profile record" ng-animate-ref="{{ profile.id ***REMOVED******REMOVED***">
        {{ profile.title ***REMOVED******REMOVED***
      </div>
    </file>
    <file name="animations.css">
      .record {
        display:block;
        font-size:20px;
  ***REMOVED***
      .profile {
        background:black;
        color:white;
        font-size:100px;
  ***REMOVED***
      .view-container {
        position:relative;
  ***REMOVED***
      .view-container > .view.ng-animate {
        position:absolute;
        top:0;
        left:0;
        width:100%;
        min-height:500px;
  ***REMOVED***
      .view.ng-enter, .view.ng-leave,
      .record.ng-anchor {
        transition:0.5s linear all;
  ***REMOVED***
      .view.ng-enter {
        transform:translateX(100%);
  ***REMOVED***
      .view.ng-enter.ng-enter-active, .view.ng-leave {
        transform:translateX(0%);
  ***REMOVED***
      .view.ng-leave.ng-leave-active {
        transform:translateX(-100%);
  ***REMOVED***
      .record.ng-anchor-out {
        background:red;
  ***REMOVED***
    </file>
  </example>
 *
 * ### How is the element transported?
 *
 * When an anchor animation occurs, ngAnimate will clone the starting element and position it exactly where the starting
 * element is located on screen via absolute positioning. The cloned element will be placed inside of the root element
 * of the application (where ng-app was defined) and all of the CSS classes of the starting element will be applied. The
 * element will then animate into the `out` and `in` animations and will eventually reach the coordinates and match
 * the dimensions of the destination element. During the entire animation a CSS class of `.ng-animate-shim` will be applied
 * to both the starting and destination elements in order to hide them from being visible (the CSS styling for the class
 * is: `visibility:hidden`). Once the anchor reaches its destination then it will be removed and the destination element
 * will become visible since the shim class will be removed.
 *
 * ### How is the morphing handled?
 *
 * CSS Anchoring relies on transitions and keyframes and the internal code is intelligent enough to figure out
 * what CSS classes differ between the starting element and the destination element. These different CSS classes
 * will be added/removed on the anchor element and a transition will be applied (the transition that is provided
 * in the anchor class). Long story short, ngAnimate will figure out what classes to add and remove which will
 * make the transition of the element as smooth and automatic as possible. Be sure to use simple CSS classes that
 * do not rely on DOM nesting structure so that the anchor element appears the same as the starting element (since
 * the cloned element is placed inside of root element which is likely close to the body element).
 *
 * Note that if the root element is on the `<html>` element then the cloned node will be placed inside of body.
 *
 *
 * ## Using $animate in your directive code
 *
 * So far we've explored how to feed in animations into an Angular application, but how do we trigger animations within our own directives in our application?
 * By injecting the `$animate` service into our directive code, we can trigger structural and class-based hooks which can then be consumed by animations. Let's
 * imagine we have a greeting box that shows and hides itself when the data changes
 *
 * ```html
 * <greeting-box active="onOrOff">Hi there</greeting-box>
 * ```
 *
 * ```js
 * ngModule.directive('greetingBox', ['$animate', function($animate) {
 *   return function(scope, element, attrs) {
 *     attrs.$observe('active', function(value) {
 *       value ? $animate.addClass(element, 'on') : $animate.removeClass(element, 'on');
 * ***REMOVED***);
 *   ***REMOVED***);
 * ***REMOVED***]);
 * ```
 *
 * Now the `on` CSS class is added and removed on the greeting box component. Now if we add a CSS class on top of the greeting box element
 * in our HTML code then we can trigger a CSS or JS animation to happen.
 *
 * ```css
 * /&#42; normally we would create a CSS class to reference on the element &#42;/
 * greeting-box.on { transition:0.5s linear all; background:green; color:white; ***REMOVED***
 * ```
 *
 * The `$animate` service contains a variety of other methods like `enter`, `leave`, `animate` and `setClass`. To learn more about what's
 * possible be sure to visit the {@link ng.$animate $animate service API page***REMOVED***.
 *
 *
 * ### Preventing Collisions With Third Party Libraries
 *
 * Some third-party frameworks place animation duration defaults across many element or className
 * selectors in order to make their code small and reuseable. This can lead to issues with ngAnimate, which
 * is expecting actual animations on these elements and has to wait for their completion.
 *
 * You can prevent this unwanted behavior by using a prefix on all your animation classes:
 *
 * ```css
 * /&#42; prefixed with animate- &#42;/
 * .animate-fade-add.animate-fade-add-active {
 *   transition:1s linear all;
 *   opacity:0;
 * ***REMOVED***
 * ```
 *
 * You then configure `$animate` to enforce this prefix:
 *
 * ```js
 * $animateProvider.classNameFilter(/animate-/);
 * ```
 *
 * This also may provide your application with a speed boost since only specific elements containing CSS class prefix
 * will be evaluated for animation when any DOM changes occur in the application.
 *
 * ## Callbacks and Promises
 *
 * When `$animate` is called it returns a promise that can be used to capture when the animation has ended. Therefore if we were to trigger
 * an animation (within our directive code) then we can continue performing directive and scope related activities after the animation has
 * ended by chaining onto the returned promise that animation method returns.
 *
 * ```js
 * // somewhere within the depths of the directive
 * $animate.enter(element, parent).then(function() {
 *   //the animation has completed
 * ***REMOVED***);
 * ```
 *
 * (Note that earlier versions of Angular prior to v1.4 required the promise code to be wrapped using `$scope.$apply(...)`. This is not the case
 * anymore.)
 *
 * In addition to the animation promise, we can also make use of animation-related callbacks within our directives and controller code by registering
 * an event listener using the `$animate` service. Let's say for example that an animation was triggered on our view
 * routing controller to hook into that:
 *
 * ```js
 * ngModule.controller('HomePageController', ['$animate', function($animate) {
 *   $animate.on('enter', ngViewElement, function(element) {
 * ***REMOVED*** the animation for this route has completed
 *   ***REMOVED***]);
 * ***REMOVED***])
 * ```
 *
 * (Note that you will need to trigger a digest within the callback to get angular to notice any scope-related changes.)
 */

/**
 * @ngdoc service
 * @name $animate
 * @kind object
 *
 * @description
 * The ngAnimate `$animate` service documentation is the same for the core `$animate` service.
 *
 * Click here {@link ng.$animate to learn more about animations with `$animate`***REMOVED***.
 */
angular.module('ngAnimate', [])
  .directive('ngAnimateSwap', ngAnimateSwapDirective)

  .directive('ngAnimateChildren', $$AnimateChildrenDirective)
  .factory('$$rAFScheduler', $$rAFSchedulerFactory)

  .provider('$$animateQueue', $$AnimateQueueProvider)
  .provider('$$animation', $$AnimationProvider)

  .provider('$animateCss', $AnimateCssProvider)
  .provider('$$animateCssDriver', $$AnimateCssDriverProvider)

  .provider('$$animateJs', $$AnimateJsProvider)
  .provider('$$animateJsDriver', $$AnimateJsDriverProvider);


***REMOVED***)(window, window.angular);
