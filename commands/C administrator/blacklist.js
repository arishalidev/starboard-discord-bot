const Discord = require('discord.js');
const config = require("../../config.js");

module.exports = {
	name: 'blacklist',
    description: 'Blacklist Settings.',
    botPerms: [],
    userPerms: ['ADMINISTRATOR'],
    perms: 'admin',
	async execute(message, args, client, connection) {
        connection.query(`SELECT blacklisted_channels, blacklisted_members, blacklisted_roles FROM Settings WHERE guild_id = ${message.guild.id}`, async (err, rows) => {

            const menRole = message.mentions.roles.first();
            const menMember = message.mentions.members.first();
            const menChannel = message.mentions.channels.first();

            const currentRoles = rows[0].blacklisted_roles.split(',')
            const currentMember = rows[0].blacklisted_members.split(',')
            const currentChannel = rows[0].blacklisted_channels.split(',')

            var showRole = ``
            var showMember = ``
            var showChannel = ``

            if(rows[0].blacklisted_roles == 'not_set'){
                showRole = '\`none\`'
            }else{
                showRole = currentRoles.map(id => `<@&${id}>`)
            }

            if(rows[0].blacklisted_channels == 'not_set'){
                showChannel = '\`none\`'
            }else{
                showChannel = currentChannel.map(id => `<#${id}>`)
            }

            if(rows[0].blacklisted_members == 'not_set'){
                showMember = '\`none\`'
            }else{
                showMember = currentMember.map(id => `<@${id}>`)
            }

            const blacklistEmbed = new Discord.MessageEmbed()
            .setColor(config.embedColour)
            .setTitle(`Blacklist - sms`)
            .setDescription(`Blacklist removes unwanted people/channels/roles from the starboard.`)
            .addField(`📋 Current Setting`, `**Members**: ${showMember}\n**Channels**: ${showChannel}\n**Roles**: ${showRole}`)
            .addField(`✏️ Edit`, `\`sms blacklist (add/remove) (member/channel/role)\`\n\`sms blacklist clear (members/channels/roles/all)\``);

            if(args[0] == 'clear'){
                if(args[1] == 'members'){
                    await connection.query(`UPDATE Settings
                    SET blacklisted_members = 'not_set'
                    WHERE guild_id = ${message.guild.id}`);
                    return message.channel.send(`✅ Ok, cleared members in the blacklist.`);
                }
                if(args[1] == 'channels'){
                    await connection.query(`UPDATE Settings
                    SET blacklisted_channels = 'not_set'
                    WHERE guild_id = ${message.guild.id}`);
                    return message.channel.send(`✅ Ok, cleared channels in the blacklist.`);
                }
                if(args[1] == 'roles'){
                    await connection.query(`UPDATE Settings
                    SET blacklisted_roles = 'not_set'
                    WHERE guild_id = ${message.guild.id}`)
                    return message.channel.send(`✅ Ok, cleared roles in the blacklist.`);
                }
                console.log(1)
                if(args[1] == 'all'){
                    await connection.query(`UPDATE Settings
                    SET blacklisted_channels = 'not_set'
                    WHERE guild_id = ${message.guild.id}`)
    
                    await connection.query(`UPDATE Settings
                    SET blacklisted_members = 'not_set'
                    WHERE guild_id = ${message.guild.id}`)
    
                    await connection.query(`UPDATE Settings
                    SET blacklisted_roles = 'not_set'
                    WHERE guild_id = ${message.guild.id}`)
                    return message.channel.send(`✅ Ok, cleared the blacklist.`)
                }
            }

            if(!menRole && !menMember && !menChannel){ return message.channel.send(blacklistEmbed); };
            if(args[0] == 'remove'){
                if(args[1] == 'all'){
                    await connection.query(`UPDATE Settings
                    SET blacklisted_channels = 'not_set'
                    WHERE guild_id = ${message.guild.id}`)
    
                    await connection.query(`UPDATE Settings
                    SET blacklisted_members = 'not_set'
                    WHERE guild_id = ${message.guild.id}`)
    
                    await connection.query(`UPDATE Settings
                    SET blacklisted_roles = 'not_set'
                    WHERE guild_id = ${message.guild.id}`)
                    return message.channel.send(`✅ Ok, Cleared the blacklist.`)
                }
                if(menRole){
                    var roleIndex = currentRoles.indexOf(menRole.id)
                    if(roleIndex <= -1){
                        return message.channel.send(`❌ Role not blacklisted!`)
                    }else{
                        inputRole = currentRoles;
                        inputRole.splice(roleIndex, 1)
                        if(!inputRole[0]){
                            inputRole = 'not_set'
                        }
                        await connection.query(`UPDATE Settings
                        SET blacklisted_roles = '${inputRole}'
                        WHERE guild_id = ${message.guild.id}`)
                        return message.channel.send(`✅ Ok, removed role ${menRole} from the blacklist.`)
                    }
                }
                if(menMember){
                    var memberIndex = currentMember.indexOf(menMember.id)
                    if(memberIndex <= -1){
                        return message.channel.send(`❌ User not blacklisted!`)
                    }else{
                        inputMember = currentMember;
                        inputMember.splice(memberIndex, 1)
                        if(!inputMember[0]){
                            inputMember = 'not_set'
                        }
                        await connection.query(`UPDATE Settings
                        SET blacklisted_members = '${inputMember}'
                        WHERE guild_id = ${message.guild.id}`)
                        return message.channel.send(`✅ Ok, removed user ${menMember} from the blacklist.`)
                    }
                }
                if(currentChannel){
                    var channelIndex = currentChannel.indexOf(menChannel.id)
                    if(channelIndex <= -1){
                        return message.channel.send(`❌ User not blacklisted!`)
                    }else{
                        inputChannel = currentChannel;
                        inputChannel.splice(channelIndex, 1)
                        if(!inputChannel[0]){
                            inputChannel = 'not_set'
                        }
                        await connection.query(`UPDATE Settings
                        SET blacklisted_channels = '${inputChannel}'
                        WHERE guild_id = ${message.guild.id}`)
                        return message.channel.send(`✅ Ok, removed user ${menChannel} from the blacklist.`)
                    }
                }
            }

            if(args[0] == 'add' || args[0].startsWith('<') ){
                if(menRole){
                    var roleIndex = currentRoles.indexOf(menRole.id)
                    if(roleIndex > -1){
                        return message.channel.send(`✅ Ok, added blacklisted role ${menRole}.`)
                    }
                    if(rows[0].blacklisted_roles == 'not_set'){
                            await connection.query(`UPDATE Settings
                            SET blacklisted_roles = ${menRole.id}
                            WHERE guild_id = ${message.guild.id}`)
                        }else{
                            await connection.query(`UPDATE Settings
                            SET blacklisted_roles = '${menRole.id},${rows[0].blacklisted_roles}'
                            WHERE guild_id = ${message.guild.id}`)   
                        }
                    return message.channel.send(`✅ Ok, added blacklisted role ${menRole}.`);
                }
    
                if(menMember){
                    var memberIndex = currentMember.indexOf(menMember.id)
                    if(menMember.id == '759913252133797888'){
                        return message.channel.send('Hmmmm...')
                    }
                    if(memberIndex > -1){
                       return message.channel.send(`✅ Ok, added blacklisted user ${menMember}.`)
                    }
                    console.log(menMember.id)
                    if(rows[0].blacklisted_members == 'not_set'){
                           await connection.query(`UPDATE Settings
                           SET blacklisted_members = ${menMember.id}
                           WHERE guild_id = ${message.guild.id}`)
                       }else{
                           await connection.query(`UPDATE Settings
                           SET blacklisted_members = '${menMember.id},${rows[0].blacklisted_members}'
                           WHERE guild_id = ${message.guild.id}`)   
                       }
                   return message.channel.send(`✅ Ok, added blacklisted user ${menMember}.`);
                }
    
                if(menChannel){
                    var channelIndex = currentChannel.indexOf(menChannel.id)
                    if(channelIndex > -1){
                        return message.channel.send(`✅ Ok, added blacklisted channel ${menChannel}.`)
                    }
                    if(rows[0].blacklisted_channels == 'not_set'){
                        await connection.query(`UPDATE Settings
                        SET blacklisted_channels = ${menChannel.id}
                        WHERE guild_id = ${message.guild.id}`)
                    }else{
                        await connection.query(`UPDATE Settings
                        SET blacklisted_channels = '${menChannel.id},${rows[0].blacklisted_channels}'
                        WHERE guild_id = ${message.guild.id}`)   
                    }
                    return message.channel.send(`✅ Ok, added blacklisted channel ${menChannel}.`);
                }   
            }
        });
	},
};