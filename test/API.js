'use strict';

/**
  Simple requests to check all API end points if they are reachable
*/

// Test dependencies
var app     = require('../app.js');
var request = require('supertest').agent(app.listen());
var assert  = require('assert');


describe('API', function () {

  it ('GET "/"', function(done) {
    request
      .get('/')
      .end(function(err, res) {
          assert.equal(200, res.status);
          done();
  ***REMOVED***);
  ***REMOVED***);


  it ('POST "/autocomplete" is outdated', function(done) {
    request
      .post('/autocomplete')
      .end(function(err, res) {
          assert.equal(400, res.status);
          done();
  ***REMOVED***);
  ***REMOVED***);

  it ('POST "/v1/autocomplete" with empty body', function(done) {
    request
      .post('/v1/autocomplete')
      .end(function(err, res) {
          assert.equal(400, res.status);
          done();
  ***REMOVED***);
  ***REMOVED***);


  it ('POST "/v1/autocomplete" with empty query string', function(done) {
    request
      .post('/v1/autocomplete')
      .send({ "query" : "" ***REMOVED***)
      .end(function(err, res) {
          assert.equal(200, res.status);
          assert.equal(0, res.body.hits.length);

          done();
  ***REMOVED***);
  ***REMOVED***);

  it ('POST "/v1/autocomplete" with single letter query', function(done) {
    request
      .post('/v1/autocomplete')
      .send({ "query" : "a" ***REMOVED***)
      .end(function(err, res) {
          assert.equal(200, res.status);
          assert.equal(true, res.body.hasOwnProperty('hits'));

          done();
  ***REMOVED***);
  ***REMOVED***);

  it ('POST "/v1/autocomplete" with query', function(done) {
    request
      .post('/v1/autocomplete')
      .send({ "query" : "anky spon" ***REMOVED***)
      .end(function(err, res) {
          assert.equal(200, res.status);
          assert.equal(true, res.body.hasOwnProperty('hits'));

          done();
  ***REMOVED***);
  ***REMOVED***);

  it ('POST "/expand" empty body', function(done) {
    request
      .post('/expand')
      .end(function(err, res) {
          assert.equal(400, res.status);

          done();
  ***REMOVED***);
  ***REMOVED***);

  it ('POST "/expand" with CUI', function(done) {
    request
      .post('/expand')
      .send({ "query" : "C0003090" ***REMOVED***)
      .end(function(err, res) {
          assert.equal(200, res.status);

          done();
  ***REMOVED***);
  ***REMOVED***);

  it ('POST "/expand-grouped" with CUI', function(done) {
    request
      .post('/expand-grouped')
      .send({ "query" : "C0003090" ***REMOVED***)
      .end(function(err, res) {
          assert.equal(200, res.status);

          done();
  ***REMOVED***);
  ***REMOVED***);
***REMOVED***);