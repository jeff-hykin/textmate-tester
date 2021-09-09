# What is this?

Its a testing tool for anyone trying to maintain a TextMate Grammar (ex: `thing.tmLanguage.json`).

# How do I use this?

- First setup node/npm, and run `npm install textmate-tester`
    - Note: one of the dependencies node-gyp... and node-gyp is often a pain to setup. I've created a fixed/frozen environment to automate this though (see the `documentation/SETUP.md`)
- Well first you need to have a textmate grammar file (example: `./cpp.tmLanguage.json`)
- Then you need a folder full of example files (ex: `./examples/hello_world.cpp`)
- Then you can run a command like this `npx textmate-tester --textmateExtension cpp --syntax cpp.tmLanguage.json --examples examples/ generate-specs --all`

- Inside of the example folder, a spec file will be generated for each example (ex: `examples/hello_world.spec.yaml`)
- Use git to commit these spec files every time you change the grammar
- By using git-diff, you can see which examples got parsed differently
    - When you're fixing a bug you'll expect certain files to change, and can basically confirm they changed
    - However, you might also see several other spec files change, that should *not* have changed. And this basically shows you exactly what kind of side-effects were caused by a bug fix or feature addition.

# Installation/Setup this project for 

Everything is detailed in the `documentation/SETUP.md`!