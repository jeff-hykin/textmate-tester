// This file returns onigLib
const OnigScanner = require("./onig_scanner")
const recorder = require("./recorder")
const oniguruma = require("oniguruma")

module.exports = {
    createOnigScanner: (patterns, scopeName) => {
        if (patterns.length !== 0 && !scopeName) {
            const match = patterns[0].match(/^\(\?#(.+):\d+\)/)
            if (match) {
                if (match[1].includes(".")) {
                    scopeName = match[1].split(".").slice(-1)[0]
                } else {
                    scopeName = match[1]
                }
            }
        }
        let recorder
        if (typeof scopeName == "string" && scopeName.length != 0) {
            recorder = recorder.getRecorder(scopeName)
        }
        // grab scopeName from first pattern
        return new OnigScanner(patterns, recorder)
    },
    createOnigString: (s) => {
        let string = new oniguruma.OnigString(s)
        string.content = s
        return string
    },
}
