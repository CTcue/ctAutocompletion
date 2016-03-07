'use strict';

app.controller('conceptController', function ($scope, UMLS, CRUD) {

    $scope.concepts = [];

    CRUD.list(UMLS.url, "umls")
        .then(function(result) {
            $scope.concepts = result.data;
    ***REMOVED***);

***REMOVED*** $scope.delete = function(item) {
***REMOVED***     CRUD.destroy("umls", item._id)
***REMOVED***         .success(function(result) {
***REMOVED***             List.remove($scope.addedTerms, item)
***REMOVED***     ***REMOVED***);
***REMOVED*** ***REMOVED***
***REMOVED***);
