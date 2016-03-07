'use strict';

app.controller('conceptController', function ($scope, UMLS, CRUD) {

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
});
