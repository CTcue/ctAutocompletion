'use strict';

app.controller('ctUMLSEdit', function ($scope, $state, $stateParams, CRUD) {
    $scope.success = false;
    $scope.error   = false;

    $scope.item = {};

    CRUD.read("umls", $stateParams.id)
      .then(function(result) {
          console.log(result);
          $scope.item = result.data;
      })

    $scope.submit = function() {
        CRUD.update('umls', $scope.item._id, $scope.item)
          .then(function(result) {
              $state.go("^");
          },
          function(err) {
              $scope.error = err;
          });
    }
});
