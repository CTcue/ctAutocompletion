angular
.module("CTcue:ctAutocompletion", ["ngSanitize"])
.config(["$compileProvider", function ($compileProvider) {
    $compileProvider.debugInfoEnabled(!1)
}
])
.config(["$locationProvider", function ($locationProvider) {
    $locationProvider.hashPrefix("")
}
])
.config(["$httpProvider", function ($httpProvider) {
    $httpProvider.defaults.headers.get || ($httpProvider.defaults.headers.get = {}),
    $httpProvider.defaults.headers.get["If-Modified-Since"] = "0",
    $httpProvider.defaults.headers.get["Cache-Control"] = "no-cache",
    $httpProvider.defaults.headers.get.Pragma = "no-cache"
}
]);

angular.module("CTcue:ctAutocompletion")
.controller("ctAutocompletionDemo", ["$rootScope", "$scope", function ($rootScope, $scope) {
    $scope.obj = {};
    $scope.toCompute = {};
    $scope.computations = [];

    $rootScope.$on("add-to-cart", function(event, data) {
        if (_.has($scope.toCompute, data.key)) {
            _.unset($scope.toCompute, data.key);
        }
        else {
            $scope.toCompute[data.key] = data.item;
        }
    });

    $scope.computeDifferences = function(selected) {
        if (_.values(selected).length < 2) {
            return;
        }

        // Get first 2 elements from selected object
        var values = [];

        for (var key in selected) {
            if (!key) {
                continue;
            }

            values.push(selected[key]);

            if (values.length === 2) {
                break;
            }
        }

        var cmpValues = getTermValues(values);

        var arr1 = cmpValues[0];
        var arr2 = cmpValues[1];

        var intersection = _.filter(arr1, function(x) { return _.includes(arr2, x) });
        var diffLeft  = _.filter(arr1, function(x) { return !_.includes(arr2, x) });
        var diffRight = _.filter(arr2, function(x) { return !_.includes(arr1, x) });

        $scope.computations = [intersection, diffLeft, diffRight];
    };

    $scope.hasItems = function() {
        return Object.keys($scope.toCompute).length > 0;
    };

    $scope.expand = function($event, item, key) {
        $event.preventDefault();

        _.set(item, "visible", !item.visible);
        $rootScope.$emit("add-to-cart", { item: item, key: key });
    };

    function getTermValues(selected) {
        var left = selected[0];
        var right = selected[1];

        return [getTerms(left), getTerms(right)];
    }

    function getTerms(item) {
        const dutch = _.get(item, "expanded.terms.dutch", []);
        const english = _.get(item, "expanded.terms.english", []);

        return [].concat(dutch, english).map(function(t) {
            return cleanLabel(t);
        });
    }

    function cleanLabel(text) {
        return text && _.deburr(text)
            .toLowerCase()
            .replace(/[^a-z0-9 ]/gi, " ")
            .replace(/\s+/g, " ")
            .trim();
    }
}
]);

angular.module("CTcue:ctAutocompletion").factory("UMLS", ["$http", function ($http) {
    function POST(controller, endpoint, data, base_path, options) {
        var url = function (base_path, controller, endpoint) {
            return base_path = _.trimEnd(base_path, "/"),
                endpoint = _.trimStart(endpoint, "/"),
                _.filter([base_path, controller, endpoint]).join("/")
        }(base_path, controller, endpoint);

        return $http.post(url, data, options)
    }

    return {
        post: function (endpoint, data, API_URL) {
            return POST("", endpoint, data, API_URL, {
                headers: {
                    "X-Token": "KBwgGhjImMut0QuGCpFS",
                    "X-User": "GuestUser=>Demo"
                },
                timeout: 5e3
            })
        }
    }
}
]);

angular
.module("CTcue:ctAutocompletion")
.directive("inputField", function(UMLS) {
    return {
        restrict: "E",
        scope: {
            obj: "="
        },
        templateUrl : "public_html/input-field/input-field.html",

        link: function(scope) {
            var previousTerm = "";

            scope.field = "description";

            scope.API = {
                "server" : "https://ctcue.com/umls",
                "local"  : "http://localhost:4080"
            };

            scope.suggestions = {
                "server": [],
                "local": []
            };

            scope.suggest = function(term) {
                if (!term || term.length < 1) {
                    previousTerm = "";

                    scope.suggestions = {
                        "server": [],
                        "local": []
                    };

                    return;
                }

                if (previousTerm === term) {
                    return;
                }

                // Limit term input to 50 characters;
                term = term.slice(0, 50);

                previousTerm = term;

                umlsSuggest(term, scope.API.server + "/v2/", "server");
                umlsSuggest(term, scope.API.local  + "/v2/", "local");
            }


            function _umlsResolve(term, API_URL) {
                if (typeof term !== "undefined" && term.length) {
                    // Only keep strings of at least 2 letters
                    term = term.split(" ")
                      .filter(function(s) { return s.length >= 2; })
                      .join(" ");
                }

                if (!term || term.length < 2) {
                    return null;
                }

                var queryObj = {
                    "query" : term,
                    "category": scope.category || "keyword",
                };

                return UMLS.post("autocomplete", queryObj, API_URL);
            }


            function umlsSuggest(term, API_URL, type) {
                var prom = _umlsResolve(term, API_URL);

                if (!prom) {
                    _.set(scope.suggestions, type, []);
                    return;
                }

                prom.then(function(result) {
                        _.set(scope.suggestions, type, result.data.hits);
                    },
                    function() {
                        _.set(scope.suggestions, type, [ { "str": "Kan server niet bereiken?" } ]);
                    });
            }
        }
    }
});

angular
.module("CTcue:ctAutocompletion")
.directive("resultList", function($rootScope, UMLS) {
    return {
        restrict: "E",
        scope: {
            data: "=",
            api: "@"
        },
        templateUrl : "public_html/input-field/result-list.html",

        link: function(scope) {

            scope.expand = function($event, item) {
                $event.preventDefault();

                if (item.clicked) {
                    _.set(item, "visible", !item.visible);
                    $rootScope.$emit("add-to-cart", { item: item, key: item.str + ":" + scope.api });

                    return;
                }

                if (!item.cui || item.cui === "generated") {
                    _.set(item, "clicked", true);
                    _.set(item, "visible", true);
                    _.set(item, "error", true);
                    return;
                }


                var expandObj = {
                    "query": item.cui
                };

                UMLS.post("expand-grouped", expandObj, scope.api)
                    .then(function(resp) {
                        _.set(item, "clicked", true);
                        _.set(item, "visible", true);
                        _.set(item, "origin", scope.api);
                        _.set(item, "expanded", resp.data);

                        $rootScope.$emit("add-to-cart", { item: item, key: item.str + ":" + scope.api });
                    });
            }
        }
    }
});
