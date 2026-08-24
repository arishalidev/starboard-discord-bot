const Discord = require('discord.js');
const config = require("../../config.js");

module.exports = {
	name: 'clearboard',
    description: 'Clear Board for guild [TESTING ONLY].',
    botPerms: [''],
    userPerms: [''],
    perms: 'owner',
	async execute(message, args, client, connection, prefix) {
        connection.query(`DELETE FROM Boards WHERE guild_id=${message.guild.id}`, (err, rows) => {
            if(err) return message.channel.send(`Could not delete row for ${message.guild.name}, (${message.guild.id}) or there was none`)
            message.channel.send(`Deleted 'Boards' mysql table for **${message.guild.name}**`)
        });
	},
};