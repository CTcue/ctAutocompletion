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

  it ('POST "/autocomplete" with empty body', function(done) {
    request
      .post('/autocomplete')
      .end(function(err, res) {
          assert.equal(200, res.status);
          assert.equal(true, res.body.error);

          done();
  ***REMOVED***);
  ***REMOVED***);


  it ('POST "/autocomplete" with -empty- query', function(done) {
    request
      .post('/autocomplete')
      .send({ "query" : "" ***REMOVED***)
      .end(function(err, res) {
          assert.equal(200, res.status);
          assert.equal(true, res.body.error);

          done();
  ***REMOVED***);
  ***REMOVED***);

  it ('POST "/autocomplete" with single letter query', function(done) {
    request
      .post('/autocomplete')
      .send({ "query" : "a" ***REMOVED***)
      .end(function(err, res) {
          assert.equal(200, res.status);
          assert.equal(true, !!res.body.hits);

          done();
  ***REMOVED***);
  ***REMOVED***);

  it ('POST "/autocomplete" with query', function(done) {
    request
      .post('/autocomplete')
      .send({ "query" : "anky spon" ***REMOVED***)
      .end(function(err, res) {
          assert.equal(200, res.status);
          assert.equal(true, !!res.body.hits);

          done();
  ***REMOVED***);
  ***REMOVED***);

  it ('POST "/expand" empty body', function(done) {
    request
      .post('/expand')
      .end(function(err, res) {
          assert.equal(200, res.status);
          assert.equal(true, res.body.error);

          done();
  ***REMOVED***);
  ***REMOVED***);

  it ('POST "/expand" with CUI', function(done) {
    request
      .post('/expand')
      .send({ "query" : "C0003090" ***REMOVED***)
      .end(function(err, res) {
          assert.equal(200, res.status);
          assert.equal(true, res.body.length > 0);

          done();
  ***REMOVED***);
  ***REMOVED***);

  it ('POST "/custom"', function(done) {
    request
      .post('/custom')
      .end(function(err, res) {
          assert.equal(401, res.status);

          done();
  ***REMOVED***);
  ***REMOVED***);
***REMOVED***);