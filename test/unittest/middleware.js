
const app = require("../../src/app");
const server = app.listen();
const request = require("supertest").agent(server);


describe("Middleware tests", function() {
    after(function() {
        server.close();
    });

    describe.only("Body parser", function() {
        describe("Body parser accepts JSON", function() {
            it("should 200", function(done) {
                request
                    .post("/autocomplete")
                    .send({ "query": "Hyperten" })
                    .expect(200, done);
            });
        });

        describe("Body parser fails when length > limit", function() {
            it("should 413", function(done) {
                request
                    .post("/autocomplete")
                    .send({ name: Array(5000).join("a") })
                    .expect(413, done);
            });
        });
    });

    describe("User extract", function() {
        describe("Allows correct headers", function() {
            it("should 200", function(done) {
                request
                    .post("/autocomplete")
                    .send({ "query": "Hyperten" })
                    .expect(200, done);
            });
        });
    });
});
