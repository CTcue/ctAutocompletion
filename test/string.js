"use strict";

var string = require("../lib/string.js");
var assert = require("assert");


describe("Replace appendix strings", function () {

    it("Should replace numbers", function () {
        var clean = string.replaceAppendix("Gleason Score 7");
        assert.equal("Gleason Score", clean);
    });


    it("Should replace numbers", function () {
        var clean = string.replaceAppendix(" Gleason Score 77 ");
        assert.equal("Gleason Score", clean);
    });


    it("Should replace 'type + num'", function () {
        var clean = string.replaceAppendix("Diabetes mellitus type 2");
        assert.equal("Diabetes mellitus", clean);
    });


    it("Should replace 'type + roman'", function () {
        var clean = string.replaceAppendix("Diabetes mellitus type II");
        assert.equal("Diabetes mellitus", clean);
    });


    it("Should replace 'stage + roman'", function () {
        var clean = string.replaceAppendix("Carcinoma stage II");
        assert.equal("Carcinoma", clean);
    });


    it("Should replace 'stage + roman'", function () {
        var clean = string.replaceAppendix("Carcinoma stage IV");
        assert.equal("Carcinoma", clean);
    });


    it("Should replace 'stadum + num'", function () {
        var clean = string.replaceAppendix("Carcinoma stadium 0");
        assert.equal("Carcinoma", clean);
    });


    it("Should replace 'phase + num'", function () {
        var clean = string.replaceAppendix("Carcinoma phase 0");
        assert.equal("Carcinoma", clean);
    });

});
