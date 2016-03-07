// App dependencies
var app = angular.module("ConceptManager", [
  "ui.router",
  "ngAnimate",
  "app.config",
  "ctServices",
]);

angular.module('app.config', [])
    .constant('api', {
    ***REMOVED*** "path": "https://ctcue.com/suggest_manager_api"
        "path": "http://localhost:4083"
***REMOVED***)
    .constant('neo4j', {
        "username" : "neo4j",
        "password" : ""
***REMOVED***)
    .constant("UMLS", {
        "url" : "https://ctcue.com/umls/",
        "url" : "http://localhost:4080"
***REMOVED***)


// Create global services variable
var ctServices = angular.module("ctServices", []);



app.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/concepts");

  // Now set up the states
  $stateProvider
    .state('concepts', {
      url: "/concepts",
      templateUrl: "partials/concepts.html",
      controller: "conceptController"
***REMOVED***)

    .state('related-groups', {
      url: "/related-groups",
      templateUrl: "partials/related.html",
      controller: "relatedController"
***REMOVED***)

    .state('dangerzone', {
      url: "/dangerzone",
      templateUrl: "partials/dangerzone.html",
      controller: "dangerzone"
***REMOVED***)
***REMOVED***);