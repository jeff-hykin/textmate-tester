const path = require("path")
const fs = require("fs")
const glob = require("glob")
const vsctm = require("vscode-textmate")
const rewriteGrammar = require("./report/rewrite_grammar")
const chalk = require("chalk")

let grammarPaths = null
function getRegistry(getOnigLib) {
    return new vsctm.Registry({
        loadGrammar: (sourceName) => {
            if (sourceName == null) {
                console.error(`I received a sourceName of null inside loadGrammar() and I'm not sure why. Try checking the "fileTypes": of your grammar(s)`)
                process.exit()
            }
            const grammarFile = JSON.parse(fs.readFileSync(global.args().syntax))
            grammarPaths = grammarPaths || {
                // add the base grammar
                [grammarFile.scopeName]: global.args().syntax,
                // add the others
                ...JSON.parse(global.args().supportSyntaxes),
            }
            let thisGrammarPath = grammarPaths[sourceName]
            // check if the syntax exists
            if (!thisGrammarPath || !fs.existsSync(thisGrammarPath)) {
                console.log(chalk.yellowBright(`    requested grammar "${sourceName}" which is outside of this repository`))
                return Promise.resolve({})
            }
            console.log(sourceName)
            return Promise.resolve(
                rewriteGrammar(fs.readFileSync(thisGrammarPath).toString(), sourceName)
            )
        },
        getOnigLib,
    })
}

module.exports = {
    getRegistry,
    default: getRegistry(undefined),
}
