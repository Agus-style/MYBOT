module.exports = {
	name: "demote",
	alias: ["dm"],
    use: "<tag>",
	desc: "Promote Member To Admin",
	type: "group",
	start: async(caf, m, { text, prefix, command }) => {
        if (!text) return m.reply(`Example: ${prefix + command} @tag`)
		let me = m.quoted ? [m.quoted.sender] : m.mentions
		for (let i of me) await caf.groupParticipantsUpdate(m.from, [i], "demote")
		await m.reply("Suksess")
	},
    isGroup: true,
    isAdmin: true,
	isBotAdmin: true,
}