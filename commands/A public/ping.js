const Discord = require('discord.js');
const config = require("../../config.js");

module.exports = {
	name: 'ping',
    description: 'Gets ping of user.',
    botPerms: [],
	userPerms: [],
    perms: 'public',
	async execute(message, args, client, connection) {
        message.channel.send("Pinging...").then(m =>{
            var ping = m.createdTimestamp - message.createdTimestamp;
            m.edit(`**:ping_pong: Pong! Your Ping Is:-** ${ping}ms`);
        });
	},
};