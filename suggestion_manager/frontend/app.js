// App dependencies
var app = angular.module("ctNeo4j", [
  "app.config",
  "ctServices",
]);

angular.module('app.config', [])
    .constant('api', {
        "path": "http://localhost:4083"
    })
    .constant('neo4j', {
        "username" : "neo4j",
        "password" : "test123"
    })
    .constant("UMLS", {
        "url"          : "https://ctcue.com/umls/",
        "autocomplete" : "https://ctcue.com/umls/autocomplete",
        "expand"       : "https://ctcue.com/umls/expand"
    })


// Create global services variable
var ctServices = angular.module("ctServices", []);