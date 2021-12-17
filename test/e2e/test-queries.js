const _ = require("lodash");
const config = require("../../config/config");

const elastic = require("@elastic/elasticsearch");
const elasticClient = new elastic.Client({
    "node": config.elasticsearch.host,
    "auth": config.elasticsearch.auth
});

const agent = require('supertest').agent(`${config.host}:${config.port}`);

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
});
