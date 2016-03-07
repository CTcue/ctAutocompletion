'use strict';

app.controller('conceptController', function ($scope, UMLS, CRUD) {

    $scope.error    = false;
    $scope.active_term = false;
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

    $scope.setActive = function(item) {
        $scope.active_term = item;
***REMOVED***

    $scope.submit = function(active_term) {
        console.log(active_term);

    ***REMOVED*** CRUD.create(UMLS.url, 'umls', item)
    ***REMOVED***   .then(function(result) {
    ***REMOVED***       $scope.success = true;
    ***REMOVED***       $scope.error   = false;

    ***REMOVED***       $scope.item = {***REMOVED***
    ***REMOVED***   ***REMOVED***,
    ***REMOVED***   function(err) {
    ***REMOVED***       $scope.error = err;
    ***REMOVED***   ***REMOVED***);
***REMOVED***

***REMOVED***);
