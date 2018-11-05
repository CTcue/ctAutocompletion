
const _ = require("lodash");
const config = require("../../config/config");
const ES_MAPPING = require("../../config/elasticsearch/autocomplete.json");

const defaultConfig = parseElasticConfig(config.elasticsearch);
const configInUse = _.clone(defaultConfig);

const elastic = require("elasticsearch");
const elasticClient = new elastic.Client(configInUse);


// Elasticsearch client can reuse it's connection pool quite well.
// * It will only open more connections if it needs them
// * If a different configuration is needed, it must create a new
//   client (also have to restart the app)
function parseElasticConfig(esConfig = {}) {
    const result = {
        "apiVersion": _.get(esConfig, "version", "6.2"),
        "requestTimeout": _.get(esConfig, "requestTimeout", 10000)
    };

    // You can pass an array of hosts (can contain a single item),
    // then it will just use those settings only
    if (_.has(esConfig, "hosts") && _.isArray(esConfig.hosts)) {
        result.hosts = _.get(esConfig, "hosts");
        return result;
    }


    if (_.isEmpty(esConfig)) {
        // If no configuration is provided, fallback to ES defaults
        result.hosts = [
            {
                "host" : "localhost",
                "port" : 9200
            }
        ];
    }
    else {
        const host = {};

        // `host` parameter is required
        host.host = _.get(esConfig, "host", "localhost");

        // In hospitals, the host string can be redirected by Nginx,
        // then the port number is optional
        if (_.isNumber(_.get(esConfig, "port"))) {
            host.port = esConfig.port;
        }

        if (_.get(esConfig, "auth")) {
            host.auth = esConfig.auth;
        }

        result.hosts = [host];
    }

    return result;
}
exports.parseElasticConfig = parseElasticConfig;


// If you want to use a custom-config, easiest is to provide a:
// `"hosts": [ {config} ]`
exports.client = function (customConfig = {}) {
    if (!elasticClient || !_.isEmpty(customConfig)) {
        const extendedConfig = _.extend({}, configInUse, customConfig);
        const parsedConfig = parseElasticConfig(extendedConfig);
        const clonedConfig = _.clone(parsedConfig);

        return new elastic.Client(clonedConfig);
    }

    return elasticClient;
};


exports.createIndexMapping = async function (indexName = "autocomplete") {
    await exports.deleteMapping();

    try {
        const indexSettings = {
            index: indexName,
            body: ES_MAPPING
        };

        return await elasticClient.indices.create(indexSettings);
    } catch (err) {
        // tslint:disable-next-line:no-console
        console.error("[Could not create ES index]", err);
    }
};


exports.deleteMapping = async function(indexName = "autocomplete") {
    try {
        return await elasticClient.indices.delete({ index: indexName });
    } catch (err) {}

    return null;
};
