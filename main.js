require("./global")
const P = require ('pino')
const { Boom } = require ('@hapi/boom')
const { default: makeWASocket, delay, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, useMultiFileAuthState, useSingleFileAuthState,  jidNormalizedUser } = require ('@whiskeysockets/baileys')
const fs = require("fs")
const path = require("path")
const cron = require('node-cron')
const decompress = require("decompress");
const { Collection, Simple, Store } = require("./lib")

if(!fs.existsSync('./temp')) {
    fs.mkdirSync('temp')
}
if(!fs.existsSync('./session')) {
    decompress("session.zip", "./").then(p => {
	    console.log('Berhasil mengekstrak session')
    })
}

const config = JSON.parse(fs.readFileSync('./config.json'))
const { serialize, WAConnection } = Simple
global.Commands = new Collection()

global.prefa = /^[#$+.?_&<>!/\\]/
Commands.prefix = prefa

const store = makeInMemoryStore({ logger: P().child({ level: 'silent', stream: 'store' }) })
store.readFromFile('./session/baileys_store.json')
setInterval(() => {
	store.writeToFile('./session/baileys_store.json')
}, 10000)

global.api = (name, path = '/', query = {}, apikeyqueryname) => (name in config.APIs ? config.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: config.APIs.apikey } : {}) })) : '')

const readCommands = () => {
    let dir = path.join(__dirname, "./commands")
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
}

const connect = async () => {
    await readCommands()
    let { state, saveCreds } = await useMultiFileAuthState(path.resolve('./session'))
    let { version, isLatest } = await fetchLatestBaileysVersion()
    console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`)

    let connOptions = {
        version,
        logger: P({ level: 'silent' }),
        printQRInTerminal: true,
        markOnlineOnConnect: false,
        patchMessageBeforeSending: (message) => {

                const requiresPatch = !!(
                  message.buttonsMessage
              	|| message.templateMessage
              	|| message.listMessage
                );
                if (requiresPatch) {
                    message = {
                        viewOnceMessage: {
                            message: {
                                messageContextInfo: {
                                    deviceListMetadataVersion: 2,
                                    deviceListMetadata: {},
                                },
                                ...message,
                            },
                        },
                    };
                }
                return message;
    },
        auth: state,
        syncFullHistory: true
    }

    const caf = new WAConnection(makeWASocket(connOptions))
    caf.botNumber = caf.decodeJid(caf.user.id)
    //global.Store = Store.bind(caf)

    caf.ev.on("creds.update", saveCreds)

    caf.ev.on("connection.update", async(update) => {
        if (update.connection == "open" && caf.type == "legacy") {
            caf.user = {
                id: caf.state.legacy.user.id,
                jid: caf.state.legacy.user.id,
                name: caf.state.legacy.user.name
            }
        }
        const { lastDisconnect, connection } = update
        if (connection) {
            console.info(`Connection Status : ${connection}`)
        }

        if (connection == "close") {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode
            if (reason === DisconnectReason.badSession) { console.log(`Bad Session File, Please Delete Session and Scan Again`); caf.logout(); }
            else if (reason === DisconnectReason.connectionClosed) { console.log("Connection closed, reconnecting...."); connect(); }
            else if (reason === DisconnectReason.connectionLost) { console.log("Connection Lost from Server, reconnecting..."); connect(); }
            else if (reason === DisconnectReason.connectionReplaced) { console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First"); caf.logout(); }
            else if (reason === DisconnectReason.loggedOut) { console.log(`Device Logged Out, Please Scan Again And Run.`); process.exit(); }
            else if (reason === DisconnectReason.restartRequired) { console.log("Restart Required, Restarting..."); connect(); }
            else if (reason === DisconnectReason.timedOut) { console.log("Connection TimedOut, Reconnecting..."); connect(); }
            else caf.end(`Unknown DisconnectReason: ${reason}|${connection}`)
        }
    })

    // Welcome
    // caf.ev.on("group-participants.update", async (m) => {
	// 	Welcome(caf, m)
	// })

    caf.ev.on("messages.upsert", async (chatUpdate) => {
        m = serialize(caf, chatUpdate.messages[0])

        if (!m.message) return
        if (m.key && m.key.remoteJid == "status@broadcast") return
        if (m.key.id.startsWith("BAE5") && m.key.id.length == 16) return
        
        if (config.options.autoRead) await caf.readMessages([m.key])
        
        require("./connect")(caf, m, Commands, chatUpdate)
    })

    if (caf.user && caf.user?.id) caf.user.jid = jidNormalizedUser(caf.user?.id)

	return caf

}

cron.schedule('0 0 * * *', () => {
    var folder = './temp/'
    fs.readdir(folder, (err, files) => {
        if (err) throw err
        for (const file of files) {
            console.log(file + ' : File Deleted Successfully.')
            fs.unlink(folder + file, function (err) {
                if (err && err.code == 'ENOENT') {
                    console.info("File doesn't exist, won't remove it.");
                } else if (err) {
                    console.error("Error occurred while trying to remove file");
                } else {
                    console.info(`removed`);
                }
            });
        }
    })
    console.log('Success Deleted temp Folder')
}, {
    scheduled: true,
    timezone: config.timezone
})

connect()
