const {connection} = require('../sqlSettings.js')

module.exports = async (client, message) => {
    if(message.channel.type == "dm") return
    if(!message.guild || message.author.bot) return;
    connection.query(`SELECT nsfw, autoreact, custom_emoji, emoji_id, blacklisted_channels, blacklisted_members, blacklisted_roles FROM Settings WHERE guild_id = ${message.guild.id}`, async (err, rows) => {
        if(rows[0] == undefined) return
        if(!rows[0].autoreact) return;
        if (!rows[0].nsfw && message.channel.nsfw) return;


		//Blacklist
		const blRoles = rows[0].blacklisted_roles.split(',')
		const blMember = rows[0].blacklisted_members.split(',')
		const blChannels = rows[0].blacklisted_channels.split(',')

		if(blRoles != 'not_set' || blMember != 'not_set' || blChannels != 'not_set'){
			const rolesMap = message.member.roles.cache.map(u => u.id)
			var memberChannel = blMember.indexOf(message.author.id)
			var channelIndex = blChannels.indexOf(message.channel.id)
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

        var emote = ``
        if (rows[0].emoji_id == `null`){
            emote = rows[0].custom_emoji
        }else{
            emote = rows[0].emoji_id
        }

        if(message.content.search(/(https?:\/\/.*\.(?:png|jpg|webp|gif|tiff|mp3|ogg|mov|mp4))/i) === 0 || message.attachments.size > 0){
            message.react(emote)
        }
    });
};