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
