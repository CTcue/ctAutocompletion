"use strict";

ctServices.factory('CRUD', function ($http) {
  return {
    post : function(path, endpoint, data) {
      return $http.post(path + "/" + endpoint, data);
***REMOVED***,

    get : function(path, endpoint) {
      return $http.get(path + "/" + endpoint);
***REMOVED***,

    list : function(path, endpoint) {
      return $http.get(path + "/" + endpoint + "/list");
***REMOVED***
  ***REMOVED***;
***REMOVED***);
