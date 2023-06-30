require("./global")
const { generateWAMessage, areJidsSameUser, proto } = require('@whiskeysockets/baileys')
const { Simple, Collection, Function } = require("./lib")
const { isUrl, isNumber } = Function
const Func = require("./lib")
const fs = require("fs")
const moment = require("moment-timezone")
const chalk = require("chalk")
const { correct } = require("./lib/Correct")

global.config = JSON.parse(fs.readFileSync('./config.json'))




module.exports = async (caf, m, commands, chatUpdate) => {
    try {
        let { type, isGroup, sender, from } = m
        let body = (type == "buttonsResponseMessage") ? m.message[type].selectedButtonId : (type == "listResponseMessage") ? m.message[type].singleSelectReply.selectedRowId : (type == "templateButtonReplyMessage") ? m.message[type].selectedId : m.text 
        let metadata = isGroup ? await caf.groupMetadata(from) : {}
        let pushname = isGroup ? metadata.subject : m.pushName
        let participants = isGroup ? metadata.participants : [sender]
        let groupAdmin = isGroup ? participants.filter(v => v.admin !== null).map(v => v.id) : []
        let isBotAdmin = isGroup ? groupAdmin.includes(caf.user?.jid) : false
        let isAdmin = isGroup ? groupAdmin.includes(sender) : false
        let isOwner = [caf.user?.jid, ...config.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(sender)

        global.isOffline = group.cekOffline(from, _group)

        if (config.options.self && !isOwner && !m.fromMe) return

        const prefix = /^[.#$]/gi.test(body) ? body.match(/^[.#$]/)[0] : false


        let isCmd = body.startsWith(prefix)
        let fatih = (m.quoted || m)
        let zhw = (fatih.mtype == 'buttonsMessage') ? fatih[Object.keys(fatih)[1]] : (fatih.mtype == 'templateMessage') ? fatih.hydratedTemplate[Object.keys(fatih.hydratedTemplate)[1]] : (fatih.mtype == 'product') ? fatih[Object.keys(fatih)[0]] : (fatih.mtype == 'viewOnceMessage') ? fatih.message[Object.keys(fatih.message)[0]] : m.quoted ? m.quoted : m
        let quoted = (zhw.msg || zhw)
        let mime = (zhw.msg || zhw).mimetype || ''
        let isMedia = /image|video|sticker|audio/.test(mime)
        let budy = (typeof m.text == "string" ? m.text : "")
        let args = body.trim().split(/ +/).slice(1)
        let ar = args.map((v) => v.toLowerCase())
        let text = q = args.join(" ")
        let cmdName = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
        const cmd = commands.get(cmdName) || Array.from(commands.values()).find((v) => v.alias.find((x) => x.toLowerCase() == cmdName)) || ""

        if (isOffline && cmdName && !isOwner && !cmd.isOffline) return
        if (isGroup) group.addGroup(m.from)

        
        if (m.message && isGroup) {
            console.log("" + "\n" + chalk.black(chalk.bgWhite('[ GRUP ]')), chalk.black(chalk.bgBlueBright(isGroup ? metadata.subject : m.pushName)) + "\n" + chalk.black(chalk.bgWhite('[ TIME ]')), chalk.black(chalk.bgBlueBright(new Date)) + "\n" + chalk.black(chalk.bgWhite('[ FROM ]')), chalk.black(chalk.bgBlueBright(m.pushName + " @" + m.sender.split('@')[0])) + "\n" + chalk.black(chalk.bgWhite('[ BODY ]')), chalk.black(chalk.bgBlueBright(body || type)) + "\n" + "")
        }
        if (m.message && !isGroup) {    
            console.log("" + "\n" + chalk.black(chalk.bgWhite('[ PRIV ]')), chalk.black(chalk.bgRedBright('PRIVATE CHATT')) + "\n" + chalk.black(chalk.bgWhite('[ TIME ]')), chalk.black(chalk.bgRedBright(new Date)) + "\n" + chalk.black(chalk.bgWhite('[ FROM ]')), chalk.black(chalk.bgRedBright(m.pushName + " @" + m.sender.split('@')[0])) + "\n" + chalk.black(chalk.bgWhite('[ BODY ]')), chalk.black(chalk.bgRedBright(body || type)) + "\n" + "")
        }
        
        // STICKER COMMAND
        // if (isMedia && m.msg.fileSha256 && (m.msg.fileSha256.toString("hex") in global.db.sticker)) {
        //     let hash = global.db.sticker[m.msg.fileSha256.toString("hex")]
        //     let { text, mentions } = hash
        //     let messages = await generateWAMessage(m.from, { text, mentions }, {
        //         userJid: caf.user.jid,
        //         quoted: m.quoted && m.quoted.fakeObj
        //     })
        //     messages.key.fromMe = await areJidsSameUser(m.sender, caf.user.jid)
        //     messages.key.id = m.id
        //     messages.pushName = m.pushName
        //     if (m.isGroup) messages.participant = m.sender
        //     let msg = {
        //         ...chatUpdate,
        //         messages: [proto.WebMessageInfo.fromObject(messages)],
        //         type: "append"
        //     }
        //     caf.ev.emit("messages.upsert", msg)
        // }

        // DATABASE
        // try {
        //     let chat = global.db.chats[m.from]
        //     if (typeof chat !== "object") global.db.chats = {}
        //     if (chat) {
        //         if (!('antidelete' in chat)) chat.antidelete = true
        //     } else global.db.chats[m.from] = {
        //         antidelete: true
        //     }
        // } catch(e) {
        //     console.error(e)
        // }

        // setInterval(() => {
        //     fs.writeFileSync('./database/db.json', JSON.stringify(global.db, null, 2))
        // }, 15 * 1000)

        // ANTILINK
        // if (isGroup && isBotAdmin && isAntilink && !isAdmin && !isOwner) {
        //     if (budy.match("://chat.whatsapp.com/")) {
        //         setTimeout( () => {
        //             caf.groupParticipantsUpdate(from, [sender], "remove")
        //         }, 5 * 1000)
        //         setTimeout( () => {
        //             m.reply('*⭔ Link Group Detected!*\n_Sorry you will be kicked from this group!_')
        //         }, 0)
        //     }
        // }

        // ANTI DELETE
        // if (isAntidelete && m.message && m.message.protocolMessage && m.message.protocolMessage.type == 0) {
        //     if (!db.chats[m.from].antidelete) return
        //     let key = m.message.protocolMessage.key
        //     let msg = await caf.serializeM(await Store.loadMessage(key.remoteJid, key.id))
        //     let teks = `「 Message Delete Detect 」\n\n⬡ Name : ${msg.pushName}\n⬡ User : @${msg.sender.split("@")[0]}\n⬡ Date : ${moment(msg.messageTimestamp * 1000).tz(config.timezone)}\n⬡ Type : ${msg.type}\n`
        //     let tekss = teks.replace("GMT+0700", "")
        //     caf.relayMessage(m.from, msg.message, { messageId: msg.id })
        //     await caf.sendText(m.from, tekss, msg, { mentions: [msg.sender] })
        // }
        

        // uncomment jika ingin menggunakan
        if (!isOffline && isCmd && !cmd) {
            var array = Array.from(commands.keys());
            Array.from(commands.values()).map((v) => v.alias).join(" ").replace(/ +/gi, ",").split(",").map((v) => array.push(v))
            
            var anu = correct(cmdName, array)
            var alias = commands.get(anu.result) || Array.from(commands.values()).find((v) => v.alias.find((x) => x.toLowerCase() == anu.result)) || ""
            teks = `Command Not Found!\nMaybe you mean is\n\n*_Command :_* ${prefix + anu.result}\n*_Alias :_* ${alias.alias.join(", ")}\n\n_Send command again if needed_`
            m.reply(teks)
        } else if (!cmd) return

        if(m.text.startsWith('>')) {
            if(!isOwner) return global.mess("owner", m);
            let evaled
            let text = (m.text).slice(2);
            try {
                if (text.endsWith("--sync")) {
                    console.log(text.replace("--sync", ""))
                    evaled = await eval(`(async () => { ${text.replace("--sync", "")} })()`)
                }
                evaled = await eval(text)
                if (typeof evaled !== "string") evaled = require("util").inspect(evaled)
                await caf.sendMessage(m.from, { text: evaled }, { quoted: m })
            } catch (e) {
                await caf.sendMessage(m.from, { text: String(e) }, { quoted: m })
            }
        }

        if(m.text.startsWith('$')) {
            if(!isOwner) return global.mess("owner", m)
            let text = (m.text).slice(2);
            let { exec: execS } = require("child_process")
            if (!text) return m.reply(`No query code`)
            execS(text, async (err, stdout) => {
                if (err) return m.reply(err)
                if (stdout) return m.reply(stdout)
            })
        }

        if (cmd.isMedia && !isMedia) {
            return global.mess("media", m)
        }

        if (cmd.isOwner && !isOwner) {
			return global.mess("owner", m)
		}

        if (cmd.isGroup && !isGroup) {
            return global.mess("group", m)
        }

        if (cmd.isPrivate && isGroup) {
            return global.mess("private", m)
        }

        if (cmd.isBotAdmin && !isBotAdmin) {
            return global.mess("botAdmin", m)
        }

        if (cmd.isAdmin && !isAdmin) {
            return global.mess("admin", m)
        }

        if (cmd.isBot && m.fromMe) {
            return global.mess("bot", m)
        }

        if (cmd.disable == true && cmd.disable == false) {
            return global.mess("dead", m)
        }
        if (text.endsWith("--opt")) {
            let opt = "*｢ List Options ｣*\n\n"
            if(cmd.opt) {
                (cmd.opt).forEach(p => { opt +=`● ${p}\n`; });
            } else {
                opt +=`● Tidak ada Option Untuk Menu Ini`
            }
            return m.reply(opt);
        }
        if (cmd.desc && text.endsWith("--desc")) {
            return m.reply(`${cmd.desc.replace(/%prefix/gi, prefix).replace(/%command/gi, cmd.name).replace(/%text/gi, text)}`)
        }
        if (cmd.example && text.endsWith("--use")) {
            return m.reply(`${cmd.example.replace(/%prefix/gi, prefix).replace(/%command/gi, cmd.name).replace(/%text/gi, text)}`)
        }

        if (cmd.isQuery && !text) {
            return m.reply(`${cmd.example.replace(/%prefix/gi, prefix).replace(/%command/gi, cmd.name).replace(/%text/gi, text)}`)
        }

   

        try {
			if (cmd && m.text.startsWith(prefix)) {
                cmd.start(caf, m, {
                    name: 'CAF',
                    metadata,
                    pushName: pushname,
                    participants,
                    body,
                    args,
                    ar,
                    text,
                    quoted,
                    mime,
                    prefix,
                    command: cmd.name,
                    commands,
                    chatUpdate,
                    Function: Func,
                    monoscape: function setMonoscape(tex) { 
                        hasil = '`\`\`'+tex+'`\`\`'; 
                        return hasil; 
                    },
                    toUpper: function toUpper(query) {
                        return query.replace(/^\w/, c => c.toUpperCase())
                    }
                })
            }
		} catch (e) {
            e = String(e)
            if (!e.includes("cmd.start"))
			console.error(e);
		}
    } catch (e) {
        console.log(e)
    }
}
