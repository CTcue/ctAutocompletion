'use strict';

app.controller('ctUMLSAdd', function ($scope, $state, CRUD) {
    $scope.success = false;
    $scope.error   = false;

    $scope.item = {};

    $scope.submit = function() {
        $scope.success = false;
        $scope.error   = false;

        CRUD.create('umls', $scope.item)
          .then(function(result) {
              $scope.success = true;
              $scope.item = {}
          },
          function(err) {
              $scope.error = err;
          });
    }
});
