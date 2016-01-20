'use strict';

app.controller('dangerzone', function ($scope, $rootScope, neo4j, CRUD) {

    $scope.data = {
        "neo4j": neo4j
    }

    $scope.destroy = function() {
        CRUD.post("clear", $scope.data)
            .then(function(result) {
                $rootScope.msg = result.data;
            },
            function(err) {
                $rootScope.error = err;
            })
    }


    $scope.removeGroup = function() {
        CRUD.post("remove-group", $scope.data)
            .then(function(result) {
                $rootScope.msg = "Group removed";
            },
            function(err) {
                $rootScope.error = err;
            })
    }

    // Load groups for selection
    $scope.allGroups = [];

    CRUD.post("list-groups", $scope.data)
        .then(function(result) {
            $scope.allGroups = result.data.groups || [];
        },
        function(err) {
            $rootScope.error = err;
        })

});
