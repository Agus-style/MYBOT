const fs = require('fs')
const moment = require("moment-timezone")

module.exports = {
    name: "menu",
    alias: ["help","?"],
    desc: "List all command",
    type: "main",
    start: async(caf, m, { commands, args, prefix, text, toUpper }) => {
        //set monoscape
        function setMonoscape(tex) { hasil = '`\`\`'+tex+'`\`\`'; return hasil; }
        //runtime
        function runtime(seconds) {
            seconds = Number(seconds);
            var d = Math.floor(seconds / (3600 * 24));
            var h = Math.floor(seconds % (3600 * 24) / 3600);
            var m = Math.floor(seconds % 3600 / 60);
            var s = Math.floor(seconds % 60);
            var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
            var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
            var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
            var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
            return dDisplay + hDisplay + mDisplay + sDisplay;
        }
        //ucapan waktu
        const hour_now = moment.tz('Asia/Jakarta').format('HH')
        var ucapanWaktu = 'Selamat Pagi'//'Pagi'
        if (hour_now >= '03' && hour_now <= '10') {
            ucapanWaktu = 'Selamat Siang'//'Pagi '
        } else if (hour_now >= '10' && hour_now <= '14') {
            ucapanWaktu = 'Selamat Siang'//'Siang '
        } else if (hour_now >= '14' && hour_now <= '17') {
            ucapanWaktu = 'Selamat Sore'//'Soree '
        } else if (hour_now >= '17' && hour_now <= '18') {
            ucapanWaktu = 'Selamat Malam'//'Selamat '
        } else if (hour_now >= '18' && hour_now <= '23') {
            ucapanWaktu = 'Selamat Malam'//'Malam '
        } else {
            ucapanWaktu = 'Selamat Malam'//'Selamat Malam!'
        }

        const { pushName, sender } = m
        if (args[0]) {
            let data = []
            let name = args[0].toLowerCase()
            let cmd = commands.get(name) || Array.from(commands.values()).find((v) => v.alias.includes(name))
            if (!cmd || cmd.type == "hide") return m.reply("No Command Found")
            else data.push(`*Command :* ${cmd.name.replace(/^\w/, c => c.toUpperCase())}`)
            if (cmd.alias) data.push(`*Alias :* ${cmd.alias.join(", ")}`)
            if (cmd.use) data.push(`*Use:* ${cmd.use}`);
            if (cmd.desc) data.push(`*Description :* ${cmd.desc}\n`)
            if (cmd.example) data.push(`*Example :* ${cmd.example.replace(/%prefix/gi, prefix).replace(/%command/gi, cmd.name).replace(/%text/gi, text)}`)
            return m.reply(`*Info Command ${cmd.name.replace(/^\w/, c => c.toUpperCase())}*\n\n${data.join("\n")}`)
        } else {
            let teks = `
*Bot Information*
*Hai Kak " ${m.pushName} "  ${ucapanWaktu}*
➤ _Nama Owner: CAF_
➤ _Runtime: ${runtime(process.uptime())}_\n\n
`
            for (let type of commands.type) {
                teks += `╭––『 *${(type + ' menu').toUpperCase()}* 』 \n`
                teks += `┆\n`
                teks += `${commands.list[type].filter(v => v.type !== "hide").map((cmd) => `┆❏ ${prefix + setMonoscape(cmd.name)} ${cmd.use ? " " + cmd.use : ""}`).join("\n")}\n`
                teks += `┆\n`
                teks += `╰–––––––––––––––༓\n\n`
            }

            caf.linkUp(m.from, teks, "https://cafajah.my.id", fs.readFileSync('./assets/img/ai.png'), "CAF", 'This Is My Whatsapp BOT')
            //caf.sendMessage(m.from, {text: teks }, { quoted: m })
        }
    },
    noLimit: true,
}
