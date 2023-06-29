const { youtubeAudio } = require('../../lib/scrape').yt
const { fetchBuffer } = require("../../lib/Function")

var desc = `
*Download Media From Youtube*\n\n
available video quality: 
(360p, 480p, 720p, 1080p)
availabe audio quality:
(128kbps)

[example]
default quality: 480p
%prefix%command  https://youtu.be/9MOc5lip-Tc
(specific quality)
%prefix%command  https://youtu.be/9MOc5lip-Tc -q 720p
`
module.exports = {
    name: "ytmp3",
    alias: ["ytaudio"],
    use: "<url>",
    desc: desc,
    type: "downloader",
    example: "%prefix%command <url>",
    start: async(caf, m, { prefix, command, text }) => {
        let url = text.replace(/--(\w+)/g, '')
        reg = /(?:http(?:s|):\/\/|)(?:(?:www\.|)?youtube(?:\-nocookie|)\.com\/(?:shorts\/)?(?:watch\?.*(?:|\&)v=|embed\/|v\/)?|youtu\.be\/)([-_0-9A-Za-z]{11})/.test(url)
        if(!reg) return m.reply(`Lihat Cara Penggunaan Fitur dengan perintah:\n"${prefix}${command} --desc" `);
        youtubeAudio(url).then(async(res) => {
            var thumbnail = await fetchBuffer(res.data.thumb)
            var title = res.data.title
            var dl = res.data.dlink
            await caf.sendMessage(m.from, { document: { url: dl }, mimetype: 'audio/mpeg', fileName: `${title}.mp3`,contextInfo: {externalAdReply: {title: `${title}`, body: "©CAF", mediaUrl: text, sourceUrl: text, mediaType: 2, showAdAttribution: false, thumbnail: thumbnail, sourceUrl: url }}}, { quoted: m })
        })
    },
    isQuery: true
}