const Discord = require('discord.js');
const config = require("../../config.js");
const {addNewmodCD} = require('../../sqlSettings.js')

module.exports = {
	name: 'settings',
	description: 'See (but not set) starboard settings.',
	botPerms: [],
    userPerms: [],
    perms: 'public',
	async execute(message, args, client, connection, prefix, displayPrefix, timestamp) {
        connection.query(`SELECT * FROM Settings WHERE guild_id = ${message.guild.id}`, async (err, rows) => {

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

                const settingsembed = new Discord.MessageEmbed()
                .setColor(config.embedColour)
                .setTitle('Starboard Settings')
                .setDescription(`
                **[Need help? Join our support server!](https://discord.gg/zm7gMwk)**

**Starboard Channel**
Current Settings : ${starboard_channel_message}
To change, use: \`sms starboard\`

**Blacklist**
Current Settings : ${fullList}
To change, use: \`sms blacklist\`

**Reaction Emote**
Current Settings : ${emoji_var}
To change the emote, use: \`sms emote\`

**Required Stars**
Current Settings : \`${rows[0].stars_to_starboard}\`
To change the amount, use: \`sms requiredStars\`

**Losing Stars**
Current Settings : \`${rows[0].stars_to_lose}\`
To change the amount, use: \`sms losingStars\`

**Nsfw Channels**
Current Settings : \`${nsfw_message}\`
To change, use: \`sms nsfw\`

**Auto React**
Current Settings : \`${autoreact_message}\`
To change, use: \`sms autoReact\``)
                .setThumbnail(client.user.displayAvatarURL({dynamic: true}))

                return message.channel.send(settingsembed);
        });
    },
};