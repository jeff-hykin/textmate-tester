// get the tokens from the file and process them with the provided function
const path = require("path")
const chalk = require("chalk")
const vsctm = require("vscode-textmate")
const fs = require("fs")
const onigLib = require("./report/onigLib")
const process = require("process")

// retrive the filetypes from the syntax
let extensionsFor = {
    [global.args().textmateExtension]: JSON.parse(fs.readFileSync(global.args().syntax)).fileTypes
}

let languageExtensionFor = (fixturePath) => {
    let fixtureExtension = path.extname(fixturePath).replace(/\./, "")
    let matchingLanguageExtension = null
    // find which lang the extension belongs to
    for (let eachLangExtension of Object.keys(extensionsFor)) {
        // if the path include the language, then use that
        if (fixturePath.includes(`/${eachLangExtension}/`)) {
            matchingLanguageExtension = eachLangExtension
            break
            // if the language extension is in their list, then there
        } else if (extensionsFor[eachLangExtension].includes(fixtureExtension)) {
            matchingLanguageExtension = eachLangExtension
            // break;
        }
    }
    return matchingLanguageExtension
}

/**
 * @param {vsctm.Registry} registry
 * @param {string} path
 * @param {string[]} fixture
 * @param {boolean} showFailureOnly
 * @param {(line: string, token: vsctm.IToken) => boolean} process
 */
module.exports = async function (registry, fixturePath, fixture, showFailureOnly, showLineNumbers, theProcess) {
    let displayedAtLeastOnce = false
    let returnValue = true
    try {
        const grammar = await registry.loadGrammar(`source.${languageExtensionFor(fixturePath)}`)
        if (grammar == null) {
            // If the main grammar is missing, (usually markdown) just pass the test
            return true
        }
        // set the onigLib cause apparently its null sometimes
        grammar._onigLib = onigLib
        let ruleStack = null
        let lineNumber = 1
        for (const line of fixture) {
            if (showLineNumbers) {
                process.stdout.write("Processing line: " + lineNumber + "\r")
            }
            let r = grammar.tokenizeLine(line, ruleStack)
            ruleStack = r.ruleStack
            let displayLine = false
            for (const token of r.tokens) {
                if (!theProcess(line, token)) {
                    displayLine = true
                    returnValue = false
                }
            }
            if (displayLine) {
                showFailureOnly || console.log("line was:\n  %s:%d: |%s|", fixturePath, lineNumber, line)
                displayedAtLeastOnce = true
            }
            lineNumber += 1
        }
    } catch (e) {
        console.error(e)
        returnValue = false
    }
    if (displayedAtLeastOnce) {
        console.log(chalk.redBright("   Failed"))
    }

    return returnValue
}
