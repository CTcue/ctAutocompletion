"use strict";

ctServices.factory('CRUD', function ($http) {
  return {
    post : function(path, endpoint, data) {
      return $http.post(path + "/" + endpoint, data);
    },

    get : function(path, endpoint) {
      return $http.get(path + "/" + endpoint);
    },

    list : function(path, endpoint) {
      return $http.get(path + "/" + endpoint + "/list");
    }
  };
});
