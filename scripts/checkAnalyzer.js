#!/usr/bin/env node

const elasticHelper = require("../src/lib/elasticHelper");
const elasticClient = elasticHelper.client();

const inputs = [
    "hypertensie",
    "patiënt",
    "REUMATOÏDE ARTRITIS",
    // "cardiovasculair accident",
    // "myocard infarct",
    // "ER: positief (100%)",
    // "Her2neu",
    // "FEV1 % pred",
    "Diabetes melitus, type 2",
    "Diabetes melitus, type II"
];


async function main() {
    await setup();
    await verify();
}

async function setup() {
    console.info("Generating ES autocomplete mapping");
    return await elasticHelper.createIndexMapping("test-autocomplete-analyzer");
}

async function verify() {
    console.info("Verify analyzer:");

    for (const term of inputs) {
        console.info("");
        console.info("STR   :",  await check(term, "str"));
        console.info("Exact :",  await check(term, "exact"));
        console.info("");

        await check(term, "str");
    }
}

async function check(phrase = "", field = "str", index = "test-autocomplete-analyzer") {
    const analyzeRequest = {
        "index" : index,
        "format": "text",
        "body"  : {
            "text": phrase,
            "field": field
        }
    };

    const response = await elasticClient.indices.analyze(analyzeRequest);

    if (!response) {
        console.error(`Could not tokenize ${field}: ${phrase}`);
    }

    return response.tokens;
};


if (require.main === module) {
    main();
}

