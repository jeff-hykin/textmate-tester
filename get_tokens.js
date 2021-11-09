// get the tokens from the file and process them with the provided function
const path = require("path")
const chalk = require("chalk")
const vsctm = require("vscode-textmate")
const fs = require("fs")
const onigLib = require("./report/onigLib")
const process = require("process")

// retrive the filetypes from the syntax
const grammarFile = JSON.parse(fs.readFileSync(global.args().syntax))
let extensionsFor = {
    [grammarFile.scopeName]: grammarFile.fileTypes
}

const scopeNameForFixture = (fixturePath) => {
    let fixtureExtension = path.extname(fixturePath).replace(/\./, "")
    let matchingLanguageExtension = null
    // find which lang the extension belongs to
    for (const [eachLang, extensions] of Object.entries(extensionsFor)) {
        const extensionsWithoutDots = extensions.map(each=>each.replace(/\./,""))
        if (extensionsWithoutDots.includes(fixtureExtension)) {
            return eachLang
        }
    }
    // if no match found
    console.error(`When generating tests for ${fixturePath}\n    I found the extension: ${fixtureExtension}\n    however I don't see a language with that extension:\n${JSON.stringify(extensionsFor,0,4)}\n\n    to add an extension to a language, use the\n    "fileTypes": [ ".example_extension" ]\n    part in the grammar file`)
    return null
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
        const grammarScopeName = scopeNameForFixture(fixturePath)
        // if no grammar available, skip it
        if (grammarScopeName == null) {
            return true
        }
        const grammar = await registry.loadGrammar(grammarScopeName)
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
