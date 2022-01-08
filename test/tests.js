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

    it("should be able to make autocompletion requests (hoofdpijn)", function(done) {
        agent
            .post("/v2/autocomplete")
            .send({ "query": "hoofd" })
            .end(function(err, res) {
                expect(res.status).toBe(200);

                const body = res.body;
                expect(body.hits.length).toBeGreaterThan(0);

                const cuis = body.hits.map((h) => { return h.cui });
                const terms = body.hits.map((h) => { return h.str.toLowerCase() });

                expect(cuis.join("\n")).toContain("C0018681");
                expect(terms.join("\n")).toContain("hoofdpijn");

                done();
            });
    });

    it("should be able to make autocompletion requests (carcinoom)", function(done) {
        agent
            .post("/v2/autocomplete")
            .send({ "query": "carc" })
            .end(function(err, res) {
                expect(res.status).toBe(200);

                const body = res.body;
                expect(body.hits.length).toBeGreaterThan(0);

                const cuis = body.hits.map((h) => { return h.cui });
                const terms = body.hits.map((h) => { return h.str.toLowerCase() });

                expect(cuis.join("\n")).toContain("C0006826");
                expect(terms.join("\n")).toContain("carcinoom");

                done();
            });
    });

    it("should be able to make autocompletion requests (ECOG score)", function(done) {
        agent
            .post("/v2/autocomplete")
            .send({ "query": "ecog" })
            .end(function(err, res) {
                expect(res.status).toBe(200);

                const body = res.body;
                expect(body.hits.length).toBeGreaterThan(0);

                const terms = body.hits.map((h) => { return h.str.toLowerCase() });

                expect(terms.join("\n")).toContain("ecog");
                expect(terms.join("\n")).toContain("ecog score");

                done();
            });
    });

    it("should be able to make autocompletion requests (diabetes)", function(done) {
        agent
            .post("/v2/autocomplete")
            .send({ "query": "diab" })
            .end(function(err, res) {
                expect(res.status).toBe(200);

                const body = res.body;
                expect(body.hits.length).toBeGreaterThan(0);

                const cuis = body.hits.map((h) => { return h.cui });
                const terms = body.hits.map((h) => { return h.str.toLowerCase() });

                expect(cuis.join("\n")).toContain("C0011849");
                expect(terms.join("\n")).toContain("diabetes");

                done();
            });
    });

    it("can autocomplete with multiple partial phrases (ankylosing spondylitis)", function(done) {
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

    it("can autocomplete with multiple partial phrases (LVEF)", function(done) {
        agent
            .post("/v2/autocomplete")
            .send({ "query": "linker ve" })
            .end(function(err, res) {
                expect(res.status).toBe(200);

                const body = res.body;
                expect(body.hits.length).toBeGreaterThan(0);

                const cuis = body.hits.map((h) => { return h.cui });
                const terms = body.hits.map((h) => { return h.str.toLowerCase() });

                expect(cuis.join("\n")).toContain("C0428772");
                expect(terms.join("\n")).toContain("linker ventriculaire ejectiefractie")

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

                const terms = body.terms.join("\n").toLowerCase();
                expect(terms).toContain("hypertension");
                expect(terms).toContain("hoge bloeddruk");

                done();
            });
    });

    it("can expand a term to obtain synonyms (does not error on empty input)", function(done) {
        agent
            .post("/expand-grouped")
            .send({ "query": "" })
            .end(function(err, res) {
                expect(res.status).toBe(200);

                const body = res.body;
                expect(body.terms).toStrictEqual({});

                done();
            });
    });

    it("can expand a term to obtain synonyms (does not error on invalid input)", function(done) {
        agent
            .post("/expand-grouped")
            .send({ "query": "XXX" })
            .end(function(err, res) {
                expect(res.status).toBe(200);

                const body = res.body;
                expect(body.terms).toStrictEqual({});

                done();
            });
    });

    it("can expand a term to obtain synonyms (grouped)", function(done) {
        agent
            .post("/expand-grouped")
            .send({ "query": "C1306459" }) // Malignant neoplasm
            .end(function(err, res) {
                expect(res.status).toBe(200);

                const body = res.body;
                expect(body.terms["english"].length).toBeGreaterThan(1);

                const terms = body.terms["english"].join("\n").toLowerCase();
                expect(terms).toContain("cancer");
                expect(terms).toContain("malignancy");

                done();
            });
    });

    it("can expand a term to obtain synonyms (does not error on empty input)", function(done) {
        agent
            .post("/expand-by-string")
            .send({ "query": "" })
            .end(function(err, res) {
                expect(res.status).toBe(200);

                const body = res.body;
                expect(body.cui).toBe("");
                expect(body.terms).toStrictEqual({});

                done();
            });
    });

    it("can expand a term to obtain synonyms (does not error on invalid input)", function(done) {
        agent
            .post("/expand-by-string")
            .send({ "query": "XXX" })
            .end(function(err, res) {
                expect(res.status).toBe(200);

                const body = res.body;
                expect(body.cui).toBe("");
                expect(body.terms).toStrictEqual({});

                done();
            });
    });

    it("can expand a term to obtain synonyms (by string)", function(done) {
        agent
            .post("/expand-by-string")
            .send({ "query": "Diabetes Mellitus" })
            .end(function(err, res) {
                expect(res.status).toBe(200);

                const body = res.body;

                expect(body.cui).toBe("C0011849");
                expect(body.terms["dutch"].length).toBeGreaterThan(1);
                expect(body.terms["english"].length).toBeGreaterThan(1);

                const terms = body.terms["english"].join("\n").toLowerCase();
                expect(terms).toContain("diabetes");
                expect(terms).toContain("niddm");

                done();
            });
    });
});
