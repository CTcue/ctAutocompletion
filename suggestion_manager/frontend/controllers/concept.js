'use strict';

app.controller('conceptController', function ($scope, UMLS, CRUD) {

    $scope.error    = false;
    $scope.active_term = false;
    $scope.concepts = [];


    CRUD.list(UMLS.url, "umls")
        .then(function(result) {
            $scope.concepts = result.data;
        });

    // $scope.delete = function(item) {
    //     CRUD.destroy("umls", item._id)
    //         .success(function(result) {
    //             List.remove($scope.addedTerms, item)
    //         });
    // }

    $scope.setActive = function(item) {
        $scope.active_term = item;
    }

    $scope.submit = function(active_term) {
        console.log(active_term);

        // CRUD.create(UMLS.url, 'umls', item)
        //   .then(function(result) {
        //       $scope.success = true;
        //       $scope.error   = false;

        //       $scope.item = {}
        //   },
        //   function(err) {
        //       $scope.error = err;
        //   });
    }

});
