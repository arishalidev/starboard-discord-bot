const Discord = require('discord.js');
const config = require("../../config.js");

module.exports = {
	name: 'sql',
    description: 'Acsess to the live database.',
    botPerms: [''],
    userPerms: [''],
    perms: 'owner',
	async execute(message, args, client, connection, prefix) {
        connection.query(``, (err, rows) => {
            if(err) {
                message.channel.send(`There was an error running this command! Check Logs for detailds`)
                return console.error(err)
            }

            return message.channel.send(`Sucsess. Query affected ${rows.length}`)
        });
	},
};