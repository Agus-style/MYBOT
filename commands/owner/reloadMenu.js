var { readCommands } = require("../../lib/readCommand");

module.exports = {
    name: "reload",
    alias: ["rs"],
    desc: "Refresh Features",
    type: "owner",
    start: async(caf, m, { text }) => {
        var a = await readCommands()
        m.reply('Refresh Features: Success')
    },
    isOwner: true
}