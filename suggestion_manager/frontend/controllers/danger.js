'use strict';

app.controller('dangerzone', function ($scope, $rootScope, neo4j, CRUD) {

    $scope.data = {
        "neo4j": neo4j
***REMOVED***

    $scope.destroy = function() {
        CRUD.post("clear", $scope.data)
            .then(function(result) {
                $rootScope.msg = result.data;
        ***REMOVED***,
            function(err) {
                $rootScope.error = err;
        ***REMOVED***)
***REMOVED***


    $scope.removeGroup = function() {
        CRUD.post("remove-group", $scope.data)
            .then(function(result) {
                $rootScope.msg = "Group removed";
        ***REMOVED***,
            function(err) {
                $rootScope.error = err;
        ***REMOVED***)
***REMOVED***

***REMOVED*** Load groups for selection
    $scope.allGroups = [];

    $scope.getGroups = function() {
        CRUD.post("list-groups", $scope.data)
            .then(function(result) {
                $scope.allGroups = result.data.groups || [];
        ***REMOVED***,
            function(err) {
                $rootScope.error = err;
        ***REMOVED***)
***REMOVED***
***REMOVED***);
