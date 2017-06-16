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
                callback(false, []);
            }
            else {
                var $ = cheerio.load(html);
                var rows = [];

                $("table.wikitable tr").each(function(i, row) {
                    var current_row = [];

                    $("td, th", row).each(function(j, col) {
                        var content = $(col).text().trim() || "";
                        current_row.push(content);
                    });

                    current_row = current_row.filter( s => s.length > 2 )

                    if (current_row.length) {
                        rows.push(current_row);
                    }
                });

                callback(false, rows);
            }
        });
    };

    this.body = {
        "title" : "",
        "description": "",

        "tables": tables
    };
}
