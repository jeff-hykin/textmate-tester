// sort-specs reads the spec files, sorts the keys and remakes them.
// this is not a fixture guided transformation and this has no bearing on wether or not
// a test passes, this also

const path = require("path")
const fs = require("fs")
const yaml = require("js-yaml")

const pathFor = require("../paths")
const allTests = require("../get_tests")

async function sortSpecs(yargs) {
    let tests = allTests.filter(
        eachTest=>
        (
               fs.existsSync(test.specPath)
            || yargs.fixtures.length !== 0
        ) && (
               yargs.fixtures.length == 0
            || yargs.fixtures.includes( path.relative(pathFor.fixtures, eachTest.fixturePath) )
        )
    )

    for (const test of tests) {
        console.log(
            "sorting spec for",
            path.relative(pathFor.fixtures, test.fixturePath)
        )

        const spec = fs.readFileSync(test.specPath)
        fs.writeFileSync(
            test.specPath,
            yaml.dump(yaml.safeLoad(spec), {
                sortKeys: keyCompare
            })
        )
    }
}

function keyCompare(key1, key2) {
    const order = ["source", "scopesBegin", "scopes", "scopesEnd"]
    return order.indexOf(key1) - order.indexOf(key2)
}

module.exports = {
    command: "sort-specs [fixtures..]",
    desc: "sort spec files",
    handler: yargs => sortSpecs(yargs)
}
