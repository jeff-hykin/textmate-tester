const path = require("path")

module.exports = {
    removeScopeName: (scope) => {
        let languageEndings = [ global.args().textmateExtension ]
        let matchEnding = RegExp(`\\\.(?:${languageEndings.join("|")})$`, "g")
        return scope.replace(matchEnding, "")
    },
}
