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
		if (starID == 'not_set') return;
		if (!client.channels.cache.has(starID)) { 
			connection.query(`INSERT INTO Settings ( starboard_channel ) VALUES ( "not_set" )`);
			return;
		 }

		//Other, more specific filtering
		if (!rows[0].nsfw && reaction.message.channel.nsfw) return;

		const clientPerms = reaction.message.member.guild.me
		if(!clientPerms.permissionsIn(starboardChannel).has('SEND_MESSAGES')){return; }
		if(!clientPerms.permissionsIn(starboardChannel).has('VIEW_CHANNEL')){ return; }
		if(!clientPerms.permissionsIn(starboardChannel).has('EMBED_LINKS')){ return; }

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
			emoji_var = await rows[0].custom_emoji
		}else{
			emoji_var = `<:${await rows[0].custom_emoji}:${await rows[0].emoji_id}>`
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

			if (reaction.count <= rows[0].stars_to_lose && rows[0].stars_to_lose != 0){
				await newStarCh.delete()
				connection.query(`DELETE FROM Boards WHERE message_id = ${reaction.message.id}`)
				return;
			}

			console.log(`Reaction removed: ${reaction.message.id}`)
			await newStarCh.edit(starembed).then(m => {
				connection.query(`UPDATE Boards
				SET reactions_count = ${reaction.count}
				WHERE message_id = ${reaction.message.id}`)
			}).catch(e => { console.error(e) })
		});
	});
};                                                                                     