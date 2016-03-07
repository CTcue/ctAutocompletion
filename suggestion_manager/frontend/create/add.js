'use strict';

app.controller('ctUMLSAdd', function ($scope, $state, CRUD) {
    $scope.success = false;
    $scope.error   = false;

    $scope.item = {***REMOVED***;

    $scope.submit = function() {
        $scope.success = false;
        $scope.error   = false;

        CRUD.create('umls', $scope.item)
          .then(function(result) {
              console.log("result");

              $scope.success = true;
              $scope.item = {***REMOVED***
      ***REMOVED***,
          function(err) {
              $scope.error = err;
      ***REMOVED***);
***REMOVED***
***REMOVED***);
