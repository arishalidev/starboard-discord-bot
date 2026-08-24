const Discord = require('discord.js');
const config = require("../../config.js");

module.exports = {
	name: 'stats',
    description: 'Gets stats of the bot.',
    botPerms: [''],
	userPerms: [''],
	perms: 'owner',
	async execute(message, args, client, connection, prefix) {
		await message.channel.send(`⛔ uh`)
	},
};