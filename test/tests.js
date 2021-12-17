const _ = require("lodash");
const config = require("../config/config");

const elastic = require("@elastic/elasticsearch");
const elasticClient = new elastic.Client({
    "node": config.elasticsearch.host,
    "auth": config.elasticsearch.auth
});

const agent = require("supertest").agent(`${config.host}:${config.port}`);

describe("test autocomplete queries", function () {
    it("should be able to connect to elasticsearch", async () => {
        const info = (await elasticClient.info()).body;
        expect(info).toBeTruthy();
        expect(info.version.number).toBeTruthy();
    });

    it("should be able to make API calls", function (done) {
        agent
            .get("/")
            .end(function (err, res) {
                expect(res.body.version).toBeTruthy();
                done();
            });
    });

    it("should not allow large POST body input", function(done) {
        // Verify we respond with `too large`
        agent
            .post("/v2/autocomplete")
            .send({ name: Array(5000).join("a") })
            .expect(413, done);
    });

    it("should not allow requests with an empty body", function(done) {
        agent
            .post("/v2/autocomplete")
            .expect(400, done);
    });

    it("should allow requests without a search query", function(done) {
        agent
            .post("/v2/autocomplete")
            .send({ "query" : "" })
            .end(function(err, res) {
                expect(res.status).toBe(200);

                const body = res.body;
                expect(body.hits.length).toBe(0);

                done();
            });
    });

    it("should be able to make autocompletion requests (hypertension)", function(done) {
        agent
            .post("/v2/autocomplete")
            .send({ "query": "Hyperten" })
            .end(function(err, res) {
                expect(res.status).toBe(200);

                const body = res.body;
                expect(body.hits.length).toBeGreaterThan(0);

                const cuis = body.hits.map((h) => { return h.cui });
                const terms = body.hits.map((h) => { return h.str.toLowerCase() });

                expect(cuis.join("\n")).toContain("C0020538");
                expect(terms.join("\n")).toContain("hypertensie");

                done();
            });
    });

    it("can autocomplete with single letter query", function(done) {
        agent
            .post("/v2/autocomplete")
            .send({ "query": "a" })
            .end(function(err, res) {
                expect(res.status).toBe(200);

                const body = res.body;
                expect(body.hits.length).toBeGreaterThan(0);

                done();
            });
    });

    it("can autocomplete with multiple partial phrases", function(done) {
        agent
            .post("/v2/autocomplete")
            .send({ "query": "anky spon" })
            .end(function(err, res) {
                expect(res.status).toBe(200);

                const body = res.body;
                expect(body.hits.length).toBeGreaterThan(0);

                const terms = body.hits.map((h) => { return h.str.toLowerCase() });
                expect(terms.join("\n")).toContain("ankylosing spondylitis")

                done();
            });
    });

    it("can expand a term to obtain synonyms (by CUI)", function(done) {
        agent
            .post("/expand")
            .send({ "query": "C0020538" }) // Hypertension
            .end(function(err, res) {
                expect(res.status).toBe(200);

                const body = res.body;
                expect(body.terms.length).toBeGreaterThan(1);

                done();
            });
    });
});

describe("verify string replacement functions", function () {
    const stringLib = require("../lib/string.js");

    it("Should replace numbers", function () {
        const clean = stringLib.replaceAppendix("Gleason Score 7");
        expect("Gleason Score").toBe(clean);
    });

    it("Should replace numbers", function () {
        const clean = stringLib.replaceAppendix(" Gleason Score 77 ");
        expect("Gleason Score").toBe(clean);
    });

    it("Should replace 'type + num'", function () {
        const clean = stringLib.replaceAppendix("Diabetes mellitus type 2");
        expect("Diabetes mellitus").toBe(clean);
    });

    it("Should replace 'type + roman'", function () {
        const clean = stringLib.replaceAppendix("Diabetes mellitus type II");
        expect("Diabetes mellitus").toBe(clean);
    });

    it("Should replace 'stage + roman'", function () {
        const clean = stringLib.replaceAppendix("Carcinoma stage II");
        expect("Carcinoma").toBe(clean);
    });

    it("Should replace 'stage + roman'", function () {
        const clean = stringLib.replaceAppendix("Carcinoma stage IV");
        expect("Carcinoma").toBe(clean);
    });

    it("Should replace 'stadum + num'", function () {
        const clean = stringLib.replaceAppendix("Carcinoma stadium 0");
        expect("Carcinoma").toBe(clean);
    });

    it("Should replace 'phase + num'", function () {
        const clean = stringLib.replaceAppendix("Carcinoma phase 0");
        expect("Carcinoma").toBe(clean);
    });
});
