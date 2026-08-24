const Discord = require('discord.js');
const config = require("../../config.js");

module.exports = {
	name: 'uwu',
    description: 'uwu',
    botPerms: [],
	userPerms: [],
    perms: 'public',
	async execute(message, args, client, connection) {
        return message.channel.send(`uwu`);
	},
};