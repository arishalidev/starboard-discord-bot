const Discord = require('discord.js');
const config = require("../../config.js");

module.exports = {
	name: 'smh',
    description: ':facepalm:',
    botPerms: [],
	userPerms: [],
    perms: 'public',
	async execute(message, args, client, connection) {
        return message.channel.send(`https://cdn.discordapp.com/emojis/683278890168221706.png?v=1`);
	},
};