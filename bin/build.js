const fs = require('fs')
const path = require('path')
const repl = require("node:repl");
const config = require("./tampermonkey.config.js")
const userscript = require("userscript-meta")
const webpack_config = require("../webpack.config.js")

for (const entryName in webpack_config.entry) {
    const fileName = webpack_config.output.filename.replace("[name]", entryName)
    const filePath = path.resolve(webpack_config.output.path, fileName)
    let text = fs.readFileSync(filePath,'utf8')

    const banner = userscript.stringify(config)

    let outputUserPath =  path.resolve(webpack_config.output.path,`${entryName}.user.js`)
    let outputMetaPath =  path.resolve(webpack_config.output.path,`${entryName}.meta.js`)

    fs.writeFileSync(outputMetaPath,banner)
    fs.writeFileSync(outputUserPath,banner+"\n"+text+"\n")
    console.log(`${entryName}, build finished`)
}
