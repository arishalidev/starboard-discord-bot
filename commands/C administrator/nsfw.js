const Discord = require('discord.js');
const config = require("../../config.js");

module.exports = {
	name: 'nsfw',
    description: 'Nsfw Settings.',
    botPerms: [],
    userPerms: ['ADMINISTRATOR'],
    perms: 'admin',
	async execute(message, args, client, connection) {
        connection.query(`SELECT nsfw FROM Settings WHERE guild_id = ${message.guild.id}`, async (err, rows) => {

            var nsfw_message = ``
            if (rows[0].nsfw == 0){
                nsfw_message = "off"
            }else{
                nsfw_message = "on"
            }

            const nsfwEmbed = new Discord.MessageEmbed()
            .setColor(config.embedColour)
            .setTitle(`Nsfw - sms`)
            .setDescription(`If messages from nsfw channels allowed on the starboard`)
            .addField(`📋 Current Setting`, `\`${nsfw_message}\``)
            .addField(`✏️ Edit`, `\`sms nsfw (on/off)\``)

            if (args[0] == 'on'){
                await connection.query(`UPDATE Settings
                SET nsfw = 1
                WHERE guild_id = ${message.guild.id}`)
                return message.channel.send(`✅ Ok, set nsfw to: \`on\``)
            }else if(args[0] == 'off'){
                await connection.query(`UPDATE Settings
                SET nsfw = 0
                WHERE guild_id = ${message.guild.id}`)
                return message.channel.send(`✅ Ok, set nsfw to: \`off\``)
            }else{
                return message.channel.send(nsfwEmbed)
            }
        });
	},
};