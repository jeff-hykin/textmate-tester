// This file returns onigLib
const OnigScanner = require("./onig_scanner")
const {getRecorder, getRecorderNames} = require("./recorder")
const oniguruma = require("oniguruma")
module.exports = {
    createOnigScanner: (patterns, scopeName) => {
        let theRecorder
        if (patterns.length !== 0 && !scopeName) {
            const match = patterns[0].match(/^\(\?#(.+):\d+\)/)
            if (match) {
                scopeName = match[1]
                const realScopeName = scopeName
                theRecorder = getRecorder(scopeName)
                if (!theRecorder) {
                    if (match[1].includes(".")) {
                        scopeName = match[1].split(".").slice(-1)[0]
                    } else {
                        scopeName = match[1]
                    }
                    theRecorder = getRecorder(scopeName)
                    if (!theRecorder) {
                        throw Error(`Couldn't find ${realScopeName} or ${scopeName} inside of the available recorders: ${JSON.stringify(getRecorderNames())}`)
                    }
                }
            } else {
                throw Error(`I can usually detect the scopeName based on the patterns\nFor example: "source.js" from pattern: "(?#source.js:863)^(///)\\s*(?=<(reference|amd))"\n\nHowever this time I was unable to for this pattern:\n${JSON.stringify(`${patterns[0]}`)}`)
            }
        }
        if (typeof scopeName == "string" && scopeName.length != 0) {
            theRecorder = getRecorder(scopeName)
        }
        // grab scopeName from first pattern
        return new OnigScanner(patterns, theRecorder)
    },
    createOnigString: (s) => {
        let string = new oniguruma.OnigString(s)
        string.content = s
        return string
    },
}
