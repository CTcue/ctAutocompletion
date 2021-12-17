#!/usr/bin/env node

const config = require("../config/config");
const ES_MAPPING = require("../mapping/autocomplete.json");

const elastic = require("@elastic/elasticsearch");
const elasticClient = new elastic.Client({
    "node": config.elasticsearch.host,
    "auth": config.elasticsearch.auth
});


async function createIndexMapping(indexName = "autocomplete") {
    try {
        await elasticClient.indices.delete({ index: indexName });
    } catch (err) {}

    try {
        const indexSettings = {
            index: indexName,
            body: ES_MAPPING
        };

        await elasticClient.indices.create(indexSettings);
    } catch (err) {
        // tslint:disable-next-line:no-console
        console.error("[Could not create ES index]", err.meta.body);
    }
};

if (require.main === module) {
    createIndexMapping("autocomplete");

    console.info("Generated autocomplete mapping:");
    console.info("http://localhost:9200/autocomplete/_search?pretty");
    console.info("");
}
