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
        });


    $scope.viewConcepts = function(view) {
        CRUD.get(UMLS.url, "umls/" + view.year  + "/" + view.month)
                .then(function(result) {
                    view.concepts = result.data;
                });
    }

    // $scope.delete = function(item) {
    //     CRUD.destroy("umls", item._id)
    //         .success(function(result) {
    //             List.remove($scope.addedTerms, item)
    //         });
    // }

    $scope.setActive = function(item) {
        if (!item.hasOwnProperty("language")) {
            item.language = "DUT";
        }

        if (!item.hasOwnProperty("types")) {
            item.types = "keyword";
        }


        $scope.active_term = item;
    }


    $scope.submit = function(active_term) {
        if (active_term.hasOwnProperty("_added")) {
            $scope.error = "This term is already added";
            return;
        }

        CRUD.post(UMLS.url, 'umls/create', { "query": active_term })
          .then(function(result) {

              // Set status to added
              active_term._added = true;

              $scope.success = true;
              $scope.error   = false;

              $scope.active_term = false;
          },
          function(err) {
              $scope.error = err;
          });
    }

});
