const {connection, createBoard} = require('../sqlSettings.js')
const Discord = require('discord.js');
const config = require("../config.js");

module.exports = async (client, reaction, user) => {
    if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message: ', error);
			return;
		}
	}
    if(reaction.message.channel.type == "dm") return;

	connection.query(`SELECT * FROM Settings WHERE guild_id = ${reaction.message.guild.id}`, async (err, rows) => {
		if(err) {
			console.error(err)
			return
		}
		var starID = rows[0].starboard_channel

		var starboardChannel = await reaction.message.guild.channels.cache.find(ch => ch.id === starID);

		//Filter out non related reactions
		if (rows[0].custom_emoji != reaction.emoji.name) return;		
		if (rows[0].stars_to_starboard > reaction.count) return;
		if (starID == 'not_set') return;
		if (!client.channels.cache.has(starID)) { 
			connection.query(`UPDATE Settings SET starboard_channel = "not_set" WHERE guild_id = ${reaction.message.guild.id};`);
			return;
		 }

		//Other, more specific filtering
		if (!rows[0].nsfw && reaction.message.channel.nsfw) return;

		console.log(reaction.message)
		//Blacklist
		const blRoles = rows[0].blacklisted_roles.split(',')
		const blMember = rows[0].blacklisted_members.split(',')
		const blChannels = rows[0].blacklisted_channels.split(',')

		if(blRoles != 'not_set' || blMember != 'not_set' || blChannels != 'not_set'){
			const rolesMap = reaction.message.member.roles.cache.map(u => u.id)
			var memberChannel = blMember.indexOf(reaction.message.author.id)
			var channelIndex = blChannels.indexOf(reaction.message.channel.id)
			if(memberChannel > -1){
				return;
			}

			if(blRoles != 'not_set' && rolesMap[0]){
				for (i = 0; i < rolesMap.length; i++) {
					for (br = 0; br < rolesMap.length; br++) {
						if(rolesMap[i] == rolesMap[br]){
							return;
						}
					}
				}
			}

			if(channelIndex > -1){
				return;
			}
		}
		

		const clientPerms = reaction.message.member.guild.me
		if(!clientPerms.permissionsIn(starboardChannel).has('SEND_MESSAGES')){return; }
		if(!clientPerms.permissionsIn(starboardChannel).has('VIEW_CHANNEL')){ return; }
		if(!clientPerms.permissionsIn(starboardChannel).has('EMBED_LINKS')){ return; }
		
		connection.query(`SELECT EXISTS(SELECT * FROM Boards WHERE message_id = '${reaction.message.id}')`, async (err, boardExist) => {
			if(err) {
				console.error(err)
				return
			}

			var messageContent = reaction.message.content || '\u200B'
			var messageImage = ''
			var vid = ''

			if(reaction.message.content.search(/(https?:\/\/.*\.(?:png|jpg|gif|webp))/i) === 0){
				var range = [reaction.message.content.search(/(https?:\/\/.*\.(?:png|jpg|gif|webp))/i), reaction.message.content.search(/(?:png|jpg|gif|webp)/i)]
				var starImageURL = reaction.message.content.slice(range[0], range[1] + 3)
				messageImage = new Discord.MessageAttachment(starImageURL)
			}

			if(reaction.message.attachments.size > 0){
				const att = new Discord.MessageAttachment(reaction.message.attachments.first());
				
				if (att.attachment.url.search(/(https?:\/\/.*\.(?:png|jpg|gif|webp))/i) === 0){
					messageImage = new Discord.MessageAttachment(att.attachment.url)
				}else if(att.attachment.url.search(/(https?:\/\/.*\.(?:mp4|mov|mp3|ogg))/i) === 0){
					vid = `[${att.attachment.name}](${att.attachment.url})`
				}
			}

			emoji_var = ``
			if(rows[0].emoji_id == "null"){
				emoji_var = rows[0].custom_emoji
			}else{
				emoji_var = `<:${rows[0].custom_emoji}:${rows[0].emoji_id}>`
			}

			if(!messageContent && message.system){
				
			}

			const starembed = new Discord.MessageEmbed()
			.setColor(config.embedColour)
			.setThumbnail(reaction.message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp()
			.addFields(
				{ name: '**Author:**', value: `<@${reaction.message.author.id}>`, inline: true},
				{ name: '**Channel:**', value: `<#${reaction.message.channel.id}>`, inline: true },
				{ name: '**Reactions:**', value: `${emoji_var} ${reaction.count}`},
				{ name: '**Original message:**', value: `[Jump to message](https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id})`},       
				{ name: '**Content:**', value: `${messageContent}${vid}`}
			)
			.setImage(messageImage.attachment)
			
			//If there is no starboard message yet
			const val = Object.values(await boardExist[0]);
			if(!val[0]){
				console.log(`Starboard message added: ${reaction.message.id}`)
				await starboardChannel.send(starembed).then(m => {
					createBoard(reaction.message.guild.id, reaction.message.author.id, reaction.message.channel.id, reaction.message.id, m.id, reaction.count, reaction.message.url, 0);
				}).catch(e => { console.error(e) })
				return;
			}

			//If the message is on the starboard already
			connection.query(`SELECT * FROM Boards WHERE message_id = ${reaction.message.id}`, async (err, boardRows) => {
				if(boardRows[0] == undefined) return;
				boardStarboard = await boardRows[0].channel_id
				if (!client.channels.cache.has(boardStarboard)) { return; }

				var boardID = await boardRows[0].starboard_message_id
				var newStarCh = await starboardChannel.messages.fetch(boardID)
				.catch(e => { return; });

				if(newStarCh == undefined){
					connection.query(`DELETE FROM Boards WHERE message_id = ${reaction.message.id}`)
					return;
				}

				console.log(`Reaction added: ${reaction.message.id}`)
				await newStarCh.edit(starembed).then(m => {
                    connection.query(`UPDATE Boards
                    SET reactions_count = ${reaction.count}
					WHERE message_id = ${reaction.message.id}`)
				}).catch(e => { console.error(e) })
			});
		});
	});
};                                                                                     