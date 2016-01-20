"use strict";

ctServices.factory('CRUD', function ($http, api) {
  return {
    post : function(endpoint, data) {
      return $http.post(api.path + "/" + endpoint, data);
    },

    get : function(endpoint) {
      return $http.get(api.path + endpoint);
    }
  };
});
