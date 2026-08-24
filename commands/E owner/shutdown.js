const Discord = require('discord.js');
const config = require("../../config.js");

module.exports = {
	name: 'shutdown',
    description: 'Shutdowns bot [ONLY IN EMERGENCIES].',
    botPerms: [''],
	userPerms: [''],
	perms: 'owner',
	async execute(message, args, client, connection, prefix) {
		await message.channel.send(`⛔ Shutting down bot`)
		process.exit(1)
	},
};