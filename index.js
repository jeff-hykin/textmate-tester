#!/usr/bin/env node
const path = require("path")
const process = require("process")

const yargs = require("yargs")
const glob = require("glob")

// basically: global.args() = yargs.argv


// 
// is a little messy because of https://github.com/yargs/yargs/issues/793
// 
let processYargs = (args) => yargs.wrap(
        yargs.terminalWidth()
    ).option(
        "textmateExtension", 
        {
            required: yargs.finishedParse,
            type: "string",
            describe: "what should be appended to all scopes (eg. cpp, python, html, etc)",
            global: true,
        }
    ).option(
        "examples", 
        {
            default: "./examples/",
            type: 'string',
            describe: "a path to your folder with example files",
            global: true,
        }
    ).option(
        "syntax", 
        {
            default: "./syntax.tmLanguage.json",
            type: 'string',
            describe: "a path to your .tmLanguage.json file",
            global: true,
        }
    ).option(
        "eachFixture",
        {
            describe: "list of fixture files",
            global: true,
            default: (()=>{
                if (!yargs.finishedParse) {
                    return glob.sync(path.join(process.cwd(), "examples", "/**/*")).filter(each=>!(each.match(/\.spec\.yaml$/g)))
                } else if (!args._.includes("--eachFixture")) {
                    const examplesFolder = path.isAbsolute(args.examples) ? args.examples : path.join(args.root, args.examples)
                    return args.eachFixture = glob.sync(path.join(examplesFolder, "/**/*")).filter(each=>!(each.match(/\.spec\.yaml$/g)))
                }
            })(),
        },
    ).option(
        "all",
        {
            default: true,
            describe: "run for all fixtures",
            type: "boolean",
            global: true,
        },
    ).option(
        "root",
        {
            default: process.cwd(),
            describe: "enable color",
            global: true,
        },
    ).option(
        // --color is parsed by chalk
        "color",
        {
            default: true,
            describe: "enable color",
            type: "boolean",
            global: true,
        },
    ).nargs(
        "color",
        0
    ).strict(

    ).example(
        "$0 --textmateExtension cpp --syntax ./syntax.tmLanguage.json"
    ).commandDir(
        "commands"
    ).help(
        'help'
    ).version(
    )

const { hideBin } = require('yargs/helpers')
global.args = ()=>yargs.argv
;((async ()=>{
    await new Promise((resolve, reject)=>processYargs().parse(hideBin(process.argv), resolve))
    yargs.finishedParse = true
    yargs.secondParseFinished = new Promise((resolve, reject)=>processYargs(yargs.argv).parse(hideBin(process.argv), resolve))
})())