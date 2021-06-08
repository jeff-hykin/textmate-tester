const path = require("path")
const glob = require("glob")
const fs = require("fs")

/**
 * @typedef {{fixture: string, spec: {json: string, yaml: string, default: string}}} Test
 * @param {(test: Test) => boolean} predicate
 * @returns {Test[]}
 */
console.debug(`require("yargs").argv is:`,require("yargs").argv)
module.exports = global.args().eachFixture.map((fixturePath) => ({
    fixturePath,
    specPath: fixturePath.replace(/\.[^.]+/, ".spec.yaml"),
}))
