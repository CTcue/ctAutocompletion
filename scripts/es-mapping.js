#!/usr/bin/env node

const elasticHelper = require("../src/lib/elasticHelper");

if (require.main === module) {
    console.info("Generating ES autocomplete mapping");

    elasticHelper.createIndexMapping("autocomplete");
}
