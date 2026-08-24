const Discord = require('discord.js');
const config = require("../../config.js");

module.exports = {
	name: 'msg',
    description: 'uwu',
    botPerms: [''],
	userPerms: [''],
	perms: 'owner',
	async execute(message, args, client, connection, prefix) {
        await message.delete()
        await message.channel.send(args.join(' '))
	},
};