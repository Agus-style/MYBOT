const { delay, extractMessageContent } = require("@whiskeysockets/baileys")
const { isUrl, fetchUrl } = require("../../lib/Function")

module.exports = {
    name: "sticker",
    alias: ["s","stiker"],
    use: "<reply>",
    desc: "Convert Image, Video, Gif To Sticker",
    type: "convert",
    example: "\nsticker : %prefix%command --media reply\nPP sticker : %prefix%command @tag\nurl sticker : %prefix%command <url>",
    start: async(caf, m, { command, prefix, text, quoted, mime }) => {
        if (!quoted) return  m.reply(`Reply to Supported media With Caption ${prefix + command}`)
        if (/image|video|sticker/.test(mime)) {
            let download = await caf.downloadMediaMessage(quoted)
            caf.sendFile(m.from, download, "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
        } else if (isUrl(text)) {
            if (isUrl(text)) caf.sendFile(m.from, isUrl(text)[0], "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
            else m.reply('No Url Match')
        } else if (quoted.type == "templateMessage") {
            let download = await caf.downloadMediaMessage(quoted)
            caf.sendFile(m.from, download, "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
        } else if (quoted.type == "buttonsMessage") {
            let download = await caf.downloadMediaMessage(quoted)
            caf.sendFile(m.from, download, "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
            caf.sendFile(m.from, url, "", m, { asSticker: true, author: config.exif.author, packname: config.exif.packname, categories: ['😄','😊'] })
        } else {
            return m.reply(`Reply to Supported media With Caption ${prefix + command}`, m.from, { quoted: m })
        }
    }
}