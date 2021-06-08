const path = require("path");
const glob = require("glob");
const fs   = require("fs");
const _ = require("lodash")

const root     = path.dirname(process.cwd())

module.exports = {
    root: root,
    tests:          root,
    // match everything that isnt a spec
    eachFixture:    glob.sync(path.join(root, global.args.examples, "/**/*")).filter(each=>!(each.match(/\.spec\.yaml$/g))),
    jsonSyntax:     (extensionName) => path.join(root, global.args.syntax)
}
