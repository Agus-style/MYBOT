module.exports = {
	name: "promote",
	alias: ["pm"],
    use: "<tag>",
	desc: "Promote Member To Admin",
	type: "group",
	start: async(caf, m, { text, prefix, command }) => {
        if (!text) return m.reply(`Example: ${prefix + command} @tag`)
		let me = m.quoted ? [m.quoted.sender] : m.mentions
		for (let i of me) await caf.groupParticipantsUpdate(m.from, [i], "promote")
		await m.reply("Suksess")
	},
    isGroup: true,
    isAdmin: true,
	isBotAdmin: true,
}