const path = require("path")
const glob = require("glob")
const fs = require("fs")

/**
 * @typedef {{fixture: string, spec: {json: string, yaml: string, default: string}}} Test
 * @param {(test: Test) => boolean} predicate
 * @returns {Test[]}
 */
module.exports = global.args().eachFixture.map((fixturePath) => {
    return {
        fixturePath,
        specPath: fixturePath.replace(/\.[^.]+$/, ".spec.yaml"),
    }
})
