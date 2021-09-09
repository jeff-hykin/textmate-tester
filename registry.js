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
                console.error(`I can't find the language for ${fixtureExtension}`)
                process.exit()
            }
            grammarPaths = grammarPaths || {
                // add the base grammar
                ["source."+global.args().textmateExtension]: global.args().syntax,
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
