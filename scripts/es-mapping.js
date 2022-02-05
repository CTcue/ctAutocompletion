#!/usr/bin/env node

const config = require("../config/config");
const ES_MAPPING = require("../mapping/autocomplete.json");

const elastic = require("@elastic/elasticsearch");
const elasticClient = new elastic.Client({
    "node": config.elasticsearch.host,
    "auth": config.elasticsearch.auth
});

async function createIndexMapping() {
    const index = config.elasticsearch.index || "autocomplete";

    try {
        await elasticClient.indices.delete({ index: index });
    } catch (err) {}

    try {
        const indexSettings = {
            index: index,
            body: ES_MAPPING
        };

        await elasticClient.indices.create(indexSettings);
    } catch (err) {
        if (err.meta && err.meta.body) {
            console.error(JSON.stringify(err.meta.body, null, 4));
        }
        else {
            console.error("[Could not create ES index]");
            console.error(err);
        }
    }
};

if (require.main === module) {
    createIndexMapping();

    console.info("Generated autocomplete mapping:");
    console.info(`http://${config.elasticsearch.host}:9200/autocomplete/_search?pretty`);
    console.info("");
}
