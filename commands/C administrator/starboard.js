const Discord = require('discord.js');
const config = require("../../config.js");

module.exports = {
	name: 'starboard',
    description: 'Starboard Settings',
    botPerms: [],
    userPerms: ['ADMINISTRATOR'],
    perms: 'admin',
	async execute(message, args, client, connection) {
        connection.query(`SELECT starboard_channel FROM Settings WHERE guild_id = ${message.guild.id}`, async (err, rows) => {

            var starboard_channel_message = ``
            var starboardChannel = await message.guild.channels.cache.find(ch => ch.id === rows[0].starboard_channel);
            if (starboardChannel == undefined) { 
                starboard_channel_message = "`none`"
                connection.query(`UPDATE Settings SET starboard_channel = "not_set" WHERE guild_id = ${message.guild.id};`);
            }else{
                if (rows[0].starboard_channel == "not_set"){
                    starboard_channel_message = "`none`"
                }else{
                    starboard_channel_message = `<#${rows[0].starboard_channel}>`
                }
            }

            const starboardEmbed = new Discord.MessageEmbed()
            .setColor(config.embedColour)
            .setTitle(`Starboard Channel - sms`)
            .setDescription(`Your starboard channel where messages with enough reactions are sent.`)
            .addField(`📋 Current Setting`, `${starboard_channel_message}`)
            .addField(`✏️ Edit`, `\`sms starboard (#channel)\``)


            const newChannel = message.mentions.channels.first()
            const clientPerms = message.member.guild.me
            if (newChannel){
                if(!clientPerms.permissionsIn(newChannel).has('VIEW_CHANNEL')){ 
                    return message.channel.send(`❌ I cant read messages in that channel!`); 
                }
                if(!clientPerms.permissionsIn(newChannel).has('SEND_MESSAGES')){
                    return message.channel.send(`❌ I cant send messages in that channel!`);
                }
                if(!clientPerms.permissionsIn(newChannel).has('EMBED_LINKS')){
                    return message.channel.send(`❌ I cant send embeds in that channel!`);
                }

                await connection.query(`UPDATE Settings
                SET starboard_channel = ${newChannel.id}
                WHERE guild_id = ${message.guild.id}`)
                return message.channel.send(`✅ Ok, set your starboard channel to ${newChannel}`)
            }else{
                return message.channel.send(starboardEmbed)
            }
        });
	},
};
