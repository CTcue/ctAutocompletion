// App dependencies
var app = angular.module("ctNeo4j", [
  "app.config",
  "ctServices",
]);

angular.module('app.config', [])
    .constant('api', {
        "path": "https://ctcue.com/suggest_manager_api"
    })
    .constant('neo4j', {
        "username" : "neo4j",
        "password" : ""
    })
    .constant("UMLS", {
        "url"          : "https://ctcue.com/umls/",
        "autocomplete" : "https://ctcue.com/umls/autocomplete",
        "expand"       : "https://ctcue.com/umls/expand"
    })


// Create global services variable
var ctServices = angular.module("ctServices", []);