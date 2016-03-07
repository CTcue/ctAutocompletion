// App dependencies
var app = angular.module("ConceptManager", [
  "ui.router",
  "ngAnimate",
  "app.config",
  "ctServices",
]);

angular.module('app.config', [])
    .constant('api', {
        // "path": "https://ctcue.com/suggest_manager_api"
        "path": "http://localhost:4083"
    })
    .constant('neo4j', {
        "username" : "neo4j",
        "password" : ""
    })
    .constant("UMLS", {
        "url" : "https://ctcue.com/umls/",
        "url" : "http://localhost:4080"
    })


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
    })

    .state('related-groups', {
      url: "/related-groups",
      templateUrl: "partials/related.html",
      controller: "relatedController"
    })

    .state('dangerzone', {
      url: "/dangerzone",
      templateUrl: "partials/dangerzone.html",
      controller: "dangerzone"
    })
});