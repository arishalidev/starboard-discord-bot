const Discord = require('discord.js');
const config = require("../../config.js");

module.exports = {
	name: 'help',
    description: 'Gets list of commands.',
    botPerms: [],
    userPerms: [],
    perms: 'public',
	async execute(message, args, client, connection) {
        connection.query(`SELECT * FROM Settings WHERE guild_id = ${message.guild.id}`, async (err, rows) => {
            if(err) {
                log.error(err)
                return
            }

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
            
            var autoreact_message = ``
            if (rows[0].autoreact == 1){
                autoreact_message = "on"
            }else{
                autoreact_message = `off`
            }

            var emoji_var = ``
            if(rows[0].emoji_id == "null"){
                emoji_var = rows[0].custom_emoji
            }else{
                emoji_var = `<:${rows[0].custom_emoji}:${rows[0].emoji_id}>`
            }

            var nsfw_message = ``
            if (rows[0].nsfw == 1){
                nsfw_message = "on"
            }else{
                nsfw_message = `off`
            }
            var currentRoles = rows[0].blacklisted_roles.split(',').map(r => `<@&${r}>`);
            var currentMember = rows[0].blacklisted_members.split(',').map(r => `<@${r}>`);
            var currentChannel = rows[0].blacklisted_channels.split(',').map(r => `<#${r}>`);

            if(currentRoles == `<@&not_set>`){currentRoles = []}
            if(currentMember == `<@not_set>`){currentMember = []}
            if(currentChannel == `<#not_set>`){currentChannel = []}

            var fullList = currentRoles.concat(currentMember, currentChannel)
            if(!fullList[0]) {fullList = `\`none\``}
            const helpembed = new Discord.MessageEmbed()
            .setColor(config.embedColour)
            .setTitle('Starboard Help')
            .setDescription(`
Sms is a highly customisable bot that helps you archive the best memes and funniest messages on your server!
**[Need help? Join our support server!](https://discord.gg/zm7gMwk)**

__** Commands **__
\`sms settings\` [Edit settings of the bot]
\`sms leaderboard\` [view members with the most stars]
\`sms top\` [view most stared messages in a server]
\`sms invite\` [invite the bot to your server]
\`sms credits\` [credits for the bot]`)
            .setThumbnail(client.user.displayAvatarURL({dynamic: true}))
            .addFields(
                {name: "Prefix:" , value: "`sms`", inline: true},
                {name: "Website:", value: "[Click Here](https://sms-3.gitbook.io/sms/)", inline: true},
                {name: "Starboard Channel:", value: `${starboard_channel_message}`, inline: true},
                {name: "__Current settings:__", value:
`Blacklist: ${fullList}
Emoji: ${emoji_var}
Required Stars: \`${rows[0].stars_to_starboard}\`
Losing Stars: \`${rows[0].stars_to_lose}\`
Nsfw Channels: \`${nsfw_message}\`
Autoreact: \`${autoreact_message}\``}
            )
            .setFooter(`To edit the settings of the bot, use: sms settings`)
            return message.channel.send(helpembed);
        });   
	},
};
