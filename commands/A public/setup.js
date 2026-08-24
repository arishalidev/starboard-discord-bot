const Discord = require('discord.js');
const config = require("../../config.js");

module.exports = {
	name: 'setup',
    description: 'Setup command.',
    botPerms: [],
	userPerms: [],
    perms: 'public',
	async execute(message, args, client, connection) {
        message.channel.send('👋 Hello! To setup, use \`sms settings\`, to view, and adjust the settings to your liking.')
	},
};
