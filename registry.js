const path = require("path")
const fs = require("fs")
const glob = require("glob")
const vsctm = require("vscode-textmate")
const rewriteGrammar = require("./report/rewrite_grammar")

function getRegistry(getOnigLib) {
    return new vsctm.Registry({
        loadGrammar: (sourceName) => {
            if (sourceName == null) {
                console.error(`I can't find the language for ${fixtureExtension}`)
                process.exit()
            }
            let grammarPath = global.args().syntax
            // check if the syntax exists
            if (!fs.existsSync(grammarPath)) {
                console.warn(`requested grammar "${sourceName}" which is outside of this repository`)
                return Promise.resolve({})
            }
            console.log(sourceName)
            return Promise.resolve(
                rewriteGrammar(fs.readFileSync(grammarPath).toString(), sourceName)
            )
        },
        getOnigLib,
    })
}

module.exports = {
    getRegistry,
    default: getRegistry(undefined),
}
