"use strict";

var config  = require('../../config/config.js');
var cheerio = require('cheerio');
// var tableparser = require('cheerio-tableparser');
var request = require('request');


module.exports = function *() {
    var domain = this.request.body.query;

    var tables = yield function(callback) {
        return request(domain, function (err, resp, html) {
            if (err) {
                console.log(err);
                callback(false, []);
        ***REMOVED***
            ***REMOVED***
                var $ = cheerio.load(html);
                var rows = [];

                $("table.wikitable tr").each(function(i, row) {
                    var current_row = [];

                    $("td, th", row).each(function(j, col) {
                        var content = $(col).text().trim() || "";
                        current_row.push(content);
                ***REMOVED***);

                    current_row = current_row.filter( s => s.length > 2 )

                    if (current_row.length) {
                        rows.push(current_row);
                ***REMOVED***
            ***REMOVED***);

                callback(false, rows);
        ***REMOVED***
    ***REMOVED***);
***REMOVED***;

    this.body = {
        "title" : "",
        "description": "",

        "tables": tables
***REMOVED***;
***REMOVED***
