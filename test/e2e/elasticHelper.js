
const _ = require("lodash");
const elasticHelper = require("../../src/lib/elasticHelper.js");

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
