const { tiktok } = require("../../lib/scrape")

module.exports = {
    name: "tiktok",
    alias: ["ttdl"],
    use: "<url> <option>",
    opt: ["--mp3", "--mp4"],
    desc: "Download Media From https://tiktok.com",
    type: "downloader",
    example: "%prefix%command <url> <option>",
    start: async(caf, m, { text }) => {
        let url = text.split(/[-*]/g)[0]
        if(!/^http(s):\/\/(?:m|www|vm|vt)\.tiktok\.com\/[*]*/.test(url)) return m.reply('Terjadi Kesalahan, Coba periksa kembali URL');
        let result = await tiktok(url.trim())
        var { data } = result
        if(!result.status) return m.reply('Terjadi Kesalahan, Coba periksa kembali URL');
        if(text.endsWith("--mp3")) {
            caf.sendMessage(m.from, { document: { url: data.mp3 }, fileName: `@${data.nick}.mp3` }, { quoted: m})
        } else {
            caf.sendMessage(m.from, { video: { url:  data.mp4 }, caption: `*@${data.nick}*\n\n${data.video_info}` }, { quoted: m})
        }
    },
    isQuery: true
}