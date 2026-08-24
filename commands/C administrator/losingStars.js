const Discord = require('discord.js');
const config = require("../../config.js");

module.exports = {
	name: 'losingstars',
    description: 'Losing Stars Settings.',
    botPerms: [],
    userPerms: ['ADMINISTRATOR'],
    perms: 'admin',
	async execute(message, args, client, connection) {
        connection.query(`SELECT stars_to_lose, stars_to_starboard FROM Settings WHERE guild_id = ${message.guild.id}`, async (err, rows) => {

            const losingStarsEmbed = new Discord.MessageEmbed()
            .setColor(config.embedColour)
            .setTitle(`Losing Stars - sms`)
            .setDescription(`The amount of star reactions needed for a starboard message to be removed. \n**Note:** Settings as \`0\` will **turn this setting off**`)
            .addField(`📋 Current Setting`, `\`${rows[0].stars_to_lose}\``)
            .addField(`✏️ Edit`, `\`sms losingStars (number)\``)
            .addField(`🛑 Conditions:`, `\n• Number must be **smaller than 25**\n• Number must be **smaller than the amount of required stars, \`${rows[0].stars_to_starboard}\`** `)


            const newInt = parseInt(args[0])
            if (Number.isInteger(newInt)){
                if (newInt >= 0 && newInt <= 24 && newInt < rows[0].stars_to_starboard){
                    await connection.query(`UPDATE Settings
                    SET stars_to_lose = ${newInt}
                    WHERE guild_id = ${message.guild.id}`)
                    return message.channel.send(`✅ Ok, set Losing Stars to: \`${newInt}\``)
                }else{
                    return message.channel.send(losingStarsEmbed)
                }
            }else{
                return message.channel.send(losingStarsEmbed)
            }
        });
	},
};