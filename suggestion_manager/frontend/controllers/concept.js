'use strict';

app.controller('conceptController', function ($scope, UMLS, CRUD) {

    $scope.error    = false;
    $scope.active_term = false;


    $scope.concepts = [];
    $scope.calendar_view = [];

    CRUD.list(UMLS.url, "umls")
        .then(function(result) {
            $scope.concepts = result.data.concepts;
            $scope.calendar_view = result.data.calendar_view;
    ***REMOVED***);


    $scope.viewConcepts = function(view) {
        CRUD.get(UMLS.url, "umls/" + view.year  + "/" + view.month)
                .then(function(result) {
                    view.concepts = result.data;
            ***REMOVED***);
***REMOVED***

***REMOVED*** $scope.delete = function(item) {
***REMOVED***     CRUD.destroy("umls", item._id)
***REMOVED***         .success(function(result) {
***REMOVED***             List.remove($scope.addedTerms, item)
***REMOVED***     ***REMOVED***);
***REMOVED*** ***REMOVED***

    $scope.setActive = function(item) {
        if (!item.hasOwnProperty("language")) {
            item.language = "DUT";
    ***REMOVED***

        if (!item.hasOwnProperty("types")) {
            item.types = "keyword";
    ***REMOVED***


        $scope.active_term = item;
***REMOVED***


    $scope.submit = function(active_term) {
        if (active_term.hasOwnProperty("_added")) {
            $scope.error = "This term is already added";
            return;
    ***REMOVED***

        CRUD.post(UMLS.url, 'umls/create', { "query": active_term ***REMOVED***)
          .then(function(result) {

          ***REMOVED*** Set status to added
              active_term._added = true;

              $scope.success = true;
              $scope.error   = false;

              $scope.active_term = false;
      ***REMOVED***,
          function(err) {
              $scope.error = err;
      ***REMOVED***);
***REMOVED***

***REMOVED***);
