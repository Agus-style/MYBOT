const { youtubeAudio, youtubeVideo } = require('../../lib/scrape').yt
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
    name: "youtube",
    alias: ["ytdl", "ytt"],
    use: "<url>",
    desc: desc,
    type: "downloader",
    example: "%prefix%command <url>",
    start: async(caf, m, { prefix, command, text, monoscape }) => {
        let reg1 = /-q\s(\w+)/
        let url = text.match(/^(https?:\/\/[^\s]+)/)[1]
        let quality = text.match(reg1) ? text.match(reg1)[1] : '480p'
        let reg2 = /(?:http(?:s|):\/\/|)(?:(?:www\.|)?youtube(?:\-nocookie|)\.com\/(?:shorts\/)?(?:watch\?.*(?:|\&)v=|embed\/|v\/)?|youtu\.be\/)([-_0-9A-Za-z]{11})/.test(url)
        if(!reg2) return m.reply(`Lihat Cara Penggunaan Fitur dengan perintah:\n"${prefix}${command} --desc" `);
        if(text.endsWith("--mp3")) {
            youtubeAudio(url).then(async(res) => {
                var thumbnail = await fetchBuffer(res.data.thumb)
                var title = res.data.title
                var dl = res.data.dlink
                await caf.sendMessage(m.from, { document: { url: dl }, mimetype: 'audio/mpeg', fileName: `${title}.mp3`,contextInfo: {externalAdReply: {title: `${title}`, body: "©CAF", mediaUrl: text, sourceUrl: text, mediaType: 2, showAdAttribution: false, thumbnail: thumbnail, sourceUrl: url }}}, { quoted: m })
            })
        } else if(text.endsWith("--mp4") || text.endsWith("")) {
            youtubeVideo(url, quality).then(async(res) => {
                var thumbnail = await fetchBuffer(res.data.thumb)
                var title = res.data.title
                var dl = res.data.dlink
                var capt  = "*Youtube Downloader*\n\n"
                    capt += `${monoscape("Title")}: ${title}\n`
                    capt += `${monoscape("Resolusi")}: ${res.data.fquality}\n`
                    capt += `${monoscape("Size")}: ${res.data.size}\n`
                await caf.sendMessage(m.from, { video: { url: dl }, caption: capt, contextInfo: {externalAdReply: {title: `${title}`, body: "©CAF", mediaUrl: text, sourceUrl: text, mediaType: 2, showAdAttribution: false, thumbnail: thumbnail, sourceUrl: url }} }, { quoted: m })
                // await caf.sendMessage(m.from, { document: { url: dl }, mimetype: 'video/mp4', fileName: `${title}.mp3`,contextInfo: {externalAdReply: {title: `${title}`, body: "©CAF", mediaUrl: text, sourceUrl: text, mediaType: 2, showAdAttribution: false, thumbnail: thumbnail, sourceUrl: url }}}, { quoted: m })
            })
        }
    },
    isQuery: true
}