const Discord = require('discord.js');
const config = require("../../config.js");

module.exports = {
	name: 'leaderboard',
    description: 'Most stared members',
    botPerms: [],
	userPerms: [],
    perms: 'public',
	async execute(message, args, client, connection) {
		var leaderboard = ``
		var reaction_counts = []
		var knownIDs = []
		connection.query(`SELECT author_id, reactions_count FROM Boards WHERE guild_id = ${message.guild.id}`, async (err, rows) => {
			for (var i = 0; rows.length > i; i++) {
				if(knownIDs.includes(rows[i].author_id)){
					idIndex = knownIDs.indexOf(rows[i].author_id)
					reaction_counts[idIndex] = parseInt(reaction_counts[idIndex]) + parseInt(rows[i].reactions_count)
					continue;
				}
				reaction_counts.push(parseInt(rows[i].reactions_count))
				knownIDs.push(rows[i].author_id)
			}
			var result = {}
			knownIDs.forEach((knownIDs, i) => result[knownIDs] = reaction_counts[i]);
			const sortedLeaderboard = Object.fromEntries(
				Object.entries(result).sort(([,a],[,b]) => b-a)
			);

			connection.query(`SELECT custom_emoji, emoji_id FROM Settings WHERE guild_id = ${message.guild.id}`, async (err, settingRows) => {

				var emoji_var = ``
				if(settingRows[0].emoji_id == "null"){
					emoji_var = settingRows[0].custom_emoji
				}else{
					emoji_var = `<:${settingRows[0].custom_emoji}:${settingRows[0].emoji_id}>`
				}

				for(var i = 0; 5 > i; i++){
					if(Object.keys(sortedLeaderboard)[i] == undefined) break;
					leaderboard = leaderboard + ` ${i + 1}. **${Object.values(sortedLeaderboard)[i]}** ${emoji_var} - <@${Object.keys(sortedLeaderboard)[i]}>\n\n`;
				}
				if(leaderboard == ``){
					leaderboard = "**🙃 Nothing Yet!** Get a message on the starboard, then check back."
				}
				const leadboardEmbed = new Discord.MessageEmbed()
				.setColor(config.embedColour)
				.setThumbnail(client.user.displayAvatarURL({dynamic: true}))
				.setDescription(`
The top 5 people with the most star reactions in this server:
		
${leaderboard}`)
				.setTitle(`${message.guild.name}'s Starboard Leaderboard`)
				return await message.channel.send(leadboardEmbed);		

			});
		});
	},
};