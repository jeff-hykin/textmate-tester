const path = require("path")
const glob = require("glob")
const fs = require("fs")

const pathFor = require("./paths")

/**
 * @typedef {{fixture: string, spec: {json: string, yaml: string, default: string}}} Test
 * @param {(test: Test) => boolean} predicate
 * @returns {Test[]}
 */
module.exports = pathFor.eachFixture.map((fixturePath) => ({
    fixturePath,
    specPath: fixturePath.replace(/\.[^.]+/, ".spec.yaml"),
}))
