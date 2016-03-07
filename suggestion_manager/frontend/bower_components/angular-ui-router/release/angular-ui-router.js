/**
 * State-based routing for AngularJS
 * @version v0.2.18
 * @link http://angular-ui.github.com/
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

/* commonjs package manager support (eg componentjs) */
if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports){
  module.exports = 'ui.router';
***REMOVED***

(function (window, angular, undefined) {
/*jshint globalstrict:true*/
/*global angular:false*/
'use strict';

var isDefined = angular.isDefined,
    isFunction = angular.isFunction,
    isString = angular.isString,
    isObject = angular.isObject,
    isArray = angular.isArray,
    forEach = angular.forEach,
    extend = angular.extend,
    copy = angular.copy,
    toJson = angular.toJson;

function inherit(parent, extra) {
  return extend(new (extend(function() {***REMOVED***, { prototype: parent ***REMOVED***))(), extra);
***REMOVED***

function merge(dst) {
  forEach(arguments, function(obj) {
    if (obj !== dst) {
      forEach(obj, function(value, key) {
        if (!dst.hasOwnProperty(key)) dst[key] = value;
  ***REMOVED***);
***REMOVED***
  ***REMOVED***);
  return dst;
***REMOVED***

/**
 * Finds the common ancestor path between two states.
 *
 * @param {Object***REMOVED*** first The first state.
 * @param {Object***REMOVED*** second The second state.
 * @return {Array***REMOVED*** Returns an array of state names in descending order, not including the root.
 */
function ancestors(first, second) {
  var path = [];

  for (var n in first.path) {
    if (first.path[n] !== second.path[n]) break;
    path.push(first.path[n]);
  ***REMOVED***
  return path;
***REMOVED***

/**
 * IE8-safe wrapper for `Object.keys()`.
 *
 * @param {Object***REMOVED*** object A JavaScript object.
 * @return {Array***REMOVED*** Returns the keys of the object as an array.
 */
function objectKeys(object) {
  if (Object.keys) {
    return Object.keys(object);
  ***REMOVED***
  var result = [];

  forEach(object, function(val, key) {
    result.push(key);
  ***REMOVED***);
  return result;
***REMOVED***

/**
 * IE8-safe wrapper for `Array.prototype.indexOf()`.
 *
 * @param {Array***REMOVED*** array A JavaScript array.
 * @param {****REMOVED*** value A value to search the array for.
 * @return {Number***REMOVED*** Returns the array index value of `value`, or `-1` if not present.
 */
function indexOf(array, value) {
  if (Array.prototype.indexOf) {
    return array.indexOf(value, Number(arguments[2]) || 0);
  ***REMOVED***
  var len = array.length >>> 0, from = Number(arguments[2]) || 0;
  from = (from < 0) ? Math.ceil(from) : Math.floor(from);

  if (from < 0) from += len;

  for (; from < len; from++) {
    if (from in array && array[from] === value) return from;
  ***REMOVED***
  return -1;
***REMOVED***

/**
 * Merges a set of parameters with all parameters inherited between the common parents of the
 * current state and a given destination state.
 *
 * @param {Object***REMOVED*** currentParams The value of the current state parameters ($stateParams).
 * @param {Object***REMOVED*** newParams The set of parameters which will be composited with inherited params.
 * @param {Object***REMOVED*** $current Internal definition of object representing the current state.
 * @param {Object***REMOVED*** $to Internal definition of object representing state to transition to.
 */
function inheritParams(currentParams, newParams, $current, $to) {
  var parents = ancestors($current, $to), parentParams, inherited = {***REMOVED***, inheritList = [];

  for (var i in parents) {
    if (!parents[i] || !parents[i].params) continue;
    parentParams = objectKeys(parents[i].params);
    if (!parentParams.length) continue;

    for (var j in parentParams) {
      if (indexOf(inheritList, parentParams[j]) >= 0) continue;
      inheritList.push(parentParams[j]);
      inherited[parentParams[j]] = currentParams[parentParams[j]];
***REMOVED***
  ***REMOVED***
  return extend({***REMOVED***, inherited, newParams);
***REMOVED***

/**
 * Performs a non-strict comparison of the subset of two objects, defined by a list of keys.
 *
 * @param {Object***REMOVED*** a The first object.
 * @param {Object***REMOVED*** b The second object.
 * @param {Array***REMOVED*** keys The list of keys within each object to compare. If the list is empty or not specified,
 *                     it defaults to the list of keys in `a`.
 * @return {Boolean***REMOVED*** Returns `true` if the keys match, otherwise `false`.
 */
function equalForKeys(a, b, keys) {
  if (!keys) {
    keys = [];
    for (var n in a) keys.push(n); // Used instead of Object.keys() for IE8 compatibility
  ***REMOVED***

  for (var i=0; i<keys.length; i++) {
    var k = keys[i];
    if (a[k] != b[k]) return false; // Not '===', values aren't necessarily normalized
  ***REMOVED***
  return true;
***REMOVED***

/**
 * Returns the subset of an object, based on a list of keys.
 *
 * @param {Array***REMOVED*** keys
 * @param {Object***REMOVED*** values
 * @return {Boolean***REMOVED*** Returns a subset of `values`.
 */
function filterByKeys(keys, values) {
  var filtered = {***REMOVED***;

  forEach(keys, function (name) {
    filtered[name] = values[name];
  ***REMOVED***);
  return filtered;
***REMOVED***

// like _.indexBy
// when you know that your index values will be unique, or you want last-one-in to win
function indexBy(array, propName) {
  var result = {***REMOVED***;
  forEach(array, function(item) {
    result[item[propName]] = item;
  ***REMOVED***);
  return result;
***REMOVED***

// extracted from underscore.js
// Return a copy of the object only containing the whitelisted properties.
function pick(obj) {
  var copy = {***REMOVED***;
  var keys = Array.prototype.concat.apply(Array.prototype, Array.prototype.slice.call(arguments, 1));
  forEach(keys, function(key) {
    if (key in obj) copy[key] = obj[key];
  ***REMOVED***);
  return copy;
***REMOVED***

// extracted from underscore.js
// Return a copy of the object omitting the blacklisted properties.
function omit(obj) {
  var copy = {***REMOVED***;
  var keys = Array.prototype.concat.apply(Array.prototype, Array.prototype.slice.call(arguments, 1));
  for (var key in obj) {
    if (indexOf(keys, key) == -1) copy[key] = obj[key];
  ***REMOVED***
  return copy;
***REMOVED***

function pluck(collection, key) {
  var result = isArray(collection) ? [] : {***REMOVED***;

  forEach(collection, function(val, i) {
    result[i] = isFunction(key) ? key(val) : val[key];
  ***REMOVED***);
  return result;
***REMOVED***

function filter(collection, callback) {
  var array = isArray(collection);
  var result = array ? [] : {***REMOVED***;
  forEach(collection, function(val, i) {
    if (callback(val, i)) {
      result[array ? result.length : i] = val;
***REMOVED***
  ***REMOVED***);
  return result;
***REMOVED***

function map(collection, callback) {
  var result = isArray(collection) ? [] : {***REMOVED***;

  forEach(collection, function(val, i) {
    result[i] = callback(val, i);
  ***REMOVED***);
  return result;
***REMOVED***

/**
 * @ngdoc overview
 * @name ui.router.util
 *
 * @description
 * # ui.router.util sub-module
 *
 * This module is a dependency of other sub-modules. Do not include this module as a dependency
 * in your angular app (use {@link ui.router***REMOVED*** module instead).
 *
 */
angular.module('ui.router.util', ['ng']);

/**
 * @ngdoc overview
 * @name ui.router.router
 * 
 * @requires ui.router.util
 *
 * @description
 * # ui.router.router sub-module
 *
 * This module is a dependency of other sub-modules. Do not include this module as a dependency
 * in your angular app (use {@link ui.router***REMOVED*** module instead).
 */
angular.module('ui.router.router', ['ui.router.util']);

/**
 * @ngdoc overview
 * @name ui.router.state
 * 
 * @requires ui.router.router
 * @requires ui.router.util
 *
 * @description
 * # ui.router.state sub-module
 *
 * This module is a dependency of the main ui.router module. Do not include this module as a dependency
 * in your angular app (use {@link ui.router***REMOVED*** module instead).
 * 
 */
angular.module('ui.router.state', ['ui.router.router', 'ui.router.util']);

/**
 * @ngdoc overview
 * @name ui.router
 *
 * @requires ui.router.state
 *
 * @description
 * # ui.router
 * 
 * ## The main module for ui.router 
 * There are several sub-modules included with the ui.router module, however only this module is needed
 * as a dependency within your angular app. The other modules are for organization purposes. 
 *
 * The modules are:
 * * ui.router - the main "umbrella" module
 * * ui.router.router - 
 * 
 * *You'll need to include **only** this module as the dependency within your angular app.*
 * 
 * <pre>
 * <!doctype html>
 * <html ng-app="myApp">
 * <head>
 *   <script src="js/angular.js"></script>
 *   <!-- Include the ui-router script -->
 *   <script src="js/angular-ui-router.min.js"></script>
 *   <script>
 * ***REMOVED*** ...and add 'ui.router' as a dependency
 *     var myApp = angular.module('myApp', ['ui.router']);
 *   </script>
 * </head>
 * <body>
 * </body>
 * </html>
 * </pre>
 */
angular.module('ui.router', ['ui.router.state']);

angular.module('ui.router.compat', ['ui.router']);

/**
 * @ngdoc object
 * @name ui.router.util.$resolve
 *
 * @requires $q
 * @requires $injector
 *
 * @description
 * Manages resolution of (acyclic) graphs of promises.
 */
$Resolve.$inject = ['$q', '$injector'];
function $Resolve(  $q,    $injector) {
  
  var VISIT_IN_PROGRESS = 1,
      VISIT_DONE = 2,
      NOTHING = {***REMOVED***,
      NO_DEPENDENCIES = [],
      NO_LOCALS = NOTHING,
      NO_PARENT = extend($q.when(NOTHING), { $$promises: NOTHING, $$values: NOTHING ***REMOVED***);
  

  /**
   * @ngdoc function
   * @name ui.router.util.$resolve#study
   * @methodOf ui.router.util.$resolve
   *
   * @description
   * Studies a set of invocables that are likely to be used multiple times.
   * <pre>
   * $resolve.study(invocables)(locals, parent, self)
   * </pre>
   * is equivalent to
   * <pre>
   * $resolve.resolve(invocables, locals, parent, self)
   * </pre>
   * but the former is more efficient (in fact `resolve` just calls `study` 
   * internally).
   *
   * @param {object***REMOVED*** invocables Invocable objects
   * @return {function***REMOVED*** a function to pass in locals, parent and self
   */
  this.study = function (invocables) {
    if (!isObject(invocables)) throw new Error("'invocables' must be an object");
    var invocableKeys = objectKeys(invocables || {***REMOVED***);
    
***REMOVED*** Perform a topological sort of invocables to build an ordered plan
    var plan = [], cycle = [], visited = {***REMOVED***;
    function visit(value, key) {
      if (visited[key] === VISIT_DONE) return;
      
      cycle.push(key);
      if (visited[key] === VISIT_IN_PROGRESS) {
        cycle.splice(0, indexOf(cycle, key));
        throw new Error("Cyclic dependency: " + cycle.join(" -> "));
  ***REMOVED***
      visited[key] = VISIT_IN_PROGRESS;
      
      if (isString(value)) {
        plan.push(key, [ function() { return $injector.get(value); ***REMOVED***], NO_DEPENDENCIES);
  ***REMOVED*** ***REMOVED***
        var params = $injector.annotate(value);
        forEach(params, function (param) {
          if (param !== key && invocables.hasOwnProperty(param)) visit(invocables[param], param);
    ***REMOVED***);
        plan.push(key, value, params);
  ***REMOVED***
      
      cycle.pop();
      visited[key] = VISIT_DONE;
***REMOVED***
    forEach(invocables, visit);
    invocables = cycle = visited = null; // plan is all that's required
    
    function isResolve(value) {
      return isObject(value) && value.then && value.$$promises;
***REMOVED***
    
    return function (locals, parent, self) {
      if (isResolve(locals) && self === undefined) {
        self = parent; parent = locals; locals = null;
  ***REMOVED***
      if (!locals) locals = NO_LOCALS;
      else if (!isObject(locals)) {
        throw new Error("'locals' must be an object");
  ***REMOVED***       
      if (!parent) parent = NO_PARENT;
      else if (!isResolve(parent)) {
        throw new Error("'parent' must be a promise returned by $resolve.resolve()");
  ***REMOVED***
      
  ***REMOVED*** To complete the overall resolution, we have to wait for the parent
  ***REMOVED*** promise and for the promise for each invokable in our plan.
      var resolution = $q.defer(),
          result = resolution.promise,
          promises = result.$$promises = {***REMOVED***,
          values = extend({***REMOVED***, locals),
          wait = 1 + plan.length/3,
          merged = false;
          
      function done() {
    ***REMOVED*** Merge parent values we haven't got yet and publish our own $$values
        if (!--wait) {
          if (!merged) merge(values, parent.$$values); 
          result.$$values = values;
          result.$$promises = result.$$promises || true; // keep for isResolve()
          delete result.$$inheritedValues;
          resolution.resolve(values);
    ***REMOVED***
  ***REMOVED***
      
      function fail(reason) {
        result.$$failure = reason;
        resolution.reject(reason);
  ***REMOVED***

  ***REMOVED*** Short-circuit if parent has already failed
      if (isDefined(parent.$$failure)) {
        fail(parent.$$failure);
        return result;
  ***REMOVED***
      
      if (parent.$$inheritedValues) {
        merge(values, omit(parent.$$inheritedValues, invocableKeys));
  ***REMOVED***

  ***REMOVED*** Merge parent values if the parent has already resolved, or merge
  ***REMOVED*** parent promises and wait if the parent resolve is still in progress.
      extend(promises, parent.$$promises);
      if (parent.$$values) {
        merged = merge(values, omit(parent.$$values, invocableKeys));
        result.$$inheritedValues = omit(parent.$$values, invocableKeys);
        done();
  ***REMOVED*** ***REMOVED***
        if (parent.$$inheritedValues) {
          result.$$inheritedValues = omit(parent.$$inheritedValues, invocableKeys);
    ***REMOVED***        
        parent.then(done, fail);
  ***REMOVED***
      
  ***REMOVED*** Process each invocable in the plan, but ignore any where a local of the same name exists.
      for (var i=0, ii=plan.length; i<ii; i+=3) {
        if (locals.hasOwnProperty(plan[i])) done();
        else invoke(plan[i], plan[i+1], plan[i+2]);
  ***REMOVED***
      
      function invoke(key, invocable, params) {
    ***REMOVED*** Create a deferred for this invocation. Failures will propagate to the resolution as well.
        var invocation = $q.defer(), waitParams = 0;
        function onfailure(reason) {
          invocation.reject(reason);
          fail(reason);
    ***REMOVED***
    ***REMOVED*** Wait for any parameter that we have a promise for (either from parent or from this
    ***REMOVED*** resolve; in that case study() will have made sure it's ordered before us in the plan).
        forEach(params, function (dep) {
          if (promises.hasOwnProperty(dep) && !locals.hasOwnProperty(dep)) {
            waitParams++;
            promises[dep].then(function (result) {
              values[dep] = result;
              if (!(--waitParams)) proceed();
        ***REMOVED***, onfailure);
      ***REMOVED***
    ***REMOVED***);
        if (!waitParams) proceed();
        function proceed() {
          if (isDefined(result.$$failure)) return;
      ***REMOVED***
            invocation.resolve($injector.invoke(invocable, self, values));
            invocation.promise.then(function (result) {
              values[key] = result;
              done();
        ***REMOVED***, onfailure);
      ***REMOVED*** catch (e) {
            onfailure(e);
      ***REMOVED***
    ***REMOVED***
    ***REMOVED*** Publish promise synchronously; invocations further down in the plan may depend on it.
        promises[key] = invocation.promise;
  ***REMOVED***
      
      return result;
***REMOVED***;
  ***REMOVED***;
  
  /**
   * @ngdoc function
   * @name ui.router.util.$resolve#resolve
   * @methodOf ui.router.util.$resolve
   *
   * @description
   * Resolves a set of invocables. An invocable is a function to be invoked via 
   * `$injector.invoke()`, and can have an arbitrary number of dependencies. 
   * An invocable can either return a value directly,
   * or a `$q` promise. If a promise is returned it will be resolved and the 
   * resulting value will be used instead. Dependencies of invocables are resolved 
   * (in this order of precedence)
   *
   * - from the specified `locals`
   * - from another invocable that is part of this `$resolve` call
   * - from an invocable that is inherited from a `parent` call to `$resolve` 
   *   (or recursively
   * - from any ancestor `$resolve` of that parent).
   *
   * The return value of `$resolve` is a promise for an object that contains 
   * (in this order of precedence)
   *
   * - any `locals` (if specified)
   * - the resolved return values of all injectables
   * - any values inherited from a `parent` call to `$resolve` (if specified)
   *
   * The promise will resolve after the `parent` promise (if any) and all promises 
   * returned by injectables have been resolved. If any invocable 
   * (or `$injector.invoke`) throws an exception, or if a promise returned by an 
   * invocable is rejected, the `$resolve` promise is immediately rejected with the 
   * same error. A rejection of a `parent` promise (if specified) will likewise be 
   * propagated immediately. Once the `$resolve` promise has been rejected, no 
   * further invocables will be called.
   * 
   * Cyclic dependencies between invocables are not permitted and will cause `$resolve`
   * to throw an error. As a special case, an injectable can depend on a parameter 
   * with the same name as the injectable, which will be fulfilled from the `parent` 
   * injectable of the same name. This allows inherited values to be decorated. 
   * Note that in this case any other injectable in the same `$resolve` with the same
   * dependency would see the decorated value, not the inherited value.
   *
   * Note that missing dependencies -- unlike cyclic dependencies -- will cause an 
   * (asynchronous) rejection of the `$resolve` promise rather than a (synchronous) 
   * exception.
   *
   * Invocables are invoked eagerly as soon as all dependencies are available. 
   * This is true even for dependencies inherited from a `parent` call to `$resolve`.
   *
   * As a special case, an invocable can be a string, in which case it is taken to 
   * be a service name to be passed to `$injector.get()`. This is supported primarily 
   * for backwards-compatibility with the `resolve` property of `$routeProvider` 
   * routes.
   *
   * @param {object***REMOVED*** invocables functions to invoke or 
   * `$injector` services to fetch.
   * @param {object***REMOVED*** locals  values to make available to the injectables
   * @param {object***REMOVED*** parent  a promise returned by another call to `$resolve`.
   * @param {object***REMOVED*** self  the `this` for the invoked methods
   * @return {object***REMOVED*** Promise for an object that contains the resolved return value
   * of all invocables, as well as any inherited and local values.
   */
  this.resolve = function (invocables, locals, parent, self) {
    return this.study(invocables)(locals, parent, self);
  ***REMOVED***;
***REMOVED***

angular.module('ui.router.util').service('$resolve', $Resolve);


/**
 * @ngdoc object
 * @name ui.router.util.$templateFactory
 *
 * @requires $http
 * @requires $templateCache
 * @requires $injector
 *
 * @description
 * Service. Manages loading of templates.
 */
$TemplateFactory.$inject = ['$http', '$templateCache', '$injector'];
function $TemplateFactory(  $http,   $templateCache,   $injector) {

  /**
   * @ngdoc function
   * @name ui.router.util.$templateFactory#fromConfig
   * @methodOf ui.router.util.$templateFactory
   *
   * @description
   * Creates a template from a configuration object. 
   *
   * @param {object***REMOVED*** config Configuration object for which to load a template. 
   * The following properties are search in the specified order, and the first one 
   * that is defined is used to create the template:
   *
   * @param {string|object***REMOVED*** config.template html string template or function to 
   * load via {@link ui.router.util.$templateFactory#fromString fromString***REMOVED***.
   * @param {string|object***REMOVED*** config.templateUrl url to load or a function returning 
   * the url to load via {@link ui.router.util.$templateFactory#fromUrl fromUrl***REMOVED***.
   * @param {Function***REMOVED*** config.templateProvider function to invoke via 
   * {@link ui.router.util.$templateFactory#fromProvider fromProvider***REMOVED***.
   * @param {object***REMOVED*** params  Parameters to pass to the template function.
   * @param {object***REMOVED*** locals Locals to pass to `invoke` if the template is loaded 
   * via a `templateProvider`. Defaults to `{ params: params ***REMOVED***`.
   *
   * @return {string|object***REMOVED***  The template html as a string, or a promise for 
   * that string,or `null` if no template is configured.
   */
  this.fromConfig = function (config, params, locals) {
    return (
      isDefined(config.template) ? this.fromString(config.template, params) :
      isDefined(config.templateUrl) ? this.fromUrl(config.templateUrl, params) :
      isDefined(config.templateProvider) ? this.fromProvider(config.templateProvider, params, locals) :
      null
    );
  ***REMOVED***;

  /**
   * @ngdoc function
   * @name ui.router.util.$templateFactory#fromString
   * @methodOf ui.router.util.$templateFactory
   *
   * @description
   * Creates a template from a string or a function returning a string.
   *
   * @param {string|object***REMOVED*** template html template as a string or function that 
   * returns an html template as a string.
   * @param {object***REMOVED*** params Parameters to pass to the template function.
   *
   * @return {string|object***REMOVED*** The template html as a string, or a promise for that 
   * string.
   */
  this.fromString = function (template, params) {
    return isFunction(template) ? template(params) : template;
  ***REMOVED***;

  /**
   * @ngdoc function
   * @name ui.router.util.$templateFactory#fromUrl
   * @methodOf ui.router.util.$templateFactory
   * 
   * @description
   * Loads a template from the a URL via `$http` and `$templateCache`.
   *
   * @param {string|Function***REMOVED*** url url of the template to load, or a function 
   * that returns a url.
   * @param {Object***REMOVED*** params Parameters to pass to the url function.
   * @return {string|Promise.<string>***REMOVED*** The template html as a string, or a promise 
   * for that string.
   */
  this.fromUrl = function (url, params) {
    if (isFunction(url)) url = url(params);
    if (url == null) return null;
    else return $http
        .get(url, { cache: $templateCache, headers: { Accept: 'text/html' ***REMOVED******REMOVED***)
        .then(function(response) { return response.data; ***REMOVED***);
  ***REMOVED***;

  /**
   * @ngdoc function
   * @name ui.router.util.$templateFactory#fromProvider
   * @methodOf ui.router.util.$templateFactory
   *
   * @description
   * Creates a template by invoking an injectable provider function.
   *
   * @param {Function***REMOVED*** provider Function to invoke via `$injector.invoke`
   * @param {Object***REMOVED*** params Parameters for the template.
   * @param {Object***REMOVED*** locals Locals to pass to `invoke`. Defaults to 
   * `{ params: params ***REMOVED***`.
   * @return {string|Promise.<string>***REMOVED*** The template html as a string, or a promise 
   * for that string.
   */
  this.fromProvider = function (provider, params, locals) {
    return $injector.invoke(provider, null, locals || { params: params ***REMOVED***);
  ***REMOVED***;
***REMOVED***

angular.module('ui.router.util').service('$templateFactory', $TemplateFactory);

var $$UMFP; // reference to $UrlMatcherFactoryProvider

/**
 * @ngdoc object
 * @name ui.router.util.type:UrlMatcher
 *
 * @description
 * Matches URLs against patterns and extracts named parameters from the path or the search
 * part of the URL. A URL pattern consists of a path pattern, optionally followed by '?' and a list
 * of search parameters. Multiple search parameter names are separated by '&'. Search parameters
 * do not influence whether or not a URL is matched, but their values are passed through into
 * the matched parameters returned by {@link ui.router.util.type:UrlMatcher#methods_exec exec***REMOVED***.
 *
 * Path parameter placeholders can be specified using simple colon/catch-all syntax or curly brace
 * syntax, which optionally allows a regular expression for the parameter to be specified:
 *
 * * `':'` name - colon placeholder
 * * `'*'` name - catch-all placeholder
 * * `'{' name '***REMOVED***'` - curly placeholder
 * * `'{' name ':' regexp|type '***REMOVED***'` - curly placeholder with regexp or type name. Should the
 *   regexp itself contain curly braces, they must be in matched pairs or escaped with a backslash.
 *
 * Parameter names may contain only word characters (latin letters, digits, and underscore) and
 * must be unique within the pattern (across both path and search parameters). For colon
 * placeholders or curly placeholders without an explicit regexp, a path parameter matches any
 * number of characters other than '/'. For catch-all placeholders the path parameter matches
 * any number of characters.
 *
 * Examples:
 *
 * * `'/hello/'` - Matches only if the path is exactly '/hello/'. There is no special treatment for
 *   trailing slashes, and patterns have to match the entire path, not just a prefix.
 * * `'/user/:id'` - Matches '/user/bob' or '/user/1234!!!' or even '/user/' but not '/user' or
 *   '/user/bob/details'. The second path segment will be captured as the parameter 'id'.
 * * `'/user/{id***REMOVED***'` - Same as the previous example, but using curly brace syntax.
 * * `'/user/{id:[^/]****REMOVED***'` - Same as the previous example.
 * * `'/user/{id:[0-9a-fA-F]{1,8***REMOVED******REMOVED***'` - Similar to the previous example, but only matches if the id
 *   parameter consists of 1 to 8 hex digits.
 * * `'/files/{path:.****REMOVED***'` - Matches any URL starting with '/files/' and captures the rest of the
 *   path into the parameter 'path'.
 * * `'/files/*path'` - ditto.
 * * `'/calendar/{start:date***REMOVED***'` - Matches "/calendar/2014-11-12" (because the pattern defined
 *   in the built-in  `date` Type matches `2014-11-12`) and provides a Date object in $stateParams.start
 *
 * @param {string***REMOVED*** pattern  The pattern to compile into a matcher.
 * @param {Object***REMOVED*** config  A configuration object hash:
 * @param {Object=***REMOVED*** parentMatcher Used to concatenate the pattern/config onto
 *   an existing UrlMatcher
 *
 * * `caseInsensitive` - `true` if URL matching should be case insensitive, otherwise `false`, the default value (for backward compatibility) is `false`.
 * * `strict` - `false` if matching against a URL with a trailing slash should be treated as equivalent to a URL without a trailing slash, the default value is `true`.
 *
 * @property {string***REMOVED*** prefix  A static prefix of this pattern. The matcher guarantees that any
 *   URL matching this matcher (i.e. any string for which {@link ui.router.util.type:UrlMatcher#methods_exec exec()***REMOVED*** returns
 *   non-null) will start with this prefix.
 *
 * @property {string***REMOVED*** source  The pattern that was passed into the constructor
 *
 * @property {string***REMOVED*** sourcePath  The path portion of the source property
 *
 * @property {string***REMOVED*** sourceSearch  The search portion of the source property
 *
 * @property {string***REMOVED*** regex  The constructed regex that will be used to match against the url when
 *   it is time to determine which url will match.
 *
 * @returns {Object***REMOVED***  New `UrlMatcher` object
 */
function UrlMatcher(pattern, config, parentMatcher) {
  config = extend({ params: {***REMOVED*** ***REMOVED***, isObject(config) ? config : {***REMOVED***);

  // Find all placeholders and create a compiled pattern, using either classic or curly syntax:
  //   '*' name
  //   ':' name
  //   '{' name '***REMOVED***'
  //   '{' name ':' regexp '***REMOVED***'
  // The regular expression is somewhat complicated due to the need to allow curly braces
  // inside the regular expression. The placeholder regexp breaks down as follows:
  //    ([:*])([\w\[\]]+)              - classic placeholder ($1 / $2) (search version has - for snake-case)
  //    \{([\w\[\]]+)(?:\:\s*( ... ))?\***REMOVED***  - curly brace placeholder ($3) with optional regexp/type ... ($4) (search version has - for snake-case
  //    (?: ... | ... | ... )+         - the regexp consists of any number of atoms, an atom being either
  //    [^{***REMOVED***\\]+                       - anything other than curly braces or backslash
  //    \\.                            - a backslash escape
  //    \{(?:[^{***REMOVED***\\]+|\\.)*\***REMOVED***          - a matched set of curly braces containing other atoms
  var placeholder       = /([:*])([\w\[\]]+)|\{([\w\[\]]+)(?:\:\s*((?:[^{***REMOVED***\\]+|\\.|\{(?:[^{***REMOVED***\\]+|\\.)*\***REMOVED***)+))?\***REMOVED***/g,
      searchPlaceholder = /([:]?)([\w\[\].-]+)|\{([\w\[\].-]+)(?:\:\s*((?:[^{***REMOVED***\\]+|\\.|\{(?:[^{***REMOVED***\\]+|\\.)*\***REMOVED***)+))?\***REMOVED***/g,
      compiled = '^', last = 0, m,
      segments = this.segments = [],
      parentParams = parentMatcher ? parentMatcher.params : {***REMOVED***,
      params = this.params = parentMatcher ? parentMatcher.params.$$new() : new $$UMFP.ParamSet(),
      paramNames = [];

  function addParameter(id, type, config, location) {
    paramNames.push(id);
    if (parentParams[id]) return parentParams[id];
    if (!/^\w+([-.]+\w+)*(?:\[\])?$/.test(id)) throw new Error("Invalid parameter name '" + id + "' in pattern '" + pattern + "'");
    if (params[id]) throw new Error("Duplicate parameter name '" + id + "' in pattern '" + pattern + "'");
    params[id] = new $$UMFP.Param(id, type, config, location);
    return params[id];
  ***REMOVED***

  function quoteRegExp(string, pattern, squash, optional) {
    var surroundPattern = ['',''], result = string.replace(/[\\\[\]\^$*+?.()|{***REMOVED***]/g, "\\$&");
    if (!pattern) return result;
    switch(squash) {
      case false: surroundPattern = ['(', ')' + (optional ? "?" : "")]; break;
      case true:
        result = result.replace(/\/$/, '');
        surroundPattern = ['(?:\/(', ')|\/)?'];
      break;
      default:    surroundPattern = ['(' + squash + "|", ')?']; break;
***REMOVED***
    return result + surroundPattern[0] + pattern + surroundPattern[1];
  ***REMOVED***

  this.source = pattern;

  // Split into static segments separated by path parameter placeholders.
  // The number of segments is always 1 more than the number of parameters.
  function matchDetails(m, isSearch) {
    var id, regexp, segment, type, cfg, arrayMode;
    id          = m[2] || m[3]; // IE[78] returns '' for unmatched groups instead of null
    cfg         = config.params[id];
    segment     = pattern.substring(last, m.index);
    regexp      = isSearch ? m[4] : m[4] || (m[1] == '*' ? '.*' : null);

    if (regexp) {
      type      = $$UMFP.type(regexp) || inherit($$UMFP.type("string"), { pattern: new RegExp(regexp, config.caseInsensitive ? 'i' : undefined) ***REMOVED***);
***REMOVED***

    return {
      id: id, regexp: regexp, segment: segment, type: type, cfg: cfg
***REMOVED***;
  ***REMOVED***

  var p, param, segment;
  while ((m = placeholder.exec(pattern))) {
    p = matchDetails(m, false);
    if (p.segment.indexOf('?') >= 0) break; // we're into the search part

    param = addParameter(p.id, p.type, p.cfg, "path");
    compiled += quoteRegExp(p.segment, param.type.pattern.source, param.squash, param.isOptional);
    segments.push(p.segment);
    last = placeholder.lastIndex;
  ***REMOVED***
  segment = pattern.substring(last);

  // Find any search parameter names and remove them from the last segment
  var i = segment.indexOf('?');

  if (i >= 0) {
    var search = this.sourceSearch = segment.substring(i);
    segment = segment.substring(0, i);
    this.sourcePath = pattern.substring(0, last + i);

    if (search.length > 0) {
      last = 0;
      while ((m = searchPlaceholder.exec(search))) {
        p = matchDetails(m, true);
        param = addParameter(p.id, p.type, p.cfg, "search");
        last = placeholder.lastIndex;
    ***REMOVED*** check if ?&
  ***REMOVED***
***REMOVED***
  ***REMOVED*** ***REMOVED***
    this.sourcePath = pattern;
    this.sourceSearch = '';
  ***REMOVED***

  compiled += quoteRegExp(segment) + (config.strict === false ? '\/?' : '') + '$';
  segments.push(segment);

  this.regexp = new RegExp(compiled, config.caseInsensitive ? 'i' : undefined);
  this.prefix = segments[0];
  this.$$paramNames = paramNames;
***REMOVED***

/**
 * @ngdoc function
 * @name ui.router.util.type:UrlMatcher#concat
 * @methodOf ui.router.util.type:UrlMatcher
 *
 * @description
 * Returns a new matcher for a pattern constructed by appending the path part and adding the
 * search parameters of the specified pattern to this pattern. The current pattern is not
 * modified. This can be understood as creating a pattern for URLs that are relative to (or
 * suffixes of) the current pattern.
 *
 * @example
 * The following two matchers are equivalent:
 * <pre>
 * new UrlMatcher('/user/{id***REMOVED***?q').concat('/details?date');
 * new UrlMatcher('/user/{id***REMOVED***/details?q&date');
 * </pre>
 *
 * @param {string***REMOVED*** pattern  The pattern to append.
 * @param {Object***REMOVED*** config  An object hash of the configuration for the matcher.
 * @returns {UrlMatcher***REMOVED***  A matcher for the concatenated pattern.
 */
UrlMatcher.prototype.concat = function (pattern, config) {
  // Because order of search parameters is irrelevant, we can add our own search
  // parameters to the end of the new pattern. Parse the new pattern by itself
  // and then join the bits together, but it's much easier to do this on a string level.
  var defaultConfig = {
    caseInsensitive: $$UMFP.caseInsensitive(),
    strict: $$UMFP.strictMode(),
    squash: $$UMFP.defaultSquashPolicy()
  ***REMOVED***;
  return new UrlMatcher(this.sourcePath + pattern + this.sourceSearch, extend(defaultConfig, config), this);
***REMOVED***;

UrlMatcher.prototype.toString = function () {
  return this.source;
***REMOVED***;

/**
 * @ngdoc function
 * @name ui.router.util.type:UrlMatcher#exec
 * @methodOf ui.router.util.type:UrlMatcher
 *
 * @description
 * Tests the specified path against this matcher, and returns an object containing the captured
 * parameter values, or null if the path does not match. The returned object contains the values
 * of any search parameters that are mentioned in the pattern, but their value may be null if
 * they are not present in `searchParams`. This means that search parameters are always treated
 * as optional.
 *
 * @example
 * <pre>
 * new UrlMatcher('/user/{id***REMOVED***?q&r').exec('/user/bob', {
 *   x: '1', q: 'hello'
 * ***REMOVED***);
 * // returns { id: 'bob', q: 'hello', r: null ***REMOVED***
 * </pre>
 *
 * @param {string***REMOVED*** path  The URL path to match, e.g. `$location.path()`.
 * @param {Object***REMOVED*** searchParams  URL search parameters, e.g. `$location.search()`.
 * @returns {Object***REMOVED***  The captured parameter values.
 */
UrlMatcher.prototype.exec = function (path, searchParams) {
  var m = this.regexp.exec(path);
  if (!m) return null;
  searchParams = searchParams || {***REMOVED***;

  var paramNames = this.parameters(), nTotal = paramNames.length,
    nPath = this.segments.length - 1,
    values = {***REMOVED***, i, j, cfg, paramName;

  if (nPath !== m.length - 1) throw new Error("Unbalanced capture group in route '" + this.source + "'");

  function decodePathArray(string) {
    function reverseString(str) { return str.split("").reverse().join(""); ***REMOVED***
    function unquoteDashes(str) { return str.replace(/\\-/g, "-"); ***REMOVED***

    var split = reverseString(string).split(/-(?!\\)/);
    var allReversed = map(split, reverseString);
    return map(allReversed, unquoteDashes).reverse();
  ***REMOVED***

  var param, paramVal;
  for (i = 0; i < nPath; i++) {
    paramName = paramNames[i];
    param = this.params[paramName];
    paramVal = m[i+1];
***REMOVED*** if the param value matches a pre-replace pair, replace the value before decoding.
    for (j = 0; j < param.replace.length; j++) {
      if (param.replace[j].from === paramVal) paramVal = param.replace[j].to;
***REMOVED***
    if (paramVal && param.array === true) paramVal = decodePathArray(paramVal);
    if (isDefined(paramVal)) paramVal = param.type.decode(paramVal);
    values[paramName] = param.value(paramVal);
  ***REMOVED***
  for (/**/; i < nTotal; i++) {
    paramName = paramNames[i];
    values[paramName] = this.params[paramName].value(searchParams[paramName]);
    param = this.params[paramName];
    paramVal = searchParams[paramName];
    for (j = 0; j < param.replace.length; j++) {
      if (param.replace[j].from === paramVal) paramVal = param.replace[j].to;
***REMOVED***
    if (isDefined(paramVal)) paramVal = param.type.decode(paramVal);
    values[paramName] = param.value(paramVal);
  ***REMOVED***

  return values;
***REMOVED***;

/**
 * @ngdoc function
 * @name ui.router.util.type:UrlMatcher#parameters
 * @methodOf ui.router.util.type:UrlMatcher
 *
 * @description
 * Returns the names of all path and search parameters of this pattern in an unspecified order.
 *
 * @returns {Array.<string>***REMOVED***  An array of parameter names. Must be treated as read-only. If the
 *    pattern has no parameters, an empty array is returned.
 */
UrlMatcher.prototype.parameters = function (param) {
  if (!isDefined(param)) return this.$$paramNames;
  return this.params[param] || null;
***REMOVED***;

/**
 * @ngdoc function
 * @name ui.router.util.type:UrlMatcher#validates
 * @methodOf ui.router.util.type:UrlMatcher
 *
 * @description
 * Checks an object hash of parameters to validate their correctness according to the parameter
 * types of this `UrlMatcher`.
 *
 * @param {Object***REMOVED*** params The object hash of parameters to validate.
 * @returns {boolean***REMOVED*** Returns `true` if `params` validates, otherwise `false`.
 */
UrlMatcher.prototype.validates = function (params) {
  return this.params.$$validates(params);
***REMOVED***;

/**
 * @ngdoc function
 * @name ui.router.util.type:UrlMatcher#format
 * @methodOf ui.router.util.type:UrlMatcher
 *
 * @description
 * Creates a URL that matches this pattern by substituting the specified values
 * for the path and search parameters. Null values for path parameters are
 * treated as empty strings.
 *
 * @example
 * <pre>
 * new UrlMatcher('/user/{id***REMOVED***?q').format({ id:'bob', q:'yes' ***REMOVED***);
 * // returns '/user/bob?q=yes'
 * </pre>
 *
 * @param {Object***REMOVED*** values  the values to substitute for the parameters in this pattern.
 * @returns {string***REMOVED***  the formatted URL (path and optionally search part).
 */
UrlMatcher.prototype.format = function (values) {
  values = values || {***REMOVED***;
  var segments = this.segments, params = this.parameters(), paramset = this.params;
  if (!this.validates(values)) return null;

  var i, search = false, nPath = segments.length - 1, nTotal = params.length, result = segments[0];

  function encodeDashes(str) { // Replace dashes with encoded "\-"
    return encodeURIComponent(str).replace(/-/g, function(c) { return '%5C%' + c.charCodeAt(0).toString(16).toUpperCase(); ***REMOVED***);
  ***REMOVED***

  for (i = 0; i < nTotal; i++) {
    var isPathParam = i < nPath;
    var name = params[i], param = paramset[name], value = param.value(values[name]);
    var isDefaultValue = param.isOptional && param.type.equals(param.value(), value);
    var squash = isDefaultValue ? param.squash : false;
    var encoded = param.type.encode(value);

    if (isPathParam) {
      var nextSegment = segments[i + 1];
      var isFinalPathParam = i + 1 === nPath;

      if (squash === false) {
        if (encoded != null) {
          if (isArray(encoded)) {
            result += map(encoded, encodeDashes).join("-");
      ***REMOVED*** ***REMOVED***
            result += encodeURIComponent(encoded);
      ***REMOVED***
    ***REMOVED***
        result += nextSegment;
  ***REMOVED*** else if (squash === true) {
        var capture = result.match(/\/$/) ? /\/?(.*)/ : /(.*)/;
        result += nextSegment.match(capture)[1];
  ***REMOVED*** else if (isString(squash)) {
        result += squash + nextSegment;
  ***REMOVED***

      if (isFinalPathParam && param.squash === true && result.slice(-1) === '/') result = result.slice(0, -1);
***REMOVED*** ***REMOVED***
      if (encoded == null || (isDefaultValue && squash !== false)) continue;
      if (!isArray(encoded)) encoded = [ encoded ];
      if (encoded.length === 0) continue;
      encoded = map(encoded, encodeURIComponent).join('&' + name + '=');
      result += (search ? '&' : '?') + (name + '=' + encoded);
      search = true;
***REMOVED***
  ***REMOVED***

  return result;
***REMOVED***;

/**
 * @ngdoc object
 * @name ui.router.util.type:Type
 *
 * @description
 * Implements an interface to define custom parameter types that can be decoded from and encoded to
 * string parameters matched in a URL. Used by {@link ui.router.util.type:UrlMatcher `UrlMatcher`***REMOVED***
 * objects when matching or formatting URLs, or comparing or validating parameter values.
 *
 * See {@link ui.router.util.$urlMatcherFactory#methods_type `$urlMatcherFactory#type()`***REMOVED*** for more
 * information on registering custom types.
 *
 * @param {Object***REMOVED*** config  A configuration object which contains the custom type definition.  The object's
 *        properties will override the default methods and/or pattern in `Type`'s public interface.
 * @example
 * <pre>
 * {
 *   decode: function(val) { return parseInt(val, 10); ***REMOVED***,
 *   encode: function(val) { return val && val.toString(); ***REMOVED***,
 *   equals: function(a, b) { return this.is(a) && a === b; ***REMOVED***,
 *   is: function(val) { return angular.isNumber(val) isFinite(val) && val % 1 === 0; ***REMOVED***,
 *   pattern: /\d+/
 * ***REMOVED***
 * </pre>
 *
 * @property {RegExp***REMOVED*** pattern The regular expression pattern used to match values of this type when
 *           coming from a substring of a URL.
 *
 * @returns {Object***REMOVED***  Returns a new `Type` object.
 */
function Type(config) {
  extend(this, config);
***REMOVED***

/**
 * @ngdoc function
 * @name ui.router.util.type:Type#is
 * @methodOf ui.router.util.type:Type
 *
 * @description
 * Detects whether a value is of a particular type. Accepts a native (decoded) value
 * and determines whether it matches the current `Type` object.
 *
 * @param {****REMOVED*** val  The value to check.
 * @param {string***REMOVED*** key  Optional. If the type check is happening in the context of a specific
 *        {@link ui.router.util.type:UrlMatcher `UrlMatcher`***REMOVED*** object, this is the name of the
 *        parameter in which `val` is stored. Can be used for meta-programming of `Type` objects.
 * @returns {Boolean***REMOVED***  Returns `true` if the value matches the type, otherwise `false`.
 */
Type.prototype.is = function(val, key) {
  return true;
***REMOVED***;

/**
 * @ngdoc function
 * @name ui.router.util.type:Type#encode
 * @methodOf ui.router.util.type:Type
 *
 * @description
 * Encodes a custom/native type value to a string that can be embedded in a URL. Note that the
 * return value does *not* need to be URL-safe (i.e. passed through `encodeURIComponent()`), it
 * only needs to be a representation of `val` that has been coerced to a string.
 *
 * @param {****REMOVED*** val  The value to encode.
 * @param {string***REMOVED*** key  The name of the parameter in which `val` is stored. Can be used for
 *        meta-programming of `Type` objects.
 * @returns {string***REMOVED***  Returns a string representation of `val` that can be encoded in a URL.
 */
Type.prototype.encode = function(val, key) {
  return val;
***REMOVED***;

/**
 * @ngdoc function
 * @name ui.router.util.type:Type#decode
 * @methodOf ui.router.util.type:Type
 *
 * @description
 * Converts a parameter value (from URL string or transition param) to a custom/native value.
 *
 * @param {string***REMOVED*** val  The URL parameter value to decode.
 * @param {string***REMOVED*** key  The name of the parameter in which `val` is stored. Can be used for
 *        meta-programming of `Type` objects.
 * @returns {****REMOVED***  Returns a custom representation of the URL parameter value.
 */
Type.prototype.decode = function(val, key) {
  return val;
***REMOVED***;

/**
 * @ngdoc function
 * @name ui.router.util.type:Type#equals
 * @methodOf ui.router.util.type:Type
 *
 * @description
 * Determines whether two decoded values are equivalent.
 *
 * @param {****REMOVED*** a  A value to compare against.
 * @param {****REMOVED*** b  A value to compare against.
 * @returns {Boolean***REMOVED***  Returns `true` if the values are equivalent/equal, otherwise `false`.
 */
Type.prototype.equals = function(a, b) {
  return a == b;
***REMOVED***;

Type.prototype.$subPattern = function() {
  var sub = this.pattern.toString();
  return sub.substr(1, sub.length - 2);
***REMOVED***;

Type.prototype.pattern = /.*/;

Type.prototype.toString = function() { return "{Type:" + this.name + "***REMOVED***"; ***REMOVED***;

/** Given an encoded string, or a decoded object, returns a decoded object */
Type.prototype.$normalize = function(val) {
  return this.is(val) ? val : this.decode(val);
***REMOVED***;

/*
 * Wraps an existing custom Type as an array of Type, depending on 'mode'.
 * e.g.:
 * - urlmatcher pattern "/path?{queryParam[]:int***REMOVED***"
 * - url: "/path?queryParam=1&queryParam=2
 * - $stateParams.queryParam will be [1, 2]
 * if `mode` is "auto", then
 * - url: "/path?queryParam=1 will create $stateParams.queryParam: 1
 * - url: "/path?queryParam=1&queryParam=2 will create $stateParams.queryParam: [1, 2]
 */
Type.prototype.$asArray = function(mode, isSearch) {
  if (!mode) return this;
  if (mode === "auto" && !isSearch) throw new Error("'auto' array mode is for query parameters only");

  function ArrayType(type, mode) {
    function bindTo(type, callbackName) {
      return function() {
        return type[callbackName].apply(type, arguments);
  ***REMOVED***;
***REMOVED***

***REMOVED*** Wrap non-array value as array
    function arrayWrap(val) { return isArray(val) ? val : (isDefined(val) ? [ val ] : []); ***REMOVED***
***REMOVED*** Unwrap array value for "auto" mode. Return undefined for empty array.
    function arrayUnwrap(val) {
      switch(val.length) {
        case 0: return undefined;
        case 1: return mode === "auto" ? val[0] : val;
        default: return val;
  ***REMOVED***
***REMOVED***
    function falsey(val) { return !val; ***REMOVED***

***REMOVED*** Wraps type (.is/.encode/.decode) functions to operate on each value of an array
    function arrayHandler(callback, allTruthyMode) {
      return function handleArray(val) {
        if (isArray(val) && val.length === 0) return val;
        val = arrayWrap(val);
        var result = map(val, callback);
        if (allTruthyMode === true)
          return filter(result, falsey).length === 0;
        return arrayUnwrap(result);
  ***REMOVED***;
***REMOVED***

***REMOVED*** Wraps type (.equals) functions to operate on each value of an array
    function arrayEqualsHandler(callback) {
      return function handleArray(val1, val2) {
        var left = arrayWrap(val1), right = arrayWrap(val2);
        if (left.length !== right.length) return false;
        for (var i = 0; i < left.length; i++) {
          if (!callback(left[i], right[i])) return false;
    ***REMOVED***
        return true;
  ***REMOVED***;
***REMOVED***

    this.encode = arrayHandler(bindTo(type, 'encode'));
    this.decode = arrayHandler(bindTo(type, 'decode'));
    this.is     = arrayHandler(bindTo(type, 'is'), true);
    this.equals = arrayEqualsHandler(bindTo(type, 'equals'));
    this.pattern = type.pattern;
    this.$normalize = arrayHandler(bindTo(type, '$normalize'));
    this.name = type.name;
    this.$arrayMode = mode;
  ***REMOVED***

  return new ArrayType(this, mode);
***REMOVED***;



/**
 * @ngdoc object
 * @name ui.router.util.$urlMatcherFactory
 *
 * @description
 * Factory for {@link ui.router.util.type:UrlMatcher `UrlMatcher`***REMOVED*** instances. The factory
 * is also available to providers under the name `$urlMatcherFactoryProvider`.
 */
function $UrlMatcherFactory() {
  $$UMFP = this;

  var isCaseInsensitive = false, isStrictMode = true, defaultSquashPolicy = false;

  // Use tildes to pre-encode slashes.
  // If the slashes are simply URLEncoded, the browser can choose to pre-decode them,
  // and bidirectional encoding/decoding fails.
  // Tilde was chosen because it's not a RFC 3986 section 2.2 Reserved Character
  function valToString(val) { return val != null ? val.toString().replace(/~/g, "~~").replace(/\//g, "~2F") : val; ***REMOVED***
  function valFromString(val) { return val != null ? val.toString().replace(/~2F/g, "/").replace(/~~/g, "~") : val; ***REMOVED***

  var $types = {***REMOVED***, enqueue = true, typeQueue = [], injector, defaultTypes = {
    "string": {
      encode: valToString,
      decode: valFromString,
  ***REMOVED*** TODO: in 1.0, make string .is() return false if value is undefined/null by default.
  ***REMOVED*** In 0.2.x, string params are optional by default for backwards compat
      is: function(val) { return val == null || !isDefined(val) || typeof val === "string"; ***REMOVED***,
      pattern: /[^/]*/
***REMOVED***,
    "int": {
      encode: valToString,
      decode: function(val) { return parseInt(val, 10); ***REMOVED***,
      is: function(val) { return isDefined(val) && this.decode(val.toString()) === val; ***REMOVED***,
      pattern: /\d+/
***REMOVED***,
    "bool": {
      encode: function(val) { return val ? 1 : 0; ***REMOVED***,
      decode: function(val) { return parseInt(val, 10) !== 0; ***REMOVED***,
      is: function(val) { return val === true || val === false; ***REMOVED***,
      pattern: /0|1/
***REMOVED***,
    "date": {
      encode: function (val) {
        if (!this.is(val))
          return undefined;
        return [ val.getFullYear(),
          ('0' + (val.getMonth() + 1)).slice(-2),
          ('0' + val.getDate()).slice(-2)
        ].join("-");
  ***REMOVED***,
      decode: function (val) {
        if (this.is(val)) return val;
        var match = this.capture.exec(val);
        return match ? new Date(match[1], match[2] - 1, match[3]) : undefined;
  ***REMOVED***,
      is: function(val) { return val instanceof Date && !isNaN(val.valueOf()); ***REMOVED***,
      equals: function (a, b) { return this.is(a) && this.is(b) && a.toISOString() === b.toISOString(); ***REMOVED***,
      pattern: /[0-9]{4***REMOVED***-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])/,
      capture: /([0-9]{4***REMOVED***)-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/
***REMOVED***,
    "json": {
      encode: angular.toJson,
      decode: angular.fromJson,
      is: angular.isObject,
      equals: angular.equals,
      pattern: /[^/]*/
***REMOVED***,
    "any": { // does not encode/decode
      encode: angular.identity,
      decode: angular.identity,
      equals: angular.equals,
      pattern: /.*/
***REMOVED***
  ***REMOVED***;

  function getDefaultConfig() {
    return {
      strict: isStrictMode,
      caseInsensitive: isCaseInsensitive
***REMOVED***;
  ***REMOVED***

  function isInjectable(value) {
    return (isFunction(value) || (isArray(value) && isFunction(value[value.length - 1])));
  ***REMOVED***

  /**
   * [Internal] Get the default value of a parameter, which may be an injectable function.
   */
  $UrlMatcherFactory.$$getDefaultValue = function(config) {
    if (!isInjectable(config.value)) return config.value;
    if (!injector) throw new Error("Injectable functions cannot be called at configuration time");
    return injector.invoke(config.value);
  ***REMOVED***;

  /**
   * @ngdoc function
   * @name ui.router.util.$urlMatcherFactory#caseInsensitive
   * @methodOf ui.router.util.$urlMatcherFactory
   *
   * @description
   * Defines whether URL matching should be case sensitive (the default behavior), or not.
   *
   * @param {boolean***REMOVED*** value `false` to match URL in a case sensitive manner; otherwise `true`;
   * @returns {boolean***REMOVED*** the current value of caseInsensitive
   */
  this.caseInsensitive = function(value) {
    if (isDefined(value))
      isCaseInsensitive = value;
    return isCaseInsensitive;
  ***REMOVED***;

  /**
   * @ngdoc function
   * @name ui.router.util.$urlMatcherFactory#strictMode
   * @methodOf ui.router.util.$urlMatcherFactory
   *
   * @description
   * Defines whether URLs should match trailing slashes, or not (the default behavior).
   *
   * @param {boolean=***REMOVED*** value `false` to match trailing slashes in URLs, otherwise `true`.
   * @returns {boolean***REMOVED*** the current value of strictMode
   */
  this.strictMode = function(value) {
    if (isDefined(value))
      isStrictMode = value;
    return isStrictMode;
  ***REMOVED***;

  /**
   * @ngdoc function
   * @name ui.router.util.$urlMatcherFactory#defaultSquashPolicy
   * @methodOf ui.router.util.$urlMatcherFactory
   *
   * @description
   * Sets the default behavior when generating or matching URLs with default parameter values.
   *
   * @param {string***REMOVED*** value A string that defines the default parameter URL squashing behavior.
   *    `nosquash`: When generating an href with a default parameter value, do not squash the parameter value from the URL
   *    `slash`: When generating an href with a default parameter value, squash (remove) the parameter value, and, if the
   *             parameter is surrounded by slashes, squash (remove) one slash from the URL
   *    any other string, e.g. "~": When generating an href with a default parameter value, squash (remove)
   *             the parameter value from the URL and replace it with this string.
   */
  this.defaultSquashPolicy = function(value) {
    if (!isDefined(value)) return defaultSquashPolicy;
    if (value !== true && value !== false && !isString(value))
      throw new Error("Invalid squash policy: " + value + ". Valid policies: false, true, arbitrary-string");
    defaultSquashPolicy = value;
    return value;
  ***REMOVED***;

  /**
   * @ngdoc function
   * @name ui.router.util.$urlMatcherFactory#compile
   * @methodOf ui.router.util.$urlMatcherFactory
   *
   * @description
   * Creates a {@link ui.router.util.type:UrlMatcher `UrlMatcher`***REMOVED*** for the specified pattern.
   *
   * @param {string***REMOVED*** pattern  The URL pattern.
   * @param {Object***REMOVED*** config  The config object hash.
   * @returns {UrlMatcher***REMOVED***  The UrlMatcher.
   */
  this.compile = function (pattern, config) {
    return new UrlMatcher(pattern, extend(getDefaultConfig(), config));
  ***REMOVED***;

  /**
   * @ngdoc function
   * @name ui.router.util.$urlMatcherFactory#isMatcher
   * @methodOf ui.router.util.$urlMatcherFactory
   *
   * @description
   * Returns true if the specified object is a `UrlMatcher`, or false otherwise.
   *
   * @param {Object***REMOVED*** object  The object to perform the type check against.
   * @returns {Boolean***REMOVED***  Returns `true` if the object matches the `UrlMatcher` interface, by
   *          implementing all the same methods.
   */
  this.isMatcher = function (o) {
    if (!isObject(o)) return false;
    var result = true;

    forEach(UrlMatcher.prototype, function(val, name) {
      if (isFunction(val)) {
        result = result && (isDefined(o[name]) && isFunction(o[name]));
  ***REMOVED***
***REMOVED***);
    return result;
  ***REMOVED***;

  /**
   * @ngdoc function
   * @name ui.router.util.$urlMatcherFactory#type
   * @methodOf ui.router.util.$urlMatcherFactory
   *
   * @description
   * Registers a custom {@link ui.router.util.type:Type `Type`***REMOVED*** object that can be used to
   * generate URLs with typed parameters.
   *
   * @param {string***REMOVED*** name  The type name.
   * @param {Object|Function***REMOVED*** definition   The type definition. See
   *        {@link ui.router.util.type:Type `Type`***REMOVED*** for information on the values accepted.
   * @param {Object|Function***REMOVED*** definitionFn (optional) A function that is injected before the app
   *        runtime starts.  The result of this function is merged into the existing `definition`.
   *        See {@link ui.router.util.type:Type `Type`***REMOVED*** for information on the values accepted.
   *
   * @returns {Object***REMOVED***  Returns `$urlMatcherFactoryProvider`.
   *
   * @example
   * This is a simple example of a custom type that encodes and decodes items from an
   * array, using the array index as the URL-encoded value:
   *
   * <pre>
   * var list = ['John', 'Paul', 'George', 'Ringo'];
   *
   * $urlMatcherFactoryProvider.type('listItem', {
   *   encode: function(item) {
   * ***REMOVED*** Represent the list item in the URL using its corresponding index
   *     return list.indexOf(item);
   *   ***REMOVED***,
   *   decode: function(item) {
   * ***REMOVED*** Look up the list item by index
   *     return list[parseInt(item, 10)];
   *   ***REMOVED***,
   *   is: function(item) {
   * ***REMOVED*** Ensure the item is valid by checking to see that it appears
   * ***REMOVED*** in the list
   *     return list.indexOf(item) > -1;
   *   ***REMOVED***
   * ***REMOVED***);
   *
   * $stateProvider.state('list', {
   *   url: "/list/{item:listItem***REMOVED***",
   *   controller: function($scope, $stateParams) {
   *     console.log($stateParams.item);
   *   ***REMOVED***
   * ***REMOVED***);
   *
   * // ...
   *
   * // Changes URL to '/list/3', logs "Ringo" to the console
   * $state.go('list', { item: "Ringo" ***REMOVED***);
   * </pre>
   *
   * This is a more complex example of a type that relies on dependency injection to
   * interact with services, and uses the parameter name from the URL to infer how to
   * handle encoding and decoding parameter values:
   *
   * <pre>
   * // Defines a custom type that gets a value from a service,
   * // where each service gets different types of values from
   * // a backend API:
   * $urlMatcherFactoryProvider.type('dbObject', {***REMOVED***, function(Users, Posts) {
   *
   *   // Matches up services to URL parameter names
   *   var services = {
   *     user: Users,
   *     post: Posts
   *   ***REMOVED***;
   *
   *   return {
   *     encode: function(object) {
   *   ***REMOVED*** Represent the object in the URL using its unique ID
   *       return object.id;
   * ***REMOVED***,
   *     decode: function(value, key) {
   *   ***REMOVED*** Look up the object by ID, using the parameter
   *   ***REMOVED*** name (key) to call the correct service
   *       return services[key].findById(value);
   * ***REMOVED***,
   *     is: function(object, key) {
   *   ***REMOVED*** Check that object is a valid dbObject
   *       return angular.isObject(object) && object.id && services[key];
   * ***REMOVED***
   *     equals: function(a, b) {
   *   ***REMOVED*** Check the equality of decoded objects by comparing
   *   ***REMOVED*** their unique IDs
   *       return a.id === b.id;
   * ***REMOVED***
   *   ***REMOVED***;
   * ***REMOVED***);
   *
   * // In a config() block, you can then attach URLs with
   * // type-annotated parameters:
   * $stateProvider.state('users', {
   *   url: "/users",
   *   // ...
   * ***REMOVED***).state('users.item', {
   *   url: "/{user:dbObject***REMOVED***",
   *   controller: function($scope, $stateParams) {
   * ***REMOVED*** $stateParams.user will now be an object returned from
   * ***REMOVED*** the Users service
   *   ***REMOVED***,
   *   // ...
   * ***REMOVED***);
   * </pre>
   */
  this.type = function (name, definition, definitionFn) {
    if (!isDefined(definition)) return $types[name];
    if ($types.hasOwnProperty(name)) throw new Error("A type named '" + name + "' has already been defined.");

    $types[name] = new Type(extend({ name: name ***REMOVED***, definition));
    if (definitionFn) {
      typeQueue.push({ name: name, def: definitionFn ***REMOVED***);
      if (!enqueue) flushTypeQueue();
***REMOVED***
    return this;
  ***REMOVED***;

  // `flushTypeQueue()` waits until `$urlMatcherFactory` is injected before invoking the queued `definitionFn`s
  function flushTypeQueue() {
    while(typeQueue.length) {
      var type = typeQueue.shift();
      if (type.pattern) throw new Error("You cannot override a type's .pattern at runtime.");
      angular.extend($types[type.name], injector.invoke(type.def));
***REMOVED***
  ***REMOVED***

  // Register default types. Store them in the prototype of $types.
  forEach(defaultTypes, function(type, name) { $types[name] = new Type(extend({name: name***REMOVED***, type)); ***REMOVED***);
  $types = inherit($types, {***REMOVED***);

  /* No need to document $get, since it returns this */
  this.$get = ['$injector', function ($injector) {
    injector = $injector;
    enqueue = false;
    flushTypeQueue();

    forEach(defaultTypes, function(type, name) {
      if (!$types[name]) $types[name] = new Type(type);
***REMOVED***);
    return this;
  ***REMOVED***];

  this.Param = function Param(id, type, config, location) {
    var self = this;
    config = unwrapShorthand(config);
    type = getType(config, type, location);
    var arrayMode = getArrayMode();
    type = arrayMode ? type.$asArray(arrayMode, location === "search") : type;
    if (type.name === "string" && !arrayMode && location === "path" && config.value === undefined)
      config.value = ""; // for 0.2.x; in 0.3.0+ do not automatically default to ""
    var isOptional = config.value !== undefined;
    var squash = getSquashPolicy(config, isOptional);
    var replace = getReplace(config, arrayMode, isOptional, squash);

    function unwrapShorthand(config) {
      var keys = isObject(config) ? objectKeys(config) : [];
      var isShorthand = indexOf(keys, "value") === -1 && indexOf(keys, "type") === -1 &&
                        indexOf(keys, "squash") === -1 && indexOf(keys, "array") === -1;
      if (isShorthand) config = { value: config ***REMOVED***;
      config.$$fn = isInjectable(config.value) ? config.value : function () { return config.value; ***REMOVED***;
      return config;
***REMOVED***

    function getType(config, urlType, location) {
      if (config.type && urlType) throw new Error("Param '"+id+"' has two type configurations.");
      if (urlType) return urlType;
      if (!config.type) return (location === "config" ? $types.any : $types.string);

      if (angular.isString(config.type))
        return $types[config.type];
      if (config.type instanceof Type)
        return config.type;
      return new Type(config.type);
***REMOVED***

***REMOVED*** array config: param name (param[]) overrides default settings.  explicit config overrides param name.
    function getArrayMode() {
      var arrayDefaults = { array: (location === "search" ? "auto" : false) ***REMOVED***;
      var arrayParamNomenclature = id.match(/\[\]$/) ? { array: true ***REMOVED*** : {***REMOVED***;
      return extend(arrayDefaults, arrayParamNomenclature, config).array;
***REMOVED***

    /**
     * returns false, true, or the squash value to indicate the "default parameter url squash policy".
     */
    function getSquashPolicy(config, isOptional) {
      var squash = config.squash;
      if (!isOptional || squash === false) return false;
      if (!isDefined(squash) || squash == null) return defaultSquashPolicy;
      if (squash === true || isString(squash)) return squash;
      throw new Error("Invalid squash policy: '" + squash + "'. Valid policies: false, true, or arbitrary string");
***REMOVED***

    function getReplace(config, arrayMode, isOptional, squash) {
      var replace, configuredKeys, defaultPolicy = [
        { from: "",   to: (isOptional || arrayMode ? undefined : "") ***REMOVED***,
        { from: null, to: (isOptional || arrayMode ? undefined : "") ***REMOVED***
      ];
      replace = isArray(config.replace) ? config.replace : [];
      if (isString(squash))
        replace.push({ from: squash, to: undefined ***REMOVED***);
      configuredKeys = map(replace, function(item) { return item.from; ***REMOVED*** );
      return filter(defaultPolicy, function(item) { return indexOf(configuredKeys, item.from) === -1; ***REMOVED***).concat(replace);
***REMOVED***

    /**
     * [Internal] Get the default value of a parameter, which may be an injectable function.
     */
    function $$getDefaultValue() {
      if (!injector) throw new Error("Injectable functions cannot be called at configuration time");
      var defaultValue = injector.invoke(config.$$fn);
      if (defaultValue !== null && defaultValue !== undefined && !self.type.is(defaultValue))
        throw new Error("Default value (" + defaultValue + ") for parameter '" + self.id + "' is not an instance of Type (" + self.type.name + ")");
      return defaultValue;
***REMOVED***

    /**
     * [Internal] Gets the decoded representation of a value if the value is defined, otherwise, returns the
     * default value, which may be the result of an injectable function.
     */
    function $value(value) {
      function hasReplaceVal(val) { return function(obj) { return obj.from === val; ***REMOVED***; ***REMOVED***
      function $replace(value) {
        var replacement = map(filter(self.replace, hasReplaceVal(value)), function(obj) { return obj.to; ***REMOVED***);
        return replacement.length ? replacement[0] : value;
  ***REMOVED***
      value = $replace(value);
      return !isDefined(value) ? $$getDefaultValue() : self.type.$normalize(value);
***REMOVED***

    function toString() { return "{Param:" + id + " " + type + " squash: '" + squash + "' optional: " + isOptional + "***REMOVED***"; ***REMOVED***

    extend(this, {
      id: id,
      type: type,
      location: location,
      array: arrayMode,
      squash: squash,
      replace: replace,
      isOptional: isOptional,
      value: $value,
      dynamic: undefined,
      config: config,
      toString: toString
***REMOVED***);
  ***REMOVED***;

  function ParamSet(params) {
    extend(this, params || {***REMOVED***);
  ***REMOVED***

  ParamSet.prototype = {
    $$new: function() {
      return inherit(this, extend(new ParamSet(), { $$parent: this***REMOVED***));
***REMOVED***,
    $$keys: function () {
      var keys = [], chain = [], parent = this,
        ignore = objectKeys(ParamSet.prototype);
      while (parent) { chain.push(parent); parent = parent.$$parent; ***REMOVED***
      chain.reverse();
      forEach(chain, function(paramset) {
        forEach(objectKeys(paramset), function(key) {
            if (indexOf(keys, key) === -1 && indexOf(ignore, key) === -1) keys.push(key);
    ***REMOVED***);
  ***REMOVED***);
      return keys;
***REMOVED***,
    $$values: function(paramValues) {
      var values = {***REMOVED***, self = this;
      forEach(self.$$keys(), function(key) {
        values[key] = self[key].value(paramValues && paramValues[key]);
  ***REMOVED***);
      return values;
***REMOVED***,
    $$equals: function(paramValues1, paramValues2) {
      var equal = true, self = this;
      forEach(self.$$keys(), function(key) {
        var left = paramValues1 && paramValues1[key], right = paramValues2 && paramValues2[key];
        if (!self[key].type.equals(left, right)) equal = false;
  ***REMOVED***);
      return equal;
***REMOVED***,
    $$validates: function $$validate(paramValues) {
      var keys = this.$$keys(), i, param, rawVal, normalized, encoded;
      for (i = 0; i < keys.length; i++) {
        param = this[keys[i]];
        rawVal = paramValues[keys[i]];
        if ((rawVal === undefined || rawVal === null) && param.isOptional)
          break; // There was no parameter value, but the param is optional
        normalized = param.type.$normalize(rawVal);
        if (!param.type.is(normalized))
          return false; // The value was not of the correct Type, and could not be decoded to the correct Type
        encoded = param.type.encode(normalized);
        if (angular.isString(encoded) && !param.type.pattern.exec(encoded))
          return false; // The value was of the correct type, but when encoded, did not match the Type's regexp
  ***REMOVED***
      return true;
***REMOVED***,
    $$parent: undefined
  ***REMOVED***;

  this.ParamSet = ParamSet;
***REMOVED***

// Register as a provider so it's available to other providers
angular.module('ui.router.util').provider('$urlMatcherFactory', $UrlMatcherFactory);
angular.module('ui.router.util').run(['$urlMatcherFactory', function($urlMatcherFactory) { ***REMOVED***]);

/**
 * @ngdoc object
 * @name ui.router.router.$urlRouterProvider
 *
 * @requires ui.router.util.$urlMatcherFactoryProvider
 * @requires $locationProvider
 *
 * @description
 * `$urlRouterProvider` has the responsibility of watching `$location`. 
 * When `$location` changes it runs through a list of rules one by one until a 
 * match is found. `$urlRouterProvider` is used behind the scenes anytime you specify 
 * a url in a state configuration. All urls are compiled into a UrlMatcher object.
 *
 * There are several methods on `$urlRouterProvider` that make it useful to use directly
 * in your module config.
 */
$UrlRouterProvider.$inject = ['$locationProvider', '$urlMatcherFactoryProvider'];
function $UrlRouterProvider(   $locationProvider,   $urlMatcherFactory) {
  var rules = [], otherwise = null, interceptDeferred = false, listener;

  // Returns a string that is a prefix of all strings matching the RegExp
  function regExpPrefix(re) {
    var prefix = /^\^((?:\\[^a-zA-Z0-9]|[^\\\[\]\^$*+?.()|{***REMOVED***]+)*)/.exec(re.source);
    return (prefix != null) ? prefix[1].replace(/\\(.)/g, "$1") : '';
  ***REMOVED***

  // Interpolates matched values into a String.replace()-style pattern
  function interpolate(pattern, match) {
    return pattern.replace(/\$(\$|\d{1,2***REMOVED***)/, function (m, what) {
      return match[what === '$' ? 0 : Number(what)];
***REMOVED***);
  ***REMOVED***

  /**
   * @ngdoc function
   * @name ui.router.router.$urlRouterProvider#rule
   * @methodOf ui.router.router.$urlRouterProvider
   *
   * @description
   * Defines rules that are used by `$urlRouterProvider` to find matches for
   * specific URLs.
   *
   * @example
   * <pre>
   * var app = angular.module('app', ['ui.router.router']);
   *
   * app.config(function ($urlRouterProvider) {
   *   // Here's an example of how you might allow case insensitive urls
   *   $urlRouterProvider.rule(function ($injector, $location) {
   *     var path = $location.path(),
   *         normalized = path.toLowerCase();
   *
   *     if (path !== normalized) {
   *       return normalized;
   * ***REMOVED***
   *   ***REMOVED***);
   * ***REMOVED***);
   * </pre>
   *
   * @param {function***REMOVED*** rule Handler function that takes `$injector` and `$location`
   * services as arguments. You can use them to return a valid path as a string.
   *
   * @return {object***REMOVED*** `$urlRouterProvider` - `$urlRouterProvider` instance
   */
  this.rule = function (rule) {
    if (!isFunction(rule)) throw new Error("'rule' must be a function");
    rules.push(rule);
    return this;
  ***REMOVED***;

  /**
   * @ngdoc object
   * @name ui.router.router.$urlRouterProvider#otherwise
   * @methodOf ui.router.router.$urlRouterProvider
   *
   * @description
   * Defines a path that is used when an invalid route is requested.
   *
   * @example
   * <pre>
   * var app = angular.module('app', ['ui.router.router']);
   *
   * app.config(function ($urlRouterProvider) {
   *   // if the path doesn't match any of the urls you configured
   *   // otherwise will take care of routing the user to the
   *   // specified url
   *   $urlRouterProvider.otherwise('/index');
   *
   *   // Example of using function rule as param
   *   $urlRouterProvider.otherwise(function ($injector, $location) {
   *     return '/a/valid/url';
   *   ***REMOVED***);
   * ***REMOVED***);
   * </pre>
   *
   * @param {string|function***REMOVED*** rule The url path you want to redirect to or a function 
   * rule that returns the url path. The function version is passed two params: 
   * `$injector` and `$location` services, and must return a url string.
   *
   * @return {object***REMOVED*** `$urlRouterProvider` - `$urlRouterProvider` instance
   */
  this.otherwise = function (rule) {
    if (isString(rule)) {
      var redirect = rule;
      rule = function () { return redirect; ***REMOVED***;
***REMOVED***
    else if (!isFunction(rule)) throw new Error("'rule' must be a function");
    otherwise = rule;
    return this;
  ***REMOVED***;


  function handleIfMatch($injector, handler, match) {
    if (!match) return false;
    var result = $injector.invoke(handler, handler, { $match: match ***REMOVED***);
    return isDefined(result) ? result : true;
  ***REMOVED***

  /**
   * @ngdoc function
   * @name ui.router.router.$urlRouterProvider#when
   * @methodOf ui.router.router.$urlRouterProvider
   *
   * @description
   * Registers a handler for a given url matching. 
   * 
   * If the handler is a string, it is
   * treated as a redirect, and is interpolated according to the syntax of match
   * (i.e. like `String.replace()` for `RegExp`, or like a `UrlMatcher` pattern otherwise).
   *
   * If the handler is a function, it is injectable. It gets invoked if `$location`
   * matches. You have the option of inject the match object as `$match`.
   *
   * The handler can return
   *
   * - **falsy** to indicate that the rule didn't match after all, then `$urlRouter`
   *   will continue trying to find another one that matches.
   * - **string** which is treated as a redirect and passed to `$location.url()`
   * - **void** or any **truthy** value tells `$urlRouter` that the url was handled.
   *
   * @example
   * <pre>
   * var app = angular.module('app', ['ui.router.router']);
   *
   * app.config(function ($urlRouterProvider) {
   *   $urlRouterProvider.when($state.url, function ($match, $stateParams) {
   *     if ($state.$current.navigable !== state ||
   *         !equalForKeys($match, $stateParams) {
   *      $state.transitionTo(state, $match, false);
   * ***REMOVED***
   *   ***REMOVED***);
   * ***REMOVED***);
   * </pre>
   *
   * @param {string|object***REMOVED*** what The incoming path that you want to redirect.
   * @param {string|function***REMOVED*** handler The path you want to redirect your user to.
   */
  this.when = function (what, handler) {
    var redirect, handlerIsString = isString(handler);
    if (isString(what)) what = $urlMatcherFactory.compile(what);

    if (!handlerIsString && !isFunction(handler) && !isArray(handler))
      throw new Error("invalid 'handler' in when()");

    var strategies = {
      matcher: function (what, handler) {
        if (handlerIsString) {
          redirect = $urlMatcherFactory.compile(handler);
          handler = ['$match', function ($match) { return redirect.format($match); ***REMOVED***];
    ***REMOVED***
        return extend(function ($injector, $location) {
          return handleIfMatch($injector, handler, what.exec($location.path(), $location.search()));
    ***REMOVED***, {
          prefix: isString(what.prefix) ? what.prefix : ''
    ***REMOVED***);
  ***REMOVED***,
      regex: function (what, handler) {
        if (what.global || what.sticky) throw new Error("when() RegExp must not be global or sticky");

        if (handlerIsString) {
          redirect = handler;
          handler = ['$match', function ($match) { return interpolate(redirect, $match); ***REMOVED***];
    ***REMOVED***
        return extend(function ($injector, $location) {
          return handleIfMatch($injector, handler, what.exec($location.path()));
    ***REMOVED***, {
          prefix: regExpPrefix(what)
    ***REMOVED***);
  ***REMOVED***
***REMOVED***;

    var check = { matcher: $urlMatcherFactory.isMatcher(what), regex: what instanceof RegExp ***REMOVED***;

    for (var n in check) {
      if (check[n]) return this.rule(strategies[n](what, handler));
***REMOVED***

    throw new Error("invalid 'what' in when()");
  ***REMOVED***;

  /**
   * @ngdoc function
   * @name ui.router.router.$urlRouterProvider#deferIntercept
   * @methodOf ui.router.router.$urlRouterProvider
   *
   * @description
   * Disables (or enables) deferring location change interception.
   *
   * If you wish to customize the behavior of syncing the URL (for example, if you wish to
   * defer a transition but maintain the current URL), call this method at configuration time.
   * Then, at run time, call `$urlRouter.listen()` after you have configured your own
   * `$locationChangeSuccess` event handler.
   *
   * @example
   * <pre>
   * var app = angular.module('app', ['ui.router.router']);
   *
   * app.config(function ($urlRouterProvider) {
   *
   *   // Prevent $urlRouter from automatically intercepting URL changes;
   *   // this allows you to configure custom behavior in between
   *   // location changes and route synchronization:
   *   $urlRouterProvider.deferIntercept();
   *
   * ***REMOVED***).run(function ($rootScope, $urlRouter, UserService) {
   *
   *   $rootScope.$on('$locationChangeSuccess', function(e) {
   * ***REMOVED*** UserService is an example service for managing user state
   *     if (UserService.isLoggedIn()) return;
   *
   * ***REMOVED*** Prevent $urlRouter's default handler from firing
   *     e.preventDefault();
   *
   *     UserService.handleLogin().then(function() {
   *   ***REMOVED*** Once the user has logged in, sync the current URL
   *   ***REMOVED*** to the router:
   *       $urlRouter.sync();
   * ***REMOVED***);
   *   ***REMOVED***);
   *
   *   // Configures $urlRouter's listener *after* your custom listener
   *   $urlRouter.listen();
   * ***REMOVED***);
   * </pre>
   *
   * @param {boolean***REMOVED*** defer Indicates whether to defer location change interception. Passing
            no parameter is equivalent to `true`.
   */
  this.deferIntercept = function (defer) {
    if (defer === undefined) defer = true;
    interceptDeferred = defer;
  ***REMOVED***;

  /**
   * @ngdoc object
   * @name ui.router.router.$urlRouter
   *
   * @requires $location
   * @requires $rootScope
   * @requires $injector
   * @requires $browser
   *
   * @description
   *
   */
  this.$get = $get;
  $get.$inject = ['$location', '$rootScope', '$injector', '$browser', '$sniffer'];
  function $get(   $location,   $rootScope,   $injector,   $browser,   $sniffer) {

    var baseHref = $browser.baseHref(), location = $location.url(), lastPushedUrl;

    function appendBasePath(url, isHtml5, absolute) {
      if (baseHref === '/') return url;
      if (isHtml5) return baseHref.slice(0, -1) + url;
      if (absolute) return baseHref.slice(1) + url;
      return url;
***REMOVED***

***REMOVED*** TODO: Optimize groups of rules with non-empty prefix into some sort of decision tree
    function update(evt) {
      if (evt && evt.defaultPrevented) return;
      var ignoreUpdate = lastPushedUrl && $location.url() === lastPushedUrl;
      lastPushedUrl = undefined;
  ***REMOVED*** TODO: Re-implement this in 1.0 for https://github.com/angular-ui/ui-router/issues/1573
  ***REMOVED***if (ignoreUpdate) return true;

      function check(rule) {
        var handled = rule($injector, $location);

        if (!handled) return false;
        if (isString(handled)) $location.replace().url(handled);
        return true;
  ***REMOVED***
      var n = rules.length, i;

      for (i = 0; i < n; i++) {
        if (check(rules[i])) return;
  ***REMOVED***
  ***REMOVED*** always check otherwise last to allow dynamic updates to the set of rules
      if (otherwise) check(otherwise);
***REMOVED***

    function listen() {
      listener = listener || $rootScope.$on('$locationChangeSuccess', update);
      return listener;
***REMOVED***

    if (!interceptDeferred) listen();

    return {
      /**
       * @ngdoc function
       * @name ui.router.router.$urlRouter#sync
       * @methodOf ui.router.router.$urlRouter
       *
       * @description
       * Triggers an update; the same update that happens when the address bar url changes, aka `$locationChangeSuccess`.
       * This method is useful when you need to use `preventDefault()` on the `$locationChangeSuccess` event,
       * perform some custom logic (route protection, auth, config, redirection, etc) and then finally proceed
       * with the transition by calling `$urlRouter.sync()`.
       *
       * @example
       * <pre>
       * angular.module('app', ['ui.router'])
       *   .run(function($rootScope, $urlRouter) {
       *     $rootScope.$on('$locationChangeSuccess', function(evt) {
       *   ***REMOVED*** Halt state change from even starting
       *       evt.preventDefault();
       *   ***REMOVED*** Perform custom logic
       *       var meetsRequirement = ...
       *   ***REMOVED*** Continue with the update and state transition if logic allows
       *       if (meetsRequirement) $urlRouter.sync();
       * ***REMOVED***);
       * ***REMOVED***);
       * </pre>
       */
      sync: function() {
        update();
  ***REMOVED***,

      listen: function() {
        return listen();
  ***REMOVED***,

      update: function(read) {
        if (read) {
          location = $location.url();
          return;
    ***REMOVED***
        if ($location.url() === location) return;

        $location.url(location);
        $location.replace();
  ***REMOVED***,

      push: function(urlMatcher, params, options) {
         var url = urlMatcher.format(params || {***REMOVED***);

    ***REMOVED*** Handle the special hash param, if needed
        if (url !== null && params && params['#']) {
            url += '#' + params['#'];
    ***REMOVED***

        $location.url(url);
        lastPushedUrl = options && options.$$avoidResync ? $location.url() : undefined;
        if (options && options.replace) $location.replace();
  ***REMOVED***,

      /**
       * @ngdoc function
       * @name ui.router.router.$urlRouter#href
       * @methodOf ui.router.router.$urlRouter
       *
       * @description
       * A URL generation method that returns the compiled URL for a given
       * {@link ui.router.util.type:UrlMatcher `UrlMatcher`***REMOVED***, populated with the provided parameters.
       *
       * @example
       * <pre>
       * $bob = $urlRouter.href(new UrlMatcher("/about/:person"), {
       *   person: "bob"
       * ***REMOVED***);
       * // $bob == "/about/bob";
       * </pre>
       *
       * @param {UrlMatcher***REMOVED*** urlMatcher The `UrlMatcher` object which is used as the template of the URL to generate.
       * @param {object=***REMOVED*** params An object of parameter values to fill the matcher's required parameters.
       * @param {object=***REMOVED*** options Options object. The options are:
       *
       * - **`absolute`** - {boolean=false***REMOVED***,  If true will generate an absolute url, e.g. "http://www.example.com/fullurl".
       *
       * @returns {string***REMOVED*** Returns the fully compiled URL, or `null` if `params` fail validation against `urlMatcher`
       */
      href: function(urlMatcher, params, options) {
        if (!urlMatcher.validates(params)) return null;

        var isHtml5 = $locationProvider.html5Mode();
        if (angular.isObject(isHtml5)) {
          isHtml5 = isHtml5.enabled;
    ***REMOVED***

        isHtml5 = isHtml5 && $sniffer.history;
        
        var url = urlMatcher.format(params);
        options = options || {***REMOVED***;

        if (!isHtml5 && url !== null) {
          url = "#" + $locationProvider.hashPrefix() + url;
    ***REMOVED***

    ***REMOVED*** Handle special hash param, if needed
        if (url !== null && params && params['#']) {
          url += '#' + params['#'];
    ***REMOVED***

        url = appendBasePath(url, isHtml5, options.absolute);

        if (!options.absolute || !url) {
          return url;
    ***REMOVED***

        var slash = (!isHtml5 && url ? '/' : ''), port = $location.port();
        port = (port === 80 || port === 443 ? '' : ':' + port);

        return [$location.protocol(), '://', $location.host(), port, slash, url].join('');
  ***REMOVED***
***REMOVED***;
  ***REMOVED***
***REMOVED***

angular.module('ui.router.router').provider('$urlRouter', $UrlRouterProvider);

/**
 * @ngdoc object
 * @name ui.router.state.$stateProvider
 *
 * @requires ui.router.router.$urlRouterProvider
 * @requires ui.router.util.$urlMatcherFactoryProvider
 *
 * @description
 * The new `$stateProvider` works similar to Angular's v1 router, but it focuses purely
 * on state.
 *
 * A state corresponds to a "place" in the application in terms of the overall UI and
 * navigation. A state describes (via the controller / template / view properties) what
 * the UI looks like and does at that place.
 *
 * States often have things in common, and the primary way of factoring out these
 * commonalities in this model is via the state hierarchy, i.e. parent/child states aka
 * nested states.
 *
 * The `$stateProvider` provides interfaces to declare these states for your app.
 */
$StateProvider.$inject = ['$urlRouterProvider', '$urlMatcherFactoryProvider'];
function $StateProvider(   $urlRouterProvider,   $urlMatcherFactory) {

  var root, states = {***REMOVED***, $state, queue = {***REMOVED***, abstractKey = 'abstract';

  // Builds state properties from definition passed to registerState()
  var stateBuilder = {

***REMOVED*** Derive parent state from a hierarchical name only if 'parent' is not explicitly defined.
***REMOVED*** state.children = [];
***REMOVED*** if (parent) parent.children.push(state);
    parent: function(state) {
      if (isDefined(state.parent) && state.parent) return findState(state.parent);
  ***REMOVED*** regex matches any valid composite state name
  ***REMOVED*** would match "contact.list" but not "contacts"
      var compositeName = /^(.+)\.[^.]+$/.exec(state.name);
      return compositeName ? findState(compositeName[1]) : root;
***REMOVED***,

***REMOVED*** inherit 'data' from parent and override by own values (if any)
    data: function(state) {
      if (state.parent && state.parent.data) {
        state.data = state.self.data = inherit(state.parent.data, state.data);
  ***REMOVED***
      return state.data;
***REMOVED***,

***REMOVED*** Build a URLMatcher if necessary, either via a relative or absolute URL
    url: function(state) {
      var url = state.url, config = { params: state.params || {***REMOVED*** ***REMOVED***;

      if (isString(url)) {
        if (url.charAt(0) == '^') return $urlMatcherFactory.compile(url.substring(1), config);
        return (state.parent.navigable || root).url.concat(url, config);
  ***REMOVED***

      if (!url || $urlMatcherFactory.isMatcher(url)) return url;
      throw new Error("Invalid url '" + url + "' in state '" + state + "'");
***REMOVED***,

***REMOVED*** Keep track of the closest ancestor state that has a URL (i.e. is navigable)
    navigable: function(state) {
      return state.url ? state : (state.parent ? state.parent.navigable : null);
***REMOVED***,

***REMOVED*** Own parameters for this state. state.url.params is already built at this point. Create and add non-url params
    ownParams: function(state) {
      var params = state.url && state.url.params || new $$UMFP.ParamSet();
      forEach(state.params || {***REMOVED***, function(config, id) {
        if (!params[id]) params[id] = new $$UMFP.Param(id, null, config, "config");
  ***REMOVED***);
      return params;
***REMOVED***,

***REMOVED*** Derive parameters for this state and ensure they're a super-set of parent's parameters
    params: function(state) {
      var ownParams = pick(state.ownParams, state.ownParams.$$keys());
      return state.parent && state.parent.params ? extend(state.parent.params.$$new(), ownParams) : new $$UMFP.ParamSet();
***REMOVED***,

***REMOVED*** If there is no explicit multi-view configuration, make one up so we don't have
***REMOVED*** to handle both cases in the view directive later. Note that having an explicit
***REMOVED*** 'views' property will mean the default unnamed view properties are ignored. This
***REMOVED*** is also a good time to resolve view names to absolute names, so everything is a
***REMOVED*** straight lookup at link time.
    views: function(state) {
      var views = {***REMOVED***;

      forEach(isDefined(state.views) ? state.views : { '': state ***REMOVED***, function (view, name) {
        if (name.indexOf('@') < 0) name += '@' + state.parent.name;
        views[name] = view;
  ***REMOVED***);
      return views;
***REMOVED***,

***REMOVED*** Keep a full path from the root down to this state as this is needed for state activation.
    path: function(state) {
      return state.parent ? state.parent.path.concat(state) : []; // exclude root from path
***REMOVED***,

***REMOVED*** Speed up $state.contains() as it's used a lot
    includes: function(state) {
      var includes = state.parent ? extend({***REMOVED***, state.parent.includes) : {***REMOVED***;
      includes[state.name] = true;
      return includes;
***REMOVED***,

    $delegates: {***REMOVED***
  ***REMOVED***;

  function isRelative(stateName) {
    return stateName.indexOf(".") === 0 || stateName.indexOf("^") === 0;
  ***REMOVED***

  function findState(stateOrName, base) {
    if (!stateOrName) return undefined;

    var isStr = isString(stateOrName),
        name  = isStr ? stateOrName : stateOrName.name,
        path  = isRelative(name);

    if (path) {
      if (!base) throw new Error("No reference point given for path '"  + name + "'");
      base = findState(base);
      
      var rel = name.split("."), i = 0, pathLength = rel.length, current = base;

      for (; i < pathLength; i++) {
        if (rel[i] === "" && i === 0) {
          current = base;
          continue;
    ***REMOVED***
        if (rel[i] === "^") {
          if (!current.parent) throw new Error("Path '" + name + "' not valid for state '" + base.name + "'");
          current = current.parent;
          continue;
    ***REMOVED***
        break;
  ***REMOVED***
      rel = rel.slice(i).join(".");
      name = current.name + (current.name && rel ? "." : "") + rel;
***REMOVED***
    var state = states[name];

    if (state && (isStr || (!isStr && (state === stateOrName || state.self === stateOrName)))) {
      return state;
***REMOVED***
    return undefined;
  ***REMOVED***

  function queueState(parentName, state) {
    if (!queue[parentName]) {
      queue[parentName] = [];
***REMOVED***
    queue[parentName].push(state);
  ***REMOVED***

  function flushQueuedChildren(parentName) {
    var queued = queue[parentName] || [];
    while(queued.length) {
      registerState(queued.shift());
***REMOVED***
  ***REMOVED***

  function registerState(state) {
***REMOVED*** Wrap a new object around the state so we can store our private details easily.
    state = inherit(state, {
      self: state,
      resolve: state.resolve || {***REMOVED***,
      toString: function() { return this.name; ***REMOVED***
***REMOVED***);

    var name = state.name;
    if (!isString(name) || name.indexOf('@') >= 0) throw new Error("State must have a valid name");
    if (states.hasOwnProperty(name)) throw new Error("State '" + name + "' is already defined");

***REMOVED*** Get parent name
    var parentName = (name.indexOf('.') !== -1) ? name.substring(0, name.lastIndexOf('.'))
        : (isString(state.parent)) ? state.parent
        : (isObject(state.parent) && isString(state.parent.name)) ? state.parent.name
        : '';

***REMOVED*** If parent is not registered yet, add state to queue and register later
    if (parentName && !states[parentName]) {
      return queueState(parentName, state.self);
***REMOVED***

    for (var key in stateBuilder) {
      if (isFunction(stateBuilder[key])) state[key] = stateBuilder[key](state, stateBuilder.$delegates[key]);
***REMOVED***
    states[name] = state;

***REMOVED*** Register the state in the global state list and with $urlRouter if necessary.
    if (!state[abstractKey] && state.url) {
      $urlRouterProvider.when(state.url, ['$match', '$stateParams', function ($match, $stateParams) {
        if ($state.$current.navigable != state || !equalForKeys($match, $stateParams)) {
          $state.transitionTo(state, $match, { inherit: true, location: false ***REMOVED***);
    ***REMOVED***
  ***REMOVED***]);
***REMOVED***

***REMOVED*** Register any queued children
    flushQueuedChildren(name);

    return state;
  ***REMOVED***

  // Checks text to see if it looks like a glob.
  function isGlob (text) {
    return text.indexOf('*') > -1;
  ***REMOVED***

  // Returns true if glob matches current $state name.
  function doesStateMatchGlob (glob) {
    var globSegments = glob.split('.'),
        segments = $state.$current.name.split('.');

***REMOVED***match single stars
    for (var i = 0, l = globSegments.length; i < l; i++) {
      if (globSegments[i] === '*') {
        segments[i] = '*';
  ***REMOVED***
***REMOVED***

***REMOVED***match greedy starts
    if (globSegments[0] === '**') {
       segments = segments.slice(indexOf(segments, globSegments[1]));
       segments.unshift('**');
***REMOVED***
***REMOVED***match greedy ends
    if (globSegments[globSegments.length - 1] === '**') {
       segments.splice(indexOf(segments, globSegments[globSegments.length - 2]) + 1, Number.MAX_VALUE);
       segments.push('**');
***REMOVED***

    if (globSegments.length != segments.length) {
      return false;
***REMOVED***

    return segments.join('') === globSegments.join('');
  ***REMOVED***


  // Implicit root state that is always active
  root = registerState({
    name: '',
    url: '^',
    views: null,
    'abstract': true
  ***REMOVED***);
  root.navigable = null;


  /**
   * @ngdoc function
   * @name ui.router.state.$stateProvider#decorator
   * @methodOf ui.router.state.$stateProvider
   *
   * @description
   * Allows you to extend (carefully) or override (at your own peril) the 
   * `stateBuilder` object used internally by `$stateProvider`. This can be used 
   * to add custom functionality to ui-router, for example inferring templateUrl 
   * based on the state name.
   *
   * When passing only a name, it returns the current (original or decorated) builder
   * function that matches `name`.
   *
   * The builder functions that can be decorated are listed below. Though not all
   * necessarily have a good use case for decoration, that is up to you to decide.
   *
   * In addition, users can attach custom decorators, which will generate new 
   * properties within the state's internal definition. There is currently no clear 
   * use-case for this beyond accessing internal states (i.e. $state.$current), 
   * however, expect this to become increasingly relevant as we introduce additional 
   * meta-programming features.
   *
   * **Warning**: Decorators should not be interdependent because the order of 
   * execution of the builder functions in non-deterministic. Builder functions 
   * should only be dependent on the state definition object and super function.
   *
   *
   * Existing builder functions and current return values:
   *
   * - **parent** `{object***REMOVED***` - returns the parent state object.
   * - **data** `{object***REMOVED***` - returns state data, including any inherited data that is not
   *   overridden by own values (if any).
   * - **url** `{object***REMOVED***` - returns a {@link ui.router.util.type:UrlMatcher UrlMatcher***REMOVED***
   *   or `null`.
   * - **navigable** `{object***REMOVED***` - returns closest ancestor state that has a URL (aka is 
   *   navigable).
   * - **params** `{object***REMOVED***` - returns an array of state params that are ensured to 
   *   be a super-set of parent's params.
   * - **views** `{object***REMOVED***` - returns a views object where each key is an absolute view 
   *   name (i.e. "viewName@stateName") and each value is the config object 
   *   (template, controller) for the view. Even when you don't use the views object 
   *   explicitly on a state config, one is still created for you internally.
   *   So by decorating this builder function you have access to decorating template 
   *   and controller properties.
   * - **ownParams** `{object***REMOVED***` - returns an array of params that belong to the state, 
   *   not including any params defined by ancestor states.
   * - **path** `{string***REMOVED***` - returns the full path from the root down to this state. 
   *   Needed for state activation.
   * - **includes** `{object***REMOVED***` - returns an object that includes every state that 
   *   would pass a `$state.includes()` test.
   *
   * @example
   * <pre>
   * // Override the internal 'views' builder with a function that takes the state
   * // definition, and a reference to the internal function being overridden:
   * $stateProvider.decorator('views', function (state, parent) {
   *   var result = {***REMOVED***,
   *       views = parent(state);
   *
   *   angular.forEach(views, function (config, name) {
   *     var autoName = (state.name + '.' + name).replace('.', '/');
   *     config.templateUrl = config.templateUrl || '/partials/' + autoName + '.html';
   *     result[name] = config;
   *   ***REMOVED***);
   *   return result;
   * ***REMOVED***);
   *
   * $stateProvider.state('home', {
   *   views: {
   *     'contact.list': { controller: 'ListController' ***REMOVED***,
   *     'contact.item': { controller: 'ItemController' ***REMOVED***
   *   ***REMOVED***
   * ***REMOVED***);
   *
   * // ...
   *
   * $state.go('home');
   * // Auto-populates list and item views with /partials/home/contact/list.html,
   * // and /partials/home/contact/item.html, respectively.
   * </pre>
   *
   * @param {string***REMOVED*** name The name of the builder function to decorate. 
   * @param {object***REMOVED*** func A function that is responsible for decorating the original 
   * builder function. The function receives two parameters:
   *
   *   - `{object***REMOVED***` - state - The state config object.
   *   - `{object***REMOVED***` - super - The original builder function.
   *
   * @return {object***REMOVED*** $stateProvider - $stateProvider instance
   */
  this.decorator = decorator;
  function decorator(name, func) {
    /*jshint validthis: true */
    if (isString(name) && !isDefined(func)) {
      return stateBuilder[name];
***REMOVED***
    if (!isFunction(func) || !isString(name)) {
      return this;
***REMOVED***
    if (stateBuilder[name] && !stateBuilder.$delegates[name]) {
      stateBuilder.$delegates[name] = stateBuilder[name];
***REMOVED***
    stateBuilder[name] = func;
    return this;
  ***REMOVED***

  /**
   * @ngdoc function
   * @name ui.router.state.$stateProvider#state
   * @methodOf ui.router.state.$stateProvider
   *
   * @description
   * Registers a state configuration under a given state name. The stateConfig object
   * has the following acceptable properties.
   *
   * @param {string***REMOVED*** name A unique state name, e.g. "home", "about", "contacts".
   * To create a parent/child state use a dot, e.g. "about.sales", "home.newest".
   * @param {object***REMOVED*** stateConfig State configuration object.
   * @param {string|function=***REMOVED*** stateConfig.template
   * <a id='template'></a>
   *   html template as a string or a function that returns
   *   an html template as a string which should be used by the uiView directives. This property 
   *   takes precedence over templateUrl.
   *   
   *   If `template` is a function, it will be called with the following parameters:
   *
   *   - {array.&lt;object&gt;***REMOVED*** - state parameters extracted from the current $location.path() by
   *     applying the current state
   *
   * <pre>template:
   *   "<h1>inline template definition</h1>" +
   *   "<div ui-view></div>"</pre>
   * <pre>template: function(params) {
   *       return "<h1>generated template</h1>"; ***REMOVED***</pre>
   * </div>
   *
   * @param {string|function=***REMOVED*** stateConfig.templateUrl
   * <a id='templateUrl'></a>
   *
   *   path or function that returns a path to an html
   *   template that should be used by uiView.
   *   
   *   If `templateUrl` is a function, it will be called with the following parameters:
   *
   *   - {array.&lt;object&gt;***REMOVED*** - state parameters extracted from the current $location.path() by 
   *     applying the current state
   *
   * <pre>templateUrl: "home.html"</pre>
   * <pre>templateUrl: function(params) {
   *     return myTemplates[params.pageId]; ***REMOVED***</pre>
   *
   * @param {function=***REMOVED*** stateConfig.templateProvider
   * <a id='templateProvider'></a>
   *    Provider function that returns HTML content string.
   * <pre> templateProvider:
   *       function(MyTemplateService, params) {
   *         return MyTemplateService.getTemplate(params.pageId);
   *   ***REMOVED***</pre>
   *
   * @param {string|function=***REMOVED*** stateConfig.controller
   * <a id='controller'></a>
   *
   *  Controller fn that should be associated with newly
   *   related scope or the name of a registered controller if passed as a string.
   *   Optionally, the ControllerAs may be declared here.
   * <pre>controller: "MyRegisteredController"</pre>
   * <pre>controller:
   *     "MyRegisteredController as fooCtrl"***REMOVED***</pre>
   * <pre>controller: function($scope, MyService) {
   *     $scope.data = MyService.getData(); ***REMOVED***</pre>
   *
   * @param {function=***REMOVED*** stateConfig.controllerProvider
   * <a id='controllerProvider'></a>
   *
   * Injectable provider function that returns the actual controller or string.
   * <pre>controllerProvider:
   *   function(MyResolveData) {
   *     if (MyResolveData.foo)
   *       return "FooCtrl"
   *     else if (MyResolveData.bar)
   *       return "BarCtrl";
   *     else return function($scope) {
   *       $scope.baz = "Qux";
   * ***REMOVED***
   *   ***REMOVED***</pre>
   *
   * @param {string=***REMOVED*** stateConfig.controllerAs
   * <a id='controllerAs'></a>
   * 
   * A controller alias name. If present the controller will be
   *   published to scope under the controllerAs name.
   * <pre>controllerAs: "myCtrl"</pre>
   *
   * @param {string|object=***REMOVED*** stateConfig.parent
   * <a id='parent'></a>
   * Optionally specifies the parent state of this state.
   *
   * <pre>parent: 'parentState'</pre>
   * <pre>parent: parentState // JS variable</pre>
   *
   * @param {object=***REMOVED*** stateConfig.resolve
   * <a id='resolve'></a>
   *
   * An optional map&lt;string, function&gt; of dependencies which
   *   should be injected into the controller. If any of these dependencies are promises, 
   *   the router will wait for them all to be resolved before the controller is instantiated.
   *   If all the promises are resolved successfully, the $stateChangeSuccess event is fired
   *   and the values of the resolved promises are injected into any controllers that reference them.
   *   If any  of the promises are rejected the $stateChangeError event is fired.
   *
   *   The map object is:
   *   
   *   - key - {string***REMOVED***: name of dependency to be injected into controller
   *   - factory - {string|function***REMOVED***: If string then it is alias for service. Otherwise if function, 
   *     it is injected and return value it treated as dependency. If result is a promise, it is 
   *     resolved before its value is injected into controller.
   *
   * <pre>resolve: {
   *     myResolve1:
   *       function($http, $stateParams) {
   *         return $http.get("/api/foos/"+stateParams.fooID);
   *   ***REMOVED***
   * ***REMOVED***</pre>
   *
   * @param {string=***REMOVED*** stateConfig.url
   * <a id='url'></a>
   *
   *   A url fragment with optional parameters. When a state is navigated or
   *   transitioned to, the `$stateParams` service will be populated with any 
   *   parameters that were passed.
   *
   *   (See {@link ui.router.util.type:UrlMatcher UrlMatcher***REMOVED*** `UrlMatcher`***REMOVED*** for
   *   more details on acceptable patterns )
   *
   * examples:
   * <pre>url: "/home"
   * url: "/users/:userid"
   * url: "/books/{bookid:[a-zA-Z_-]***REMOVED***"
   * url: "/books/{categoryid:int***REMOVED***"
   * url: "/books/{publishername:string***REMOVED***/{categoryid:int***REMOVED***"
   * url: "/messages?before&after"
   * url: "/messages?{before:date***REMOVED***&{after:date***REMOVED***"
   * url: "/messages/:mailboxid?{before:date***REMOVED***&{after:date***REMOVED***"
   * </pre>
   *
   * @param {object=***REMOVED*** stateConfig.views
   * <a id='views'></a>
   * an optional map&lt;string, object&gt; which defined multiple views, or targets views
   * manually/explicitly.
   *
   * Examples:
   *
   * Targets three named `ui-view`s in the parent state's template
   * <pre>views: {
   *     header: {
   *       controller: "headerCtrl",
   *       templateUrl: "header.html"
   * ***REMOVED***, body: {
   *       controller: "bodyCtrl",
   *       templateUrl: "body.html"
   * ***REMOVED***, footer: {
   *       controller: "footCtrl",
   *       templateUrl: "footer.html"
   * ***REMOVED***
   *   ***REMOVED***</pre>
   *
   * Targets named `ui-view="header"` from grandparent state 'top''s template, and named `ui-view="body" from parent state's template.
   * <pre>views: {
   *     'header@top': {
   *       controller: "msgHeaderCtrl",
   *       templateUrl: "msgHeader.html"
   * ***REMOVED***, 'body': {
   *       controller: "messagesCtrl",
   *       templateUrl: "messages.html"
   * ***REMOVED***
   *   ***REMOVED***</pre>
   *
   * @param {boolean=***REMOVED*** [stateConfig.abstract=false]
   * <a id='abstract'></a>
   * An abstract state will never be directly activated,
   *   but can provide inherited properties to its common children states.
   * <pre>abstract: true</pre>
   *
   * @param {function=***REMOVED*** stateConfig.onEnter
   * <a id='onEnter'></a>
   *
   * Callback function for when a state is entered. Good way
   *   to trigger an action or dispatch an event, such as opening a dialog.
   * If minifying your scripts, make sure to explicitly annotate this function,
   * because it won't be automatically annotated by your build tools.
   *
   * <pre>onEnter: function(MyService, $stateParams) {
   *     MyService.foo($stateParams.myParam);
   * ***REMOVED***</pre>
   *
   * @param {function=***REMOVED*** stateConfig.onExit
   * <a id='onExit'></a>
   *
   * Callback function for when a state is exited. Good way to
   *   trigger an action or dispatch an event, such as opening a dialog.
   * If minifying your scripts, make sure to explicitly annotate this function,
   * because it won't be automatically annotated by your build tools.
   *
   * <pre>onExit: function(MyService, $stateParams) {
   *     MyService.cleanup($stateParams.myParam);
   * ***REMOVED***</pre>
   *
   * @param {boolean=***REMOVED*** [stateConfig.reloadOnSearch=true]
   * <a id='reloadOnSearch'></a>
   *
   * If `false`, will not retrigger the same state
   *   just because a search/query parameter has changed (via $location.search() or $location.hash()). 
   *   Useful for when you'd like to modify $location.search() without triggering a reload.
   * <pre>reloadOnSearch: false</pre>
   *
   * @param {object=***REMOVED*** stateConfig.data
   * <a id='data'></a>
   *
   * Arbitrary data object, useful for custom configuration.  The parent state's `data` is
   *   prototypally inherited.  In other words, adding a data property to a state adds it to
   *   the entire subtree via prototypal inheritance.
   *
   * <pre>data: {
   *     requiredRole: 'foo'
   * ***REMOVED*** </pre>
   *
   * @param {object=***REMOVED*** stateConfig.params
   * <a id='params'></a>
   *
   * A map which optionally configures parameters declared in the `url`, or
   *   defines additional non-url parameters.  For each parameter being
   *   configured, add a configuration object keyed to the name of the parameter.
   *
   *   Each parameter configuration object may contain the following properties:
   *
   *   - ** value ** - {object|function=***REMOVED***: specifies the default value for this
   *     parameter.  This implicitly sets this parameter as optional.
   *
   *     When UI-Router routes to a state and no value is
   *     specified for this parameter in the URL or transition, the
   *     default value will be used instead.  If `value` is a function,
   *     it will be injected and invoked, and the return value used.
   *
   *     *Note*: `undefined` is treated as "no default value" while `null`
   *     is treated as "the default value is `null`".
   *
   *     *Shorthand*: If you only need to configure the default value of the
   *     parameter, you may use a shorthand syntax.   In the **`params`**
   *     map, instead mapping the param name to a full parameter configuration
   *     object, simply set map it to the default parameter value, e.g.:
   *
   * <pre>// define a parameter's default value
   * params: {
   *     param1: { value: "defaultValue" ***REMOVED***
   * ***REMOVED***
   * // shorthand default values
   * params: {
   *     param1: "defaultValue",
   *     param2: "param2Default"
   * ***REMOVED***</pre>
   *
   *   - ** array ** - {boolean=***REMOVED***: *(default: false)* If true, the param value will be
   *     treated as an array of values.  If you specified a Type, the value will be
   *     treated as an array of the specified Type.  Note: query parameter values
   *     default to a special `"auto"` mode.
   *
   *     For query parameters in `"auto"` mode, if multiple  values for a single parameter
   *     are present in the URL (e.g.: `/foo?bar=1&bar=2&bar=3`) then the values
   *     are mapped to an array (e.g.: `{ foo: [ '1', '2', '3' ] ***REMOVED***`).  However, if
   *     only one value is present (e.g.: `/foo?bar=1`) then the value is treated as single
   *     value (e.g.: `{ foo: '1' ***REMOVED***`).
   *
   * <pre>params: {
   *     param1: { array: true ***REMOVED***
   * ***REMOVED***</pre>
   *
   *   - ** squash ** - {bool|string=***REMOVED***: `squash` configures how a default parameter value is represented in the URL when
   *     the current parameter value is the same as the default value. If `squash` is not set, it uses the
   *     configured default squash policy.
   *     (See {@link ui.router.util.$urlMatcherFactory#methods_defaultSquashPolicy `defaultSquashPolicy()`***REMOVED***)
   *
   *   There are three squash settings:
   *
   *     - false: The parameter's default value is not squashed.  It is encoded and included in the URL
   *     - true: The parameter's default value is omitted from the URL.  If the parameter is preceeded and followed
   *       by slashes in the state's `url` declaration, then one of those slashes are omitted.
   *       This can allow for cleaner looking URLs.
   *     - `"<arbitrary string>"`: The parameter's default value is replaced with an arbitrary placeholder of  your choice.
   *
   * <pre>params: {
   *     param1: {
   *       value: "defaultId",
   *       squash: true
   * ***REMOVED*** ***REMOVED***
   * // squash "defaultValue" to "~"
   * params: {
   *     param1: {
   *       value: "defaultValue",
   *       squash: "~"
   * ***REMOVED*** ***REMOVED***
   * </pre>
   *
   *
   * @example
   * <pre>
   * // Some state name examples
   *
   * // stateName can be a single top-level name (must be unique).
   * $stateProvider.state("home", {***REMOVED***);
   *
   * // Or it can be a nested state name. This state is a child of the
   * // above "home" state.
   * $stateProvider.state("home.newest", {***REMOVED***);
   *
   * // Nest states as deeply as needed.
   * $stateProvider.state("home.newest.abc.xyz.inception", {***REMOVED***);
   *
   * // state() returns $stateProvider, so you can chain state declarations.
   * $stateProvider
   *   .state("home", {***REMOVED***)
   *   .state("about", {***REMOVED***)
   *   .state("contacts", {***REMOVED***);
   * </pre>
   *
   */
  this.state = state;
  function state(name, definition) {
    /*jshint validthis: true */
    if (isObject(name)) definition = name;
    else definition.name = name;
    registerState(definition);
    return this;
  ***REMOVED***

  /**
   * @ngdoc object
   * @name ui.router.state.$state
   *
   * @requires $rootScope
   * @requires $q
   * @requires ui.router.state.$view
   * @requires $injector
   * @requires ui.router.util.$resolve
   * @requires ui.router.state.$stateParams
   * @requires ui.router.router.$urlRouter
   *
   * @property {object***REMOVED*** params A param object, e.g. {sectionId: section.id)***REMOVED***, that 
   * you'd like to test against the current active state.
   * @property {object***REMOVED*** current A reference to the state's config object. However 
   * you passed it in. Useful for accessing custom data.
   * @property {object***REMOVED*** transition Currently pending transition. A promise that'll 
   * resolve or reject.
   *
   * @description
   * `$state` service is responsible for representing states as well as transitioning
   * between them. It also provides interfaces to ask for current state or even states
   * you're coming from.
   */
  this.$get = $get;
  $get.$inject = ['$rootScope', '$q', '$view', '$injector', '$resolve', '$stateParams', '$urlRouter', '$location', '$urlMatcherFactory'];
  function $get(   $rootScope,   $q,   $view,   $injector,   $resolve,   $stateParams,   $urlRouter,   $location,   $urlMatcherFactory) {

    var TransitionSuperseded = $q.reject(new Error('transition superseded'));
    var TransitionPrevented = $q.reject(new Error('transition prevented'));
    var TransitionAborted = $q.reject(new Error('transition aborted'));
    var TransitionFailed = $q.reject(new Error('transition failed'));

***REMOVED*** Handles the case where a state which is the target of a transition is not found, and the user
***REMOVED*** can optionally retry or defer the transition
    function handleRedirect(redirect, state, params, options) {
      /**
       * @ngdoc event
       * @name ui.router.state.$state#$stateNotFound
       * @eventOf ui.router.state.$state
       * @eventType broadcast on root scope
       * @description
       * Fired when a requested state **cannot be found** using the provided state name during transition.
       * The event is broadcast allowing any handlers a single chance to deal with the error (usually by
       * lazy-loading the unfound state). A special `unfoundState` object is passed to the listener handler,
       * you can see its three properties in the example. You can use `event.preventDefault()` to abort the
       * transition and the promise returned from `go` will be rejected with a `'transition aborted'` value.
       *
       * @param {Object***REMOVED*** event Event object.
       * @param {Object***REMOVED*** unfoundState Unfound State information. Contains: `to, toParams, options` properties.
       * @param {State***REMOVED*** fromState Current state object.
       * @param {Object***REMOVED*** fromParams Current state params.
       *
       * @example
       *
       * <pre>
       * // somewhere, assume lazy.state has not been defined
       * $state.go("lazy.state", {a:1, b:2***REMOVED***, {inherit:false***REMOVED***);
       *
       * // somewhere else
       * $scope.$on('$stateNotFound',
       * function(event, unfoundState, fromState, fromParams){
       *     console.log(unfoundState.to); // "lazy.state"
       *     console.log(unfoundState.toParams); // {a:1, b:2***REMOVED***
       *     console.log(unfoundState.options); // {inherit:false***REMOVED*** + default options
       * ***REMOVED***)
       * </pre>
       */
      var evt = $rootScope.$broadcast('$stateNotFound', redirect, state, params);

      if (evt.defaultPrevented) {
        $urlRouter.update();
        return TransitionAborted;
  ***REMOVED***

      if (!evt.retry) {
        return null;
  ***REMOVED***

  ***REMOVED*** Allow the handler to return a promise to defer state lookup retry
      if (options.$retry) {
        $urlRouter.update();
        return TransitionFailed;
  ***REMOVED***
      var retryTransition = $state.transition = $q.when(evt.retry);

      retryTransition.then(function() {
        if (retryTransition !== $state.transition) return TransitionSuperseded;
        redirect.options.$retry = true;
        return $state.transitionTo(redirect.to, redirect.toParams, redirect.options);
  ***REMOVED***, function() {
        return TransitionAborted;
  ***REMOVED***);
      $urlRouter.update();

      return retryTransition;
***REMOVED***

    root.locals = { resolve: null, globals: { $stateParams: {***REMOVED*** ***REMOVED*** ***REMOVED***;

    $state = {
      params: {***REMOVED***,
      current: root.self,
      $current: root,
      transition: null
***REMOVED***;

    /**
     * @ngdoc function
     * @name ui.router.state.$state#reload
     * @methodOf ui.router.state.$state
     *
     * @description
     * A method that force reloads the current state. All resolves are re-resolved,
     * controllers reinstantiated, and events re-fired.
     *
     * @example
     * <pre>
     * var app angular.module('app', ['ui.router']);
     *
     * app.controller('ctrl', function ($scope, $state) {
     *   $scope.reload = function(){
     *     $state.reload();
     *   ***REMOVED***
     * ***REMOVED***);
     * </pre>
     *
     * `reload()` is just an alias for:
     * <pre>
     * $state.transitionTo($state.current, $stateParams, { 
     *   reload: true, inherit: false, notify: true
     * ***REMOVED***);
     * </pre>
     *
     * @param {string=|object=***REMOVED*** state - A state name or a state object, which is the root of the resolves to be re-resolved.
     * @example
     * <pre>
     * //assuming app application consists of 3 states: 'contacts', 'contacts.detail', 'contacts.detail.item' 
     * //and current state is 'contacts.detail.item'
     * var app angular.module('app', ['ui.router']);
     *
     * app.controller('ctrl', function ($scope, $state) {
     *   $scope.reload = function(){
     * ***REMOVED***will reload 'contact.detail' and 'contact.detail.item' states
     *     $state.reload('contact.detail');
     *   ***REMOVED***
     * ***REMOVED***);
     * </pre>
     *
     * `reload()` is just an alias for:
     * <pre>
     * $state.transitionTo($state.current, $stateParams, { 
     *   reload: true, inherit: false, notify: true
     * ***REMOVED***);
     * </pre>

     * @returns {promise***REMOVED*** A promise representing the state of the new transition. See
     * {@link ui.router.state.$state#methods_go $state.go***REMOVED***.
     */
    $state.reload = function reload(state) {
      return $state.transitionTo($state.current, $stateParams, { reload: state || true, inherit: false, notify: true***REMOVED***);
***REMOVED***;

    /**
     * @ngdoc function
     * @name ui.router.state.$state#go
     * @methodOf ui.router.state.$state
     *
     * @description
     * Convenience method for transitioning to a new state. `$state.go` calls 
     * `$state.transitionTo` internally but automatically sets options to 
     * `{ location: true, inherit: true, relative: $state.$current, notify: true ***REMOVED***`. 
     * This allows you to easily use an absolute or relative to path and specify 
     * only the parameters you'd like to update (while letting unspecified parameters 
     * inherit from the currently active ancestor states).
     *
     * @example
     * <pre>
     * var app = angular.module('app', ['ui.router']);
     *
     * app.controller('ctrl', function ($scope, $state) {
     *   $scope.changeState = function () {
     *     $state.go('contact.detail');
     *   ***REMOVED***;
     * ***REMOVED***);
     * </pre>
     * <img src='../ngdoc_assets/StateGoExamples.png'/>
     *
     * @param {string***REMOVED*** to Absolute state name or relative state path. Some examples:
     *
     * - `$state.go('contact.detail')` - will go to the `contact.detail` state
     * - `$state.go('^')` - will go to a parent state
     * - `$state.go('^.sibling')` - will go to a sibling state
     * - `$state.go('.child.grandchild')` - will go to grandchild state
     *
     * @param {object=***REMOVED*** params A map of the parameters that will be sent to the state, 
     * will populate $stateParams. Any parameters that are not specified will be inherited from currently 
     * defined parameters. Only parameters specified in the state definition can be overridden, new 
     * parameters will be ignored. This allows, for example, going to a sibling state that shares parameters
     * specified in a parent state. Parameter inheritance only works between common ancestor states, I.e.
     * transitioning to a sibling will get you the parameters for all parents, transitioning to a child
     * will get you all current parameters, etc.
     * @param {object=***REMOVED*** options Options object. The options are:
     *
     * - **`location`** - {boolean=true|string=***REMOVED*** - If `true` will update the url in the location bar, if `false`
     *    will not. If string, must be `"replace"`, which will update url and also replace last history record.
     * - **`inherit`** - {boolean=true***REMOVED***, If `true` will inherit url parameters from current url.
     * - **`relative`** - {object=$state.$current***REMOVED***, When transitioning with relative path (e.g '^'), 
     *    defines which state to be relative from.
     * - **`notify`** - {boolean=true***REMOVED***, If `true` will broadcast $stateChangeStart and $stateChangeSuccess events.
     * - **`reload`** (v0.2.5) - {boolean=false|string|object***REMOVED***, If `true` will force transition even if no state or params
     *    have changed.  It will reload the resolves and views of the current state and parent states.
     *    If `reload` is a string (or state object), the state object is fetched (by name, or object reference); and \
     *    the transition reloads the resolves and views for that matched state, and all its children states.
     *
     * @returns {promise***REMOVED*** A promise representing the state of the new transition.
     *
     * Possible success values:
     *
     * - $state.current
     *
     * <br/>Possible rejection values:
     *
     * - 'transition superseded' - when a newer transition has been started after this one
     * - 'transition prevented' - when `event.preventDefault()` has been called in a `$stateChangeStart` listener
     * - 'transition aborted' - when `event.preventDefault()` has been called in a `$stateNotFound` listener or
     *   when a `$stateNotFound` `event.retry` promise errors.
     * - 'transition failed' - when a state has been unsuccessfully found after 2 tries.
     * - *resolve error* - when an error has occurred with a `resolve`
     *
     */
    $state.go = function go(to, params, options) {
      return $state.transitionTo(to, params, extend({ inherit: true, relative: $state.$current ***REMOVED***, options));
***REMOVED***;

    /**
     * @ngdoc function
     * @name ui.router.state.$state#transitionTo
     * @methodOf ui.router.state.$state
     *
     * @description
     * Low-level method for transitioning to a new state. {@link ui.router.state.$state#methods_go $state.go***REMOVED***
     * uses `transitionTo` internally. `$state.go` is recommended in most situations.
     *
     * @example
     * <pre>
     * var app = angular.module('app', ['ui.router']);
     *
     * app.controller('ctrl', function ($scope, $state) {
     *   $scope.changeState = function () {
     *     $state.transitionTo('contact.detail');
     *   ***REMOVED***;
     * ***REMOVED***);
     * </pre>
     *
     * @param {string***REMOVED*** to State name.
     * @param {object=***REMOVED*** toParams A map of the parameters that will be sent to the state,
     * will populate $stateParams.
     * @param {object=***REMOVED*** options Options object. The options are:
     *
     * - **`location`** - {boolean=true|string=***REMOVED*** - If `true` will update the url in the location bar, if `false`
     *    will not. If string, must be `"replace"`, which will update url and also replace last history record.
     * - **`inherit`** - {boolean=false***REMOVED***, If `true` will inherit url parameters from current url.
     * - **`relative`** - {object=***REMOVED***, When transitioning with relative path (e.g '^'), 
     *    defines which state to be relative from.
     * - **`notify`** - {boolean=true***REMOVED***, If `true` will broadcast $stateChangeStart and $stateChangeSuccess events.
     * - **`reload`** (v0.2.5) - {boolean=false|string=|object=***REMOVED***, If `true` will force transition even if the state or params 
     *    have not changed, aka a reload of the same state. It differs from reloadOnSearch because you'd
     *    use this when you want to force a reload when *everything* is the same, including search params.
     *    if String, then will reload the state with the name given in reload, and any children.
     *    if Object, then a stateObj is expected, will reload the state found in stateObj, and any children.
     *
     * @returns {promise***REMOVED*** A promise representing the state of the new transition. See
     * {@link ui.router.state.$state#methods_go $state.go***REMOVED***.
     */
    $state.transitionTo = function transitionTo(to, toParams, options) {
      toParams = toParams || {***REMOVED***;
      options = extend({
        location: true, inherit: false, relative: null, notify: true, reload: false, $retry: false
  ***REMOVED***, options || {***REMOVED***);

      var from = $state.$current, fromParams = $state.params, fromPath = from.path;
      var evt, toState = findState(to, options.relative);

  ***REMOVED*** Store the hash param for later (since it will be stripped out by various methods)
      var hash = toParams['#'];

      if (!isDefined(toState)) {
        var redirect = { to: to, toParams: toParams, options: options ***REMOVED***;
        var redirectResult = handleRedirect(redirect, from.self, fromParams, options);

        if (redirectResult) {
          return redirectResult;
    ***REMOVED***

    ***REMOVED*** Always retry once if the $stateNotFound was not prevented
    ***REMOVED*** (handles either redirect changed or state lazy-definition)
        to = redirect.to;
        toParams = redirect.toParams;
        options = redirect.options;
        toState = findState(to, options.relative);

        if (!isDefined(toState)) {
          if (!options.relative) throw new Error("No such state '" + to + "'");
          throw new Error("Could not resolve '" + to + "' from state '" + options.relative + "'");
    ***REMOVED***
  ***REMOVED***
      if (toState[abstractKey]) throw new Error("Cannot transition to abstract state '" + to + "'");
      if (options.inherit) toParams = inheritParams($stateParams, toParams || {***REMOVED***, $state.$current, toState);
      if (!toState.params.$$validates(toParams)) return TransitionFailed;

      toParams = toState.params.$$values(toParams);
      to = toState;

      var toPath = to.path;

  ***REMOVED*** Starting from the root of the path, keep all levels that haven't changed
      var keep = 0, state = toPath[keep], locals = root.locals, toLocals = [];

      if (!options.reload) {
        while (state && state === fromPath[keep] && state.ownParams.$$equals(toParams, fromParams)) {
          locals = toLocals[keep] = state.locals;
          keep++;
          state = toPath[keep];
    ***REMOVED***
  ***REMOVED*** else if (isString(options.reload) || isObject(options.reload)) {
        if (isObject(options.reload) && !options.reload.name) {
          throw new Error('Invalid reload state object');
    ***REMOVED***
        
        var reloadState = options.reload === true ? fromPath[0] : findState(options.reload);
        if (options.reload && !reloadState) {
          throw new Error("No such reload state '" + (isString(options.reload) ? options.reload : options.reload.name) + "'");
    ***REMOVED***

        while (state && state === fromPath[keep] && state !== reloadState) {
          locals = toLocals[keep] = state.locals;
          keep++;
          state = toPath[keep];
    ***REMOVED***
  ***REMOVED***

  ***REMOVED*** If we're going to the same state and all locals are kept, we've got nothing to do.
  ***REMOVED*** But clear 'transition', as we still want to cancel any other pending transitions.
  ***REMOVED*** TODO: We may not want to bump 'transition' if we're called from a location change
  ***REMOVED*** that we've initiated ourselves, because we might accidentally abort a legitimate
  ***REMOVED*** transition initiated from code?
      if (shouldSkipReload(to, toParams, from, fromParams, locals, options)) {
        if (hash) toParams['#'] = hash;
        $state.params = toParams;
        copy($state.params, $stateParams);
        copy(filterByKeys(to.params.$$keys(), $stateParams), to.locals.globals.$stateParams);
        if (options.location && to.navigable && to.navigable.url) {
          $urlRouter.push(to.navigable.url, toParams, {
            $$avoidResync: true, replace: options.location === 'replace'
      ***REMOVED***);
          $urlRouter.update(true);
    ***REMOVED***
        $state.transition = null;
        return $q.when($state.current);
  ***REMOVED***

  ***REMOVED*** Filter parameters before we pass them to event handlers etc.
      toParams = filterByKeys(to.params.$$keys(), toParams || {***REMOVED***);
      
  ***REMOVED*** Re-add the saved hash before we start returning things or broadcasting $stateChangeStart
      if (hash) toParams['#'] = hash;
      
  ***REMOVED*** Broadcast start event and cancel the transition if requested
      if (options.notify) {
        /**
         * @ngdoc event
         * @name ui.router.state.$state#$stateChangeStart
         * @eventOf ui.router.state.$state
         * @eventType broadcast on root scope
         * @description
         * Fired when the state transition **begins**. You can use `event.preventDefault()`
         * to prevent the transition from happening and then the transition promise will be
         * rejected with a `'transition prevented'` value.
         *
         * @param {Object***REMOVED*** event Event object.
         * @param {State***REMOVED*** toState The state being transitioned to.
         * @param {Object***REMOVED*** toParams The params supplied to the `toState`.
         * @param {State***REMOVED*** fromState The current state, pre-transition.
         * @param {Object***REMOVED*** fromParams The params supplied to the `fromState`.
         *
         * @example
         *
         * <pre>
         * $rootScope.$on('$stateChangeStart',
         * function(event, toState, toParams, fromState, fromParams){
         *     event.preventDefault();
         * ***REMOVED*** transitionTo() promise will be rejected with
         * ***REMOVED*** a 'transition prevented' error
         * ***REMOVED***)
         * </pre>
         */
        if ($rootScope.$broadcast('$stateChangeStart', to.self, toParams, from.self, fromParams, options).defaultPrevented) {
          $rootScope.$broadcast('$stateChangeCancel', to.self, toParams, from.self, fromParams);
      ***REMOVED***Don't update and resync url if there's been a new transition started. see issue #2238, #600
          if ($state.transition == null) $urlRouter.update();
          return TransitionPrevented;
    ***REMOVED***
  ***REMOVED***

  ***REMOVED*** Resolve locals for the remaining states, but don't update any global state just
  ***REMOVED*** yet -- if anything fails to resolve the current state needs to remain untouched.
  ***REMOVED*** We also set up an inheritance chain for the locals here. This allows the view directive
  ***REMOVED*** to quickly look up the correct definition for each view in the current state. Even
  ***REMOVED*** though we create the locals object itself outside resolveState(), it is initially
  ***REMOVED*** empty and gets filled asynchronously. We need to keep track of the promise for the
  ***REMOVED*** (fully resolved) current locals, and pass this down the chain.
      var resolved = $q.when(locals);

      for (var l = keep; l < toPath.length; l++, state = toPath[l]) {
        locals = toLocals[l] = inherit(locals);
        resolved = resolveState(state, toParams, state === to, resolved, locals, options);
  ***REMOVED***

  ***REMOVED*** Once everything is resolved, we are ready to perform the actual transition
  ***REMOVED*** and return a promise for the new state. We also keep track of what the
  ***REMOVED*** current promise is, so that we can detect overlapping transitions and
  ***REMOVED*** keep only the outcome of the last transition.
      var transition = $state.transition = resolved.then(function () {
        var l, entering, exiting;

        if ($state.transition !== transition) return TransitionSuperseded;

    ***REMOVED*** Exit 'from' states not kept
        for (l = fromPath.length - 1; l >= keep; l--) {
          exiting = fromPath[l];
          if (exiting.self.onExit) {
            $injector.invoke(exiting.self.onExit, exiting.self, exiting.locals.globals);
      ***REMOVED***
          exiting.locals = null;
    ***REMOVED***

    ***REMOVED*** Enter 'to' states not kept
        for (l = keep; l < toPath.length; l++) {
          entering = toPath[l];
          entering.locals = toLocals[l];
          if (entering.self.onEnter) {
            $injector.invoke(entering.self.onEnter, entering.self, entering.locals.globals);
      ***REMOVED***
    ***REMOVED***

    ***REMOVED*** Run it again, to catch any transitions in callbacks
        if ($state.transition !== transition) return TransitionSuperseded;

    ***REMOVED*** Update globals in $state
        $state.$current = to;
        $state.current = to.self;
        $state.params = toParams;
        copy($state.params, $stateParams);
        $state.transition = null;

        if (options.location && to.navigable) {
          $urlRouter.push(to.navigable.url, to.navigable.locals.globals.$stateParams, {
            $$avoidResync: true, replace: options.location === 'replace'
      ***REMOVED***);
    ***REMOVED***

        if (options.notify) {
        /**
         * @ngdoc event
         * @name ui.router.state.$state#$stateChangeSuccess
         * @eventOf ui.router.state.$state
         * @eventType broadcast on root scope
         * @description
         * Fired once the state transition is **complete**.
         *
         * @param {Object***REMOVED*** event Event object.
         * @param {State***REMOVED*** toState The state being transitioned to.
         * @param {Object***REMOVED*** toParams The params supplied to the `toState`.
         * @param {State***REMOVED*** fromState The current state, pre-transition.
         * @param {Object***REMOVED*** fromParams The params supplied to the `fromState`.
         */
          $rootScope.$broadcast('$stateChangeSuccess', to.self, toParams, from.self, fromParams);
    ***REMOVED***
        $urlRouter.update(true);

        return $state.current;
  ***REMOVED***, function (error) {
        if ($state.transition !== transition) return TransitionSuperseded;

        $state.transition = null;
        /**
         * @ngdoc event
         * @name ui.router.state.$state#$stateChangeError
         * @eventOf ui.router.state.$state
         * @eventType broadcast on root scope
         * @description
         * Fired when an **error occurs** during transition. It's important to note that if you
         * have any errors in your resolve functions (javascript errors, non-existent services, etc)
         * they will not throw traditionally. You must listen for this $stateChangeError event to
         * catch **ALL** errors.
         *
         * @param {Object***REMOVED*** event Event object.
         * @param {State***REMOVED*** toState The state being transitioned to.
         * @param {Object***REMOVED*** toParams The params supplied to the `toState`.
         * @param {State***REMOVED*** fromState The current state, pre-transition.
         * @param {Object***REMOVED*** fromParams The params supplied to the `fromState`.
         * @param {Error***REMOVED*** error The resolve error object.
         */
        evt = $rootScope.$broadcast('$stateChangeError', to.self, toParams, from.self, fromParams, error);

        if (!evt.defaultPrevented) {
            $urlRouter.update();
    ***REMOVED***

        return $q.reject(error);
  ***REMOVED***);

      return transition;
***REMOVED***;

    /**
     * @ngdoc function
     * @name ui.router.state.$state#is
     * @methodOf ui.router.state.$state
     *
     * @description
     * Similar to {@link ui.router.state.$state#methods_includes $state.includes***REMOVED***,
     * but only checks for the full state name. If params is supplied then it will be
     * tested for strict equality against the current active params object, so all params
     * must match with none missing and no extras.
     *
     * @example
     * <pre>
     * $state.$current.name = 'contacts.details.item';
     *
     * // absolute name
     * $state.is('contact.details.item'); // returns true
     * $state.is(contactDetailItemStateObject); // returns true
     *
     * // relative name (. and ^), typically from a template
     * // E.g. from the 'contacts.details' template
     * <div ng-class="{highlighted: $state.is('.item')***REMOVED***">Item</div>
     * </pre>
     *
     * @param {string|object***REMOVED*** stateOrName The state name (absolute or relative) or state object you'd like to check.
     * @param {object=***REMOVED*** params A param object, e.g. `{sectionId: section.id***REMOVED***`, that you'd like
     * to test against the current active state.
     * @param {object=***REMOVED*** options An options object.  The options are:
     *
     * - **`relative`** - {string|object***REMOVED*** -  If `stateOrName` is a relative state name and `options.relative` is set, .is will
     * test relative to `options.relative` state (or name).
     *
     * @returns {boolean***REMOVED*** Returns true if it is the state.
     */
    $state.is = function is(stateOrName, params, options) {
      options = extend({ relative: $state.$current ***REMOVED***, options || {***REMOVED***);
      var state = findState(stateOrName, options.relative);

      if (!isDefined(state)) { return undefined; ***REMOVED***
      if ($state.$current !== state) { return false; ***REMOVED***
      return params ? equalForKeys(state.params.$$values(params), $stateParams) : true;
***REMOVED***;

    /**
     * @ngdoc function
     * @name ui.router.state.$state#includes
     * @methodOf ui.router.state.$state
     *
     * @description
     * A method to determine if the current active state is equal to or is the child of the
     * state stateName. If any params are passed then they will be tested for a match as well.
     * Not all the parameters need to be passed, just the ones you'd like to test for equality.
     *
     * @example
     * Partial and relative names
     * <pre>
     * $state.$current.name = 'contacts.details.item';
     *
     * // Using partial names
     * $state.includes("contacts"); // returns true
     * $state.includes("contacts.details"); // returns true
     * $state.includes("contacts.details.item"); // returns true
     * $state.includes("contacts.list"); // returns false
     * $state.includes("about"); // returns false
     *
     * // Using relative names (. and ^), typically from a template
     * // E.g. from the 'contacts.details' template
     * <div ng-class="{highlighted: $state.includes('.item')***REMOVED***">Item</div>
     * </pre>
     *
     * Basic globbing patterns
     * <pre>
     * $state.$current.name = 'contacts.details.item.url';
     *
     * $state.includes("*.details.*.*"); // returns true
     * $state.includes("*.details.**"); // returns true
     * $state.includes("**.item.**"); // returns true
     * $state.includes("*.details.item.url"); // returns true
     * $state.includes("*.details.*.url"); // returns true
     * $state.includes("*.details.*"); // returns false
     * $state.includes("item.**"); // returns false
     * </pre>
     *
     * @param {string***REMOVED*** stateOrName A partial name, relative name, or glob pattern
     * to be searched for within the current state name.
     * @param {object=***REMOVED*** params A param object, e.g. `{sectionId: section.id***REMOVED***`,
     * that you'd like to test against the current active state.
     * @param {object=***REMOVED*** options An options object.  The options are:
     *
     * - **`relative`** - {string|object=***REMOVED*** -  If `stateOrName` is a relative state reference and `options.relative` is set,
     * .includes will test relative to `options.relative` state (or name).
     *
     * @returns {boolean***REMOVED*** Returns true if it does include the state
     */
    $state.includes = function includes(stateOrName, params, options) {
      options = extend({ relative: $state.$current ***REMOVED***, options || {***REMOVED***);
      if (isString(stateOrName) && isGlob(stateOrName)) {
        if (!doesStateMatchGlob(stateOrName)) {
          return false;
    ***REMOVED***
        stateOrName = $state.$current.name;
  ***REMOVED***

      var state = findState(stateOrName, options.relative);
      if (!isDefined(state)) { return undefined; ***REMOVED***
      if (!isDefined($state.$current.includes[state.name])) { return false; ***REMOVED***
      return params ? equalForKeys(state.params.$$values(params), $stateParams, objectKeys(params)) : true;
***REMOVED***;


    /**
     * @ngdoc function
     * @name ui.router.state.$state#href
     * @methodOf ui.router.state.$state
     *
     * @description
     * A url generation method that returns the compiled url for the given state populated with the given params.
     *
     * @example
     * <pre>
     * expect($state.href("about.person", { person: "bob" ***REMOVED***)).toEqual("/about/bob");
     * </pre>
     *
     * @param {string|object***REMOVED*** stateOrName The state name or state object you'd like to generate a url from.
     * @param {object=***REMOVED*** params An object of parameter values to fill the state's required parameters.
     * @param {object=***REMOVED*** options Options object. The options are:
     *
     * - **`lossy`** - {boolean=true***REMOVED*** -  If true, and if there is no url associated with the state provided in the
     *    first parameter, then the constructed href url will be built from the first navigable ancestor (aka
     *    ancestor with a valid url).
     * - **`inherit`** - {boolean=true***REMOVED***, If `true` will inherit url parameters from current url.
     * - **`relative`** - {object=$state.$current***REMOVED***, When transitioning with relative path (e.g '^'), 
     *    defines which state to be relative from.
     * - **`absolute`** - {boolean=false***REMOVED***,  If true will generate an absolute url, e.g. "http://www.example.com/fullurl".
     * 
     * @returns {string***REMOVED*** compiled state url
     */
    $state.href = function href(stateOrName, params, options) {
      options = extend({
        lossy:    true,
        inherit:  true,
        absolute: false,
        relative: $state.$current
  ***REMOVED***, options || {***REMOVED***);

      var state = findState(stateOrName, options.relative);

      if (!isDefined(state)) return null;
      if (options.inherit) params = inheritParams($stateParams, params || {***REMOVED***, $state.$current, state);
      
      var nav = (state && options.lossy) ? state.navigable : state;

      if (!nav || nav.url === undefined || nav.url === null) {
        return null;
  ***REMOVED***
      return $urlRouter.href(nav.url, filterByKeys(state.params.$$keys().concat('#'), params || {***REMOVED***), {
        absolute: options.absolute
  ***REMOVED***);
***REMOVED***;

    /**
     * @ngdoc function
     * @name ui.router.state.$state#get
     * @methodOf ui.router.state.$state
     *
     * @description
     * Returns the state configuration object for any specific state or all states.
     *
     * @param {string|object=***REMOVED*** stateOrName (absolute or relative) If provided, will only get the config for
     * the requested state. If not provided, returns an array of ALL state configs.
     * @param {string|object=***REMOVED*** context When stateOrName is a relative state reference, the state will be retrieved relative to context.
     * @returns {Object|Array***REMOVED*** State configuration object or array of all objects.
     */
    $state.get = function (stateOrName, context) {
      if (arguments.length === 0) return map(objectKeys(states), function(name) { return states[name].self; ***REMOVED***);
      var state = findState(stateOrName, context || $state.$current);
      return (state && state.self) ? state.self : null;
***REMOVED***;

    function resolveState(state, params, paramsAreFiltered, inherited, dst, options) {
  ***REMOVED*** Make a restricted $stateParams with only the parameters that apply to this state if
  ***REMOVED*** necessary. In addition to being available to the controller and onEnter/onExit callbacks,
  ***REMOVED*** we also need $stateParams to be available for any $injector calls we make during the
  ***REMOVED*** dependency resolution process.
      var $stateParams = (paramsAreFiltered) ? params : filterByKeys(state.params.$$keys(), params);
      var locals = { $stateParams: $stateParams ***REMOVED***;

  ***REMOVED*** Resolve 'global' dependencies for the state, i.e. those not specific to a view.
  ***REMOVED*** We're also including $stateParams in this; that way the parameters are restricted
  ***REMOVED*** to the set that should be visible to the state, and are independent of when we update
  ***REMOVED*** the global $state and $stateParams values.
      dst.resolve = $resolve.resolve(state.resolve, locals, dst.resolve, state);
      var promises = [dst.resolve.then(function (globals) {
        dst.globals = globals;
  ***REMOVED***)];
      if (inherited) promises.push(inherited);

      function resolveViews() {
        var viewsPromises = [];

    ***REMOVED*** Resolve template and dependencies for all views.
        forEach(state.views, function (view, name) {
          var injectables = (view.resolve && view.resolve !== state.resolve ? view.resolve : {***REMOVED***);
          injectables.$template = [ function () {
            return $view.load(name, { view: view, locals: dst.globals, params: $stateParams, notify: options.notify ***REMOVED***) || '';
      ***REMOVED***];

          viewsPromises.push($resolve.resolve(injectables, dst.globals, dst.resolve, state).then(function (result) {
        ***REMOVED*** References to the controller (only instantiated at link time)
            if (isFunction(view.controllerProvider) || isArray(view.controllerProvider)) {
              var injectLocals = angular.extend({***REMOVED***, injectables, dst.globals);
              result.$$controller = $injector.invoke(view.controllerProvider, null, injectLocals);
        ***REMOVED*** ***REMOVED***
              result.$$controller = view.controller;
        ***REMOVED***
        ***REMOVED*** Provide access to the state itself for internal use
            result.$$state = state;
            result.$$controllerAs = view.controllerAs;
            dst[name] = result;
      ***REMOVED***));
    ***REMOVED***);

        return $q.all(viewsPromises).then(function(){
          return dst.globals;
    ***REMOVED***);
  ***REMOVED***

  ***REMOVED*** Wait for all the promises and then return the activation object
      return $q.all(promises).then(resolveViews).then(function (values) {
        return dst;
  ***REMOVED***);
***REMOVED***

    return $state;
  ***REMOVED***

  function shouldSkipReload(to, toParams, from, fromParams, locals, options) {
***REMOVED*** Return true if there are no differences in non-search (path/object) params, false if there are differences
    function nonSearchParamsEqual(fromAndToState, fromParams, toParams) {
  ***REMOVED*** Identify whether all the parameters that differ between `fromParams` and `toParams` were search params.
      function notSearchParam(key) {
        return fromAndToState.params[key].location != "search";
  ***REMOVED***
      var nonQueryParamKeys = fromAndToState.params.$$keys().filter(notSearchParam);
      var nonQueryParams = pick.apply({***REMOVED***, [fromAndToState.params].concat(nonQueryParamKeys));
      var nonQueryParamSet = new $$UMFP.ParamSet(nonQueryParams);
      return nonQueryParamSet.$$equals(fromParams, toParams);
***REMOVED***

***REMOVED*** If reload was not explicitly requested
***REMOVED*** and we're transitioning to the same state we're already in
***REMOVED*** and    the locals didn't change
***REMOVED***     or they changed in a way that doesn't merit reloading
***REMOVED***        (reloadOnParams:false, or reloadOnSearch.false and only search params changed)
***REMOVED*** Then return true.
    if (!options.reload && to === from &&
      (locals === from.locals || (to.self.reloadOnSearch === false && nonSearchParamsEqual(from, fromParams, toParams)))) {
      return true;
***REMOVED***
  ***REMOVED***
***REMOVED***

angular.module('ui.router.state')
  .factory('$stateParams', function () { return {***REMOVED***; ***REMOVED***)
  .provider('$state', $StateProvider);


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

/**
 * @ngdoc object
 * @name ui.router.state.$uiViewScrollProvider
 *
 * @description
 * Provider that returns the {@link ui.router.state.$uiViewScroll***REMOVED*** service function.
 */
function $ViewScrollProvider() {

  var useAnchorScroll = false;

  /**
   * @ngdoc function
   * @name ui.router.state.$uiViewScrollProvider#useAnchorScroll
   * @methodOf ui.router.state.$uiViewScrollProvider
   *
   * @description
   * Reverts back to using the core [`$anchorScroll`](http://docs.angularjs.org/api/ng.$anchorScroll) service for
   * scrolling based on the url anchor.
   */
  this.useAnchorScroll = function () {
    useAnchorScroll = true;
  ***REMOVED***;

  /**
   * @ngdoc object
   * @name ui.router.state.$uiViewScroll
   *
   * @requires $anchorScroll
   * @requires $timeout
   *
   * @description
   * When called with a jqLite element, it scrolls the element into view (after a
   * `$timeout` so the DOM has time to refresh).
   *
   * If you prefer to rely on `$anchorScroll` to scroll the view to the anchor,
   * this can be enabled by calling {@link ui.router.state.$uiViewScrollProvider#methods_useAnchorScroll `$uiViewScrollProvider.useAnchorScroll()`***REMOVED***.
   */
  this.$get = ['$anchorScroll', '$timeout', function ($anchorScroll, $timeout) {
    if (useAnchorScroll) {
      return $anchorScroll;
***REMOVED***

    return function ($element) {
      return $timeout(function () {
        $element[0].scrollIntoView();
  ***REMOVED***, 0, false);
***REMOVED***;
  ***REMOVED***];
***REMOVED***

angular.module('ui.router.state').provider('$uiViewScroll', $ViewScrollProvider);

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

function parseStateRef(ref, current) {
  var preparsed = ref.match(/^\s*({[^***REMOVED***]****REMOVED***)\s*$/), parsed;
  if (preparsed) ref = current + '(' + preparsed[1] + ')';
  parsed = ref.replace(/\n/g, " ").match(/^([^(]+?)\s*(\((.*)\))?$/);
  if (!parsed || parsed.length !== 4) throw new Error("Invalid state ref '" + ref + "'");
  return { state: parsed[1], paramExpr: parsed[3] || null ***REMOVED***;
***REMOVED***

function stateContext(el) {
  var stateData = el.parent().inheritedData('$uiView');

  if (stateData && stateData.state && stateData.state.name) {
    return stateData.state;
  ***REMOVED***
***REMOVED***

function getTypeInfo(el) {
  // SVGAElement does not use the href attribute, but rather the 'xlinkHref' attribute.
  var isSvg = Object.prototype.toString.call(el.prop('href')) === '[object SVGAnimatedString]';
  var isForm = el[0].nodeName === "FORM";

  return {
    attr: isForm ? "action" : (isSvg ? 'xlink:href' : 'href'),
    isAnchor: el.prop("tagName").toUpperCase() === "A",
    clickable: !isForm
  ***REMOVED***;
***REMOVED***

function clickHook(el, $state, $timeout, type, current) {
  return function(e) {
    var button = e.which || e.button, target = current();

    if (!(button > 1 || e.ctrlKey || e.metaKey || e.shiftKey || el.attr('target'))) {
  ***REMOVED*** HACK: This is to allow ng-clicks to be processed before the transition is initiated:
      var transition = $timeout(function() {
        $state.go(target.state, target.params, target.options);
  ***REMOVED***);
      e.preventDefault();

  ***REMOVED*** if the state has no URL, ignore one preventDefault from the <a> directive.
      var ignorePreventDefaultCount = type.isAnchor && !target.href ? 1: 0;

      e.preventDefault = function() {
        if (ignorePreventDefaultCount-- <= 0) $timeout.cancel(transition);
  ***REMOVED***;
***REMOVED***
  ***REMOVED***;
***REMOVED***

function defaultOpts(el, $state) {
  return { relative: stateContext(el) || $state.$current, inherit: true ***REMOVED***;
***REMOVED***

/**
 * @ngdoc directive
 * @name ui.router.state.directive:ui-sref
 *
 * @requires ui.router.state.$state
 * @requires $timeout
 *
 * @restrict A
 *
 * @description
 * A directive that binds a link (`<a>` tag) to a state. If the state has an associated
 * URL, the directive will automatically generate & update the `href` attribute via
 * the {@link ui.router.state.$state#methods_href $state.href()***REMOVED*** method. Clicking
 * the link will trigger a state transition with optional parameters.
 *
 * Also middle-clicking, right-clicking, and ctrl-clicking on the link will be
 * handled natively by the browser.
 *
 * You can also use relative state paths within ui-sref, just like the relative
 * paths passed to `$state.go()`. You just need to be aware that the path is relative
 * to the state that the link lives in, in other words the state that loaded the
 * template containing the link.
 *
 * You can specify options to pass to {@link ui.router.state.$state#go $state.go()***REMOVED***
 * using the `ui-sref-opts` attribute. Options are restricted to `location`, `inherit`,
 * and `reload`.
 *
 * @example
 * Here's an example of how you'd use ui-sref and how it would compile. If you have the
 * following template:
 * <pre>
 * <a ui-sref="home">Home</a> | <a ui-sref="about">About</a> | <a ui-sref="{page: 2***REMOVED***">Next page</a>
 *
 * <ul>
 *     <li ng-repeat="contact in contacts">
 *         <a ui-sref="contacts.detail({ id: contact.id ***REMOVED***)">{{ contact.name ***REMOVED******REMOVED***</a>
 *     </li>
 * </ul>
 * </pre>
 *
 * Then the compiled html would be (assuming Html5Mode is off and current state is contacts):
 * <pre>
 * <a href="#/home" ui-sref="home">Home</a> | <a href="#/about" ui-sref="about">About</a> | <a href="#/contacts?page=2" ui-sref="{page: 2***REMOVED***">Next page</a>
 *
 * <ul>
 *     <li ng-repeat="contact in contacts">
 *         <a href="#/contacts/1" ui-sref="contacts.detail({ id: contact.id ***REMOVED***)">Joe</a>
 *     </li>
 *     <li ng-repeat="contact in contacts">
 *         <a href="#/contacts/2" ui-sref="contacts.detail({ id: contact.id ***REMOVED***)">Alice</a>
 *     </li>
 *     <li ng-repeat="contact in contacts">
 *         <a href="#/contacts/3" ui-sref="contacts.detail({ id: contact.id ***REMOVED***)">Bob</a>
 *     </li>
 * </ul>
 *
 * <a ui-sref="home" ui-sref-opts="{reload: true***REMOVED***">Home</a>
 * </pre>
 *
 * @param {string***REMOVED*** ui-sref 'stateName' can be any valid absolute or relative state
 * @param {Object***REMOVED*** ui-sref-opts options to pass to {@link ui.router.state.$state#go $state.go()***REMOVED***
 */
$StateRefDirective.$inject = ['$state', '$timeout'];
function $StateRefDirective($state, $timeout) {
  return {
    restrict: 'A',
    require: ['?^uiSrefActive', '?^uiSrefActiveEq'],
    link: function(scope, element, attrs, uiSrefActive) {
      var ref    = parseStateRef(attrs.uiSref, $state.current.name);
      var def    = { state: ref.state, href: null, params: null ***REMOVED***;
      var type   = getTypeInfo(element);
      var active = uiSrefActive[1] || uiSrefActive[0];

      def.options = extend(defaultOpts(element, $state), attrs.uiSrefOpts ? scope.$eval(attrs.uiSrefOpts) : {***REMOVED***);

      var update = function(val) {
        if (val) def.params = angular.copy(val);
        def.href = $state.href(ref.state, def.params, def.options);

        if (active) active.$$addStateInfo(ref.state, def.params);
        if (def.href !== null) attrs.$set(type.attr, def.href);
  ***REMOVED***;

      if (ref.paramExpr) {
        scope.$watch(ref.paramExpr, function(val) { if (val !== def.params) update(val); ***REMOVED***, true);
        def.params = angular.copy(scope.$eval(ref.paramExpr));
  ***REMOVED***
      update();

      if (!type.clickable) return;
      element.bind("click", clickHook(element, $state, $timeout, type, function() { return def; ***REMOVED***));
***REMOVED***
  ***REMOVED***;
***REMOVED***

/**
 * @ngdoc directive
 * @name ui.router.state.directive:ui-state
 *
 * @requires ui.router.state.uiSref
 *
 * @restrict A
 *
 * @description
 * Much like ui-sref, but will accept named $scope properties to evaluate for a state definition,
 * params and override options.
 *
 * @param {string***REMOVED*** ui-state 'stateName' can be any valid absolute or relative state
 * @param {Object***REMOVED*** ui-state-params params to pass to {@link ui.router.state.$state#href $state.href()***REMOVED***
 * @param {Object***REMOVED*** ui-state-opts options to pass to {@link ui.router.state.$state#go $state.go()***REMOVED***
 */
$StateRefDynamicDirective.$inject = ['$state', '$timeout'];
function $StateRefDynamicDirective($state, $timeout) {
  return {
    restrict: 'A',
    require: ['?^uiSrefActive', '?^uiSrefActiveEq'],
    link: function(scope, element, attrs, uiSrefActive) {
      var type   = getTypeInfo(element);
      var active = uiSrefActive[1] || uiSrefActive[0];
      var group  = [attrs.uiState, attrs.uiStateParams || null, attrs.uiStateOpts || null];
      var watch  = '[' + group.map(function(val) { return val || 'null'; ***REMOVED***).join(', ') + ']';
      var def    = { state: null, params: null, options: null, href: null ***REMOVED***;

      function runStateRefLink (group) {
        def.state = group[0]; def.params = group[1]; def.options = group[2];
        def.href = $state.href(def.state, def.params, def.options);

        if (active) active.$$addStateInfo(def.state, def.params);
        if (def.href) attrs.$set(type.attr, def.href);
  ***REMOVED***

      scope.$watch(watch, runStateRefLink, true);
      runStateRefLink(scope.$eval(watch));

      if (!type.clickable) return;
      element.bind("click", clickHook(element, $state, $timeout, type, function() { return def; ***REMOVED***));
***REMOVED***
  ***REMOVED***;
***REMOVED***


/**
 * @ngdoc directive
 * @name ui.router.state.directive:ui-sref-active
 *
 * @requires ui.router.state.$state
 * @requires ui.router.state.$stateParams
 * @requires $interpolate
 *
 * @restrict A
 *
 * @description
 * A directive working alongside ui-sref to add classes to an element when the
 * related ui-sref directive's state is active, and removing them when it is inactive.
 * The primary use-case is to simplify the special appearance of navigation menus
 * relying on `ui-sref`, by having the "active" state's menu button appear different,
 * distinguishing it from the inactive menu items.
 *
 * ui-sref-active can live on the same element as ui-sref or on a parent element. The first
 * ui-sref-active found at the same level or above the ui-sref will be used.
 *
 * Will activate when the ui-sref's target state or any child state is active. If you
 * need to activate only when the ui-sref target state is active and *not* any of
 * it's children, then you will use
 * {@link ui.router.state.directive:ui-sref-active-eq ui-sref-active-eq***REMOVED***
 *
 * @example
 * Given the following template:
 * <pre>
 * <ul>
 *   <li ui-sref-active="active" class="item">
 *     <a href ui-sref="app.user({user: 'bilbobaggins'***REMOVED***)">@bilbobaggins</a>
 *   </li>
 * </ul>
 * </pre>
 *
 *
 * When the app state is "app.user" (or any children states), and contains the state parameter "user" with value "bilbobaggins",
 * the resulting HTML will appear as (note the 'active' class):
 * <pre>
 * <ul>
 *   <li ui-sref-active="active" class="item active">
 *     <a ui-sref="app.user({user: 'bilbobaggins'***REMOVED***)" href="/users/bilbobaggins">@bilbobaggins</a>
 *   </li>
 * </ul>
 * </pre>
 *
 * The class name is interpolated **once** during the directives link time (any further changes to the
 * interpolated value are ignored).
 *
 * Multiple classes may be specified in a space-separated format:
 * <pre>
 * <ul>
 *   <li ui-sref-active='class1 class2 class3'>
 *     <a ui-sref="app.user">link</a>
 *   </li>
 * </ul>
 * </pre>
 *
 * It is also possible to pass ui-sref-active an expression that evaluates
 * to an object hash, whose keys represent active class names and whose
 * values represent the respective state names/globs.
 * ui-sref-active will match if the current active state **includes** any of
 * the specified state names/globs, even the abstract ones.
 *
 * @Example
 * Given the following template, with "admin" being an abstract state:
 * <pre>
 * <div ui-sref-active="{'active': 'admin.*'***REMOVED***">
 *   <a ui-sref-active="active" ui-sref="admin.roles">Roles</a>
 * </div>
 * </pre>
 *
 * When the current state is "admin.roles" the "active" class will be applied
 * to both the <div> and <a> elements. It is important to note that the state
 * names/globs passed to ui-sref-active shadow the state provided by ui-sref.
 */

/**
 * @ngdoc directive
 * @name ui.router.state.directive:ui-sref-active-eq
 *
 * @requires ui.router.state.$state
 * @requires ui.router.state.$stateParams
 * @requires $interpolate
 *
 * @restrict A
 *
 * @description
 * The same as {@link ui.router.state.directive:ui-sref-active ui-sref-active***REMOVED*** but will only activate
 * when the exact target state used in the `ui-sref` is active; no child states.
 *
 */
$StateRefActiveDirective.$inject = ['$state', '$stateParams', '$interpolate'];
function $StateRefActiveDirective($state, $stateParams, $interpolate) {
  return  {
    restrict: "A",
    controller: ['$scope', '$element', '$attrs', '$timeout', function ($scope, $element, $attrs, $timeout) {
      var states = [], activeClasses = {***REMOVED***, activeEqClass, uiSrefActive;

  ***REMOVED*** There probably isn't much point in $observing this
  ***REMOVED*** uiSrefActive and uiSrefActiveEq share the same directive object with some
  ***REMOVED*** slight difference in logic routing
      activeEqClass = $interpolate($attrs.uiSrefActiveEq || '', false)($scope);

  ***REMOVED***
        uiSrefActive = $scope.$eval($attrs.uiSrefActive);
  ***REMOVED*** catch (e) {
    ***REMOVED*** Do nothing. uiSrefActive is not a valid expression.
    ***REMOVED*** Fall back to using $interpolate below
  ***REMOVED***
      uiSrefActive = uiSrefActive || $interpolate($attrs.uiSrefActive || '', false)($scope);
      if (isObject(uiSrefActive)) {
        forEach(uiSrefActive, function(stateOrName, activeClass) {
          if (isString(stateOrName)) {
            var ref = parseStateRef(stateOrName, $state.current.name);
            addState(ref.state, $scope.$eval(ref.paramExpr), activeClass);
      ***REMOVED***
    ***REMOVED***);
  ***REMOVED***

  ***REMOVED*** Allow uiSref to communicate with uiSrefActive[Equals]
      this.$$addStateInfo = function (newState, newParams) {
    ***REMOVED*** we already got an explicit state provided by ui-sref-active, so we
    ***REMOVED*** shadow the one that comes from ui-sref
        if (isObject(uiSrefActive) && states.length > 0) {
          return;
    ***REMOVED***
        addState(newState, newParams, uiSrefActive);
        update();
  ***REMOVED***;

      $scope.$on('$stateChangeSuccess', update);

      function addState(stateName, stateParams, activeClass) {
        var state = $state.get(stateName, stateContext($element));
        var stateHash = createStateHash(stateName, stateParams);

        states.push({
          state: state || { name: stateName ***REMOVED***,
          params: stateParams,
          hash: stateHash
    ***REMOVED***);

        activeClasses[stateHash] = activeClass;
  ***REMOVED***

      /**
       * @param {string***REMOVED*** state
       * @param {Object|string***REMOVED*** [params]
       * @return {string***REMOVED***
       */
      function createStateHash(state, params) {
        if (!isString(state)) {
          throw new Error('state should be a string');
    ***REMOVED***
        if (isObject(params)) {
          return state + toJson(params);
    ***REMOVED***
        params = $scope.$eval(params);
        if (isObject(params)) {
          return state + toJson(params);
    ***REMOVED***
        return state;
  ***REMOVED***

  ***REMOVED*** Update route state
      function update() {
        for (var i = 0; i < states.length; i++) {
          if (anyMatch(states[i].state, states[i].params)) {
            addClass($element, activeClasses[states[i].hash]);
      ***REMOVED*** ***REMOVED***
            removeClass($element, activeClasses[states[i].hash]);
      ***REMOVED***

          if (exactMatch(states[i].state, states[i].params)) {
            addClass($element, activeEqClass);
      ***REMOVED*** ***REMOVED***
            removeClass($element, activeEqClass);
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***

      function addClass(el, className) { $timeout(function () { el.addClass(className); ***REMOVED***); ***REMOVED***
      function removeClass(el, className) { el.removeClass(className); ***REMOVED***
      function anyMatch(state, params) { return $state.includes(state.name, params); ***REMOVED***
      function exactMatch(state, params) { return $state.is(state.name, params); ***REMOVED***

      update();
***REMOVED***]
  ***REMOVED***;
***REMOVED***

angular.module('ui.router.state')
  .directive('uiSref', $StateRefDirective)
  .directive('uiSrefActive', $StateRefActiveDirective)
  .directive('uiSrefActiveEq', $StateRefActiveDirective)
  .directive('uiState', $StateRefDynamicDirective);

/**
 * @ngdoc filter
 * @name ui.router.state.filter:isState
 *
 * @requires ui.router.state.$state
 *
 * @description
 * Translates to {@link ui.router.state.$state#methods_is $state.is("stateName")***REMOVED***.
 */
$IsStateFilter.$inject = ['$state'];
function $IsStateFilter($state) {
  var isFilter = function (state, params) {
    return $state.is(state, params);
  ***REMOVED***;
  isFilter.$stateful = true;
  return isFilter;
***REMOVED***

/**
 * @ngdoc filter
 * @name ui.router.state.filter:includedByState
 *
 * @requires ui.router.state.$state
 *
 * @description
 * Translates to {@link ui.router.state.$state#methods_includes $state.includes('fullOrPartialStateName')***REMOVED***.
 */
$IncludedByStateFilter.$inject = ['$state'];
function $IncludedByStateFilter($state) {
  var includesFilter = function (state, params, options) {
    return $state.includes(state, params, options);
  ***REMOVED***;
  includesFilter.$stateful = true;
  return  includesFilter;
***REMOVED***

angular.module('ui.router.state')
  .filter('isState', $IsStateFilter)
  .filter('includedByState', $IncludedByStateFilter);
***REMOVED***)(window, window.angular);