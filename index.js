const yargs = require("yargs")

// this will run the corrisponding command
global.args = (
    yargs.wrap(
        yargs.terminalWidth()
    ).commandDir(
        "commands"
    // --color is parsed by chalk
    ).option(
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
    ).option(
        "syntax", 
        {
            default: "syntax.tmLanguage.json",
            type: 'string',
            describe: "a path to your tmLanguage.json file",
            global: true,
        }
    ).option(
        "examples", 
        {
            default: "examples",
            type: 'string',
            describe: "a path to your folder with example files",
            global: true,
        }
    ).option(
        "all",
        {
            default: true,
            describe: "run for all fixtures",
            type: "boolean",
            global: true,
        },
    ).option(
        "textmateExtension", 
        {
            demandOption: true,
            default: false,
            type: "string",
            describe: "what should be appended to all scopes (eg. cpp, python, html, etc)",
            global: true,
        }
    ).strict(

    ).example(
        "$0 --syntax ./syntax.tmLanguage.json --textmateExtension cpp"
    ).argv
)

global.paths = require("./paths")