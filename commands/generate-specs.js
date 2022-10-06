// summary:
//     generates spec files for fixtures that are missing them
module.exports = {
    command: "generate-specs [fixtures..]",
    desc: "(re)generate spec files",
    builder: (yargs) => {
        yargs.positional("fixtures", {
            default: [],
            describe: "the fixtures to use",
        })
    },
    handler: async (args) => {
        if (!require("yargs").finishedParse) return
        await require("yargs").secondParseFinished
        
        const path = require("path")
        const fs = require("fs")
        const yaml = require("js-yaml")

        const generateSpec = require("../generate_spec")

        const allTests = require("../get_tests")

        // helper function 
        function keyCompare(key1, key2) {
            const order = ["source", "scopesBegin", "scopes", "scopesEnd"]
            return order.indexOf(key1) - order.indexOf(key2)
        }

        // either get all tests, or only the ones that are mentioned
        let tests = args.all ? allTests : allTests.filter(each => {
            for (const arg of args.examples) {
                if (eachTest.fixturePath.match(arg)) {
                    return true
                }
            }
            return false
        })
        
        let totalTime = 0
        for (const test of tests) {
            const fixturePath = test.fixturePath
            const start = (new Date()).getTime()
            console.log("generating spec for", path.relative(global.args().examples, fixturePath))
            const fixtureLines = fs.readFileSync(fixturePath).toString().split("\n")

            const spec = await generateSpec(fixturePath, fixtureLines)
            const end = (new Date()).getTime()
            const duration = (end-start)
            totalTime += duration
            console.log(`time: ${duration/1000}sec`)
            fs.writeFileSync(
                test.specPath,
                yaml.dump(JSON.parse(JSON.stringify(spec)), {
                    sortKeys: keyCompare,
                })
            )
        }
        console.log(`Processing time for all: ${totalTime/1000}sec`)
    },
}
