const Discord = require('discord.js');
const config = require("../../config.js");

module.exports = {
	name: 'joinvc',
    description: 'see name for details',
    botPerms: [''],
	userPerms: [''],
	perms: 'owner',
	async execute(message, args, client, connection, prefix) {
        if (message.member.voice.channel) {
            return await message.member.voice.channel.join();
        }else{
            return await message.channel.send('uh..');
        }
	},
};