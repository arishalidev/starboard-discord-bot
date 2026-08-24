const Discord = require('discord.js');
const config = require("../../config.js");

module.exports = {
	name: 'top',
    description: 'Top stared message in a guild.',
    botPerms: [],
	userPerms: [],
    perms: 'public',
	async execute(message, args, client, connection) {
		var topID = ``
		var reaction_counts = []
		var message_links  = []
		connection.query(`SELECT message_link, reactions_count FROM Boards WHERE guild_id = ${message.guild.id}`, async (err, rows) => {
			for (var i = 0; rows.length > i; i++) {
				if(message_links.includes(rows[i].message_link)){
					idIndex = message_links.indexOf(rows[i].message_link)
					reaction_counts[idIndex] = parseInt(reaction_counts[idIndex]) + parseInt(rows[i].reactions_count)
					continue;
				}
				reaction_counts.push(parseInt(rows[i].reactions_count))
				message_links.push(rows[i].message_link)
			}
			var result = {}
			message_links.forEach((message_links, i) => result[message_links] = reaction_counts[i]);
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

				for(var i = 0; 1 > i; i++){
					if(Object.keys(sortedLeaderboard)[i] == undefined) break;
					topID =  `${Object.keys(sortedLeaderboard)[i]}`;
				}
				var messageTop
				if(topID == ``){
					messageTop = "**🙃 Nothing Yet!** Get a message on the starboard, then check back."
				}else{
					messageTop = `[Click Here!](${topID})`
				}
				const topEmbed = new Discord.MessageEmbed()
				.setColor(config.embedColour)
				.setThumbnail(client.user.displayAvatarURL({dynamic: true}))
				.setDescription(`Jump to the **most stared message in this server**:

${messageTop}`)
				.setTitle(`${message.guild.name}'s Most Stared Message`)
				return await message.channel.send(topEmbed);		

			});
		});
	},
};
