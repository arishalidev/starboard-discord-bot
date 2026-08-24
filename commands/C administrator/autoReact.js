const Discord = require('discord.js');
const config = require("../../config.js");

module.exports = {
	name: 'autoreact',
    description: 'Auto React Settings.',
    botPerms: [],
    userPerms: ['ADMINISTRATOR'],
    perms: 'admin',
	async execute(message, args, client, connection) {
        connection.query(`SELECT autoreact FROM Settings WHERE guild_id = ${message.guild.id}`, async (err, rows) => {

            var autoreact_message = ``
            if (rows[0].autoreact == 0){
                autoreact_message = "off"
            }else{
                autoreact_message = "on"
            }

            const autoReactEmbed = new Discord.MessageEmbed()
            .setColor(config.embedColour)
            .setTitle(`Auto React - sms`)
            .setDescription(`Autoreact reacts with your servers starboard emote to media files.\n[png, jpg, gif, webp, mp3, ogg, mp4, mov]`)
            .addField(`📋 Current Setting`, `\`${autoreact_message}\``)
            .addField(`✏️ Edit`, `\`sms autoreact (on/off)\``)

            if (args[0] == 'on'){
                await connection.query(`UPDATE Settings
                SET autoreact = 1
                WHERE guild_id = ${message.guild.id}`)
                return message.channel.send(`✅ Ok, set Autoreact to: \`on\``)
            }else if(args[0] == 'off'){
                await connection.query(`UPDATE Settings
                SET autoreact = 0
                WHERE guild_id = ${message.guild.id}`)
                return message.channel.send(`✅ Ok, set Autoreact to: \`off\``)
            }else{
                return message.channel.send(autoReactEmbed)
            }
        });
	},
};