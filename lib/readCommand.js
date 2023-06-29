const { delay } = require ('@whiskeysockets/baileys')
const path = require("path")
const fs = require('fs')
var _path = process.cwd();
const { Collection } = require("./");

Commands.prefix = '.';

/**
 * @param {NoParamCallback}  
 */
const readCommands = () => {
    let dir = path.join(_path, "/commands")
    let dirs = fs.readdirSync(dir)
    let listCommand = {}
    try {
        dirs.forEach(async (res) => {
            let groups = res.toLowerCase()
            Commands.type = dirs.filter(v => v !== "_").map(v => v)
            listCommand[groups] = []
            let files = fs.readdirSync(`${dir}/${res}`).filter((file) => file.endsWith(".js"))
            //console.log(files)
            for (const file of files) {
                const command = require(`${dir}/${res}/${file}`)
                listCommand[groups].push(command)
                Commands.set(command.name, command)
                delay(100)
            }
        })
        Commands.list = listCommand
    } catch (e) {
        console.error(e)
    }
    return listCommand;
}

module.exports = { readCommands }