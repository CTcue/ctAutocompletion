
const _ = require("lodash");
const elasticHelper = require("../../src/lib/elasticHelper.js");


describe("elasticHelper: parseConfig", function () {
    // it("DESC sort by default", function () {
    //     const result = elasticHelper.sortOrder();
    //     assert.equal(result, "desc");
    // });

    // it("ASC sort by providing 'sort_recent_first: false'", function () {
    //     const result = elasticHelper.sortOrder({ "sort_recent_first": false });
    //     assert.equal(result, "asc");
    // });

    // it("Basic start_date sorting", function () {
    //     const result = elasticHelper.startDateSort();

    //     assert.equal(result.length, 1);
    //     assert.deepEqual(Object.keys(result[0]), ["start_date"]);
    // });

    // it("Can customize start_date sorting", function () {
    //     const result = elasticHelper.startDateSort({}, { "test": { "order": "desc" } });

    //     assert.equal(result.length, 2);
    //     assert.deepEqual(Object.values(result[1]), [{ "order": "desc" }]);
    // });

    // it("Start and End date sorting asc", function () {
    //     const result = elasticHelper.startEndDateSort({ "sort_recent_first": false });

    //     assert.equal(result.length, 2);
    //     assert.deepEqual(Object.keys(result[0]), ["start_date"]);
    //     assert.deepEqual(Object.values(result[0]), [{ "order": "asc" }]);
    // });
});

describe("elasticHelper: client", function () {
    let client;

    beforeAll(function () {
        client = elasticHelper.client();
    });

    afterAll(function () {
        client.close();
    });

    it("Can generate a client that uses default configs", async () => {
        const info = await client.info();
        expect(info).toBeTruthy();
    });
});
