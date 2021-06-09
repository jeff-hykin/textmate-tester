module.exports = {
    command: "test [fixtures..]",
    desc: "run tests",
    builder: yargs => {
        yargs.option("show-failure-only", {
            default: false,
            describe: "Only show IF a spec failed, no details",
            type: "boolean"
        }).positional("fixtures", {
            default: [],
            describe: "the fixtures to use"
        })
    },
    handler: async (yargs) => {
        if (!require("yargs").finishedParse) return
        await require("yargs").secondParseFinished

        const path = require("path")
        const fs = require("fs")

        const yaml = require("js-yaml")

        const runTest = require("../test_runner")
        const allTests = require("../get_tests")

        const defaultTestFilter = test => fs.existsSync(test.specPath)

        const testFilterSelection = (yargs) => {
            if (yargs.fixtures.length !== 0 || yargs.all) {
                return defaultTestFilter
            }
            const status = execSync("git status --porcelain").toString()
            if (status.trim() == "") {
                // git is clean do all tests
                return defaultTestFilter
            }
            let fileExt = []
            for (const line of status.split("\n")) {
                const match = / M (syntaxes\/.+\.tmLanguage.json)/.exec(line)
                if (match) {
                    fileExt = fileExt.concat(
                        JSON.parse(
                            fs.readFileSync(
                                path.join(global.args().root, match[1])
                            ).toString()
                        )["fileTypes"]
                    )
                }
            }
            if (fileExt.length === 0) {
                return defaultTestFilter
            }
            return test => {
                const ext = path.extname(test.fixturePath).slice(1)
                return defaultTestFilter(test) && fileExt.includes(ext)
            }
        }

        const registry = require("../registry").default
        const whichTestFilter = testFilterSelection(yargs)
        let tests = allTests.filter(
            eachTest=>
                whichTestFilter(eachTest)
                && (
                        yargs.fixtures.length == 0
                    || yargs.fixtures.includes( path.relative(yargs.examples, eachTest.fixturePath) )
                )
        )

        let totalResult = true
        for (const test of tests) {
            console.group(
                "running test for",
                path.relative(yargs.examples, test.fixturePath)
            )
            const fixture = fs
                .readFileSync(test.fixturePath)
                .toString()
                .split("\n")
            const spec = fs.readFileSync(test.specPath)
            const result = await runTest(
                registry,
                path.relative(yargs.examples, test.fixturePath),
                fixture,
                yaml.safeLoad(spec, { filename: test.specPath, json: true }),
                yargs.showFailureOnly
            )
            totalResult = result ? totalResult : result
            console.groupEnd()
        }
        console.log()
        process.exit(totalResult ? 0 : 1)
    }
}
