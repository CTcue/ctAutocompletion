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
      });
  });


  it ('POST "/autocomplete" is outdated', function(done) {
    request
      .post('/autocomplete')
      .end(function(err, res) {
          assert.equal(400, res.status);
          done();
      });
  });


  it ('POST "/v1/autocomplete" with empty body', function(done) {
    request
      .post('/v1/autocomplete')
      .end(function(err, res) {
          assert.equal(400, res.status);
          done();
      });
  });


  it ('POST "/v1/autocomplete" with empty query string', function(done) {
    request
      .post('/v1/autocomplete')
      .send({ "query" : "" })
      .end(function(err, res) {
          assert.equal(200, res.status);
          assert.equal(0, res.body.hits.length);

          done();
      });
  });

  it ('POST "/v1/autocomplete" with single letter query', function(done) {
    request
      .post('/v1/autocomplete')
      .send({ "query" : "a" })
      .end(function(err, res) {
          assert.equal(200, res.status);
          assert.equal(true, res.body.hasOwnProperty('hits'));

          done();
      });
  });

  it ('POST "/v1/autocomplete" with query', function(done) {
    request
      .post('/v1/autocomplete')
      .send({ "query" : "anky spon" })
      .end(function(err, res) {
          assert.equal(200, res.status);
          assert.equal(true, res.body.hasOwnProperty('hits'));

          done();
      });
  });


  // ----
  // V2

  it ('POST "/v2/autocomplete" with empty body', function(done) {
    request
      .post('/v2/autocomplete')
      .end(function(err, res) {
          assert.equal(400, res.status);
          done();
      });
  });


  it ('POST "/v2/autocomplete" with empty query string', function(done) {
    request
      .post('/v2/autocomplete')
      .send({ "query" : "" })
      .end(function(err, res) {
          assert.equal(200, res.status);
          assert.equal(0, res.body.hits.length);

          done();
      });
  });

  it ('POST "/v2/autocomplete" with single letter query', function(done) {
    request
      .post('/v2/autocomplete')
      .send({ "query" : "a" })
      .end(function(err, res) {
          assert.equal(200, res.status);
          assert.equal(true, res.body.hasOwnProperty('hits'));

          done();
      });
  });

  it ('POST "/v2/autocomplete" with query', function(done) {
    request
      .post('/v2/autocomplete')
      .send({ "query" : "anky spon" })
      .end(function(err, res) {
          assert.equal(200, res.status);
          assert.equal(true, res.body.hasOwnProperty('hits'));

          done();
      });
  });


  // -------
  // On selection -> give all synonyms

  it ('POST "/expand" empty body', function(done) {
    request
      .post('/expand')
      .end(function(err, res) {
          assert.equal(400, res.status);

          done();
      });
  });

  it ('POST "/expand" with CUI', function(done) {
    request
      .post('/expand')
      .send({ "query" : "C0003090" })
      .end(function(err, res) {
          assert.equal(200, res.status);

          done();
      });
  });

  it ('POST "/expand-grouped" with CUI', function(done) {
    request
      .post('/expand-grouped')
      .send({ "query" : "C0003090" })
      .end(function(err, res) {
          assert.equal(200, res.status);

          done();
      });
  });

  it ('POST "/expand-string" expansion based on custom term', function(done) {
    request
      .post('/expand-by-string')
      .send({ "query" : "hypertensie" })
      .end(function(err, res) {
          assert.equal(200, res.status);

          done();
      });
  });
});