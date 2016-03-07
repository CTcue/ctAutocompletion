'use strict';

app.controller('dangerzone', function ($scope, neo4j, CRUD, api) {

    $scope.data = {
        "neo4j": neo4j
    };

    $scope.error = false;

    $scope.destroy = function() {
        CRUD.post(api.path, "clear", $scope.data)
            .then(function(result) {
                $scope.msg = result.data;
                $scope.error = false;
            },
            function(err) {
                $scope.error = err;
            })
    }

    $scope.updateIndexes = function() {
        CRUD.post(api.path, "update-indexes", $scope.data)
            .then(function(result) {
                $scope.msg = result.data;
                $scope.error = false;
            },
            function(err) {
                $scope.error = err;
            })
    }


    $scope.removeGroup = function() {
        CRUD.post(api.path, "remove-group", $scope.data)
            .then(function(result) {
                $scope.msg = "Group removed";
                $scope.error = false;
            },
            function(err) {
                $scope.error = err;
            })
    }


    // Load groups for selection

    $scope.getGroups = function() {
        if (! $scope.data.neo4j.hasOwnProperty("password") || ! $scope.data.neo4j.password) {
            $scope.error = true;
            return;
        }

        CRUD.post(api.path, "list-groups", $scope.data)
            .then(function(result) {
                $scope.allGroups = result.data.groups || [];
                $scope.error = false;
            },
            function(err) {
                $scope.error = true;
            })
    }
});
