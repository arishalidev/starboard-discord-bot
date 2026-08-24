const Discord = require('discord.js');
const config = require("../../config.js");

module.exports = {
	name: 'requiredstars',
    description: 'Required Stars Settings.',
    botPerms: [],
    userPerms: ['ADMINISTRATOR'],
    perms: 'admin',
	async execute(message, args, client, connection) {
        connection.query(`SELECT stars_to_starboard, stars_to_lose FROM Settings WHERE guild_id = ${message.guild.id}`, async (err, rows) => {

            const requiredStarsEmbed = new Discord.MessageEmbed()
            .setColor(config.embedColour)
            .setTitle(`Required Stars - sms`)
            .setDescription(`Required stars is the amount stars are required to get a message on the starboard`)
            .addField(`📋 Current Setting`, `\`${rows[0].stars_to_starboard}\``)
            .addField(`✏️ Edit`, `\`sms requiredStars (number)\``)
            .addField(`🛑 Conditions:`, `• Number must be **bigger than 1**\n• Number must be **smaller than 25**\n• Number must be **bigger than the amount of losing stars, \`${rows[0].stars_to_lose}\`** `)


            const newInt = parseInt(args[0])
            if (Number.isInteger(newInt)){
                if (newInt < 25 && newInt > rows[0].stars_to_lose){
                    connection.query(`UPDATE Settings
                    SET stars_to_starboard = ${newInt}
                    WHERE guild_id = ${message.guild.id}`)
                    return message.channel.send(`✅ Ok, set Required Stars to: \`${newInt}\``)
                }else{
                    return message.channel.send(requiredStarsEmbed)
                }
            }else{
                return message.channel.send(requiredStarsEmbed)
            }
        });
	},
};