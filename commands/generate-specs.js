// generates spec files for fixtures that are missing them

const path = require("path")
const fs = require("fs")
const yaml = require("js-yaml")

const generateSpec = require("../generate_spec")
const pathFor = require("../paths")

const allTests = require("../get_tests")

// helper function 
function keyCompare(key1, key2) {
    const order = ["source", "scopesBegin", "scopes", "scopesEnd"]
    return order.indexOf(key1) - order.indexOf(key2)
}

module.exports = {
    command: "generate-specs [fixtures..]",
    desc: "(re)generate spec files",
    builder: (yargs) => {
        yargs.positional("fixtures", {
            default: [],
            describe: "the fixtures to use",
        })
    },
    handler: async (yargs) => {
        // either get all tests, or only the ones that are mentioned
        let tests = yargs.all ? allTests : allTests.filter(each => {
            for (const arg of yargs.examples) {
                if (eachTest.fixturePath.match(arg)) {
                    return true
                }
            }
            return false
        })

        for (const test of tests) {
            const fixturePath = test.fixturePath
            console.log("generating spec for", path.relative(global.args.examples, fixturePath))
            const fixtureLines = fs.readFileSync(fixturePath).toString().split("\n")

            const spec = await generateSpec(fixturePath, fixtureLines)
            fs.writeFileSync(
                test.specPath,
                yaml.dump(JSON.parse(JSON.stringify(spec)), {
                    sortKeys: keyCompare,
                })
            )
        }
    },
}
