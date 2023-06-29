const fs = require('fs')
const Jimp = require('jimp');

module.exports = {
	name: "setpp",
	alias: ["pp"],
    use: "<reply>",
    opt: ["--original"],
	desc: "Change Bot Photo Profile",
    type: "owner",
    example: "%prefix%command",
    noLimit: true,
    start: async(caf, m, { mime, quoted, text, prefix, command }) => {
        if (/image/.test(mime)) {
            let media = await caf.downloadAndSaveMediaMessage(quoted)
            if (text.toLowerCase().endsWith === "--original") {
                var { img } = await generateProfilePicture(media)
                await caf.query({
                    tag: 'iq',
                    attrs: {
                        to: caf.botNumber,
                        type:'set',
                        xmlns: 'w:profile:picture'
                    },
                    content: [{
                        tag: 'picture',
                        attrs: { type: 'image' },
                        content: img
                    }]
                })
                fs.unlinkSync(media)
            } else {
                await caf.updateProfilePicture(m.from, { url: media })
                .then( res => {
                    m.reply("Sukses")
                    fs.unlinkSync(media)
                }).catch(() => m.reply('err'))
            }
        } else {
            return m.reply(`Reply to Supported media With Caption ${prefix + command}\n\n_default : ${prefix + command} --media reply_\n_Original Ratio : ${prefix + command} --media reply original_`)
        }
	},
    isOwner: true
}

async function generateProfilePicture(buffer) {
    const jimp = await Jimp.read(buffer)
    const min = jimp.getWidth()
    const max = jimp.getHeight()
    const cropped = jimp.crop(0, 0, min, max)
    return {
        img: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG),
        preview: await cropped.normalize().getBufferAsync(Jimp.MIME_JPEG)
    }
}