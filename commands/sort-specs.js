// summary:
//      sort-specs reads the spec files, sorts the keys and remakes them.
//      this is not a fixture guided transformation and this has no bearing on wether or not
//      a test passes, this also
module.exports = {
    command: "sort-specs [fixtures..]",
    desc: "sort spec files",
    handler: async (yargs) => {
        if (!require("yargs").finishedParse) return
        
        const path = require("path")
        const fs = require("fs")
        const yaml = require("js-yaml")

        const allTests = require("../get_tests")

        function keyCompare(key1, key2) {
            const order = ["source", "scopesBegin", "scopes", "scopesEnd"]
            return order.indexOf(key1) - order.indexOf(key2)
        }

        let tests = allTests.filter(
            eachTest=>
            (
                fs.existsSync(test.specPath)
                || yargs.fixtures.length !== 0
            ) && (
                yargs.fixtures.length == 0
                || yargs.fixtures.includes( path.relative(global.args.examples, eachTest.fixturePath) )
            )
        )

        for (const test of tests) {
            console.log(
                "sorting spec for",
                path.relative(global.args.examples, test.fixturePath)
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
}
