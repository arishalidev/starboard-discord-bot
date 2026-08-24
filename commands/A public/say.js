const Discord = require('discord.js');
const config = require("../../config.js");
const DBL = require("dblapi.js");
const {topggkey} = require('../../tokenAndKeys/apiKeys.js');

module.exports = {
	name: 'say',
    description: 'Public say command.',
    botPerms: [''],
	userPerms: [''],
	perms: 'public',
	async execute(message, args, client, connection, prefix) {
		const dbl = new DBL(topggkey, client);
		dbl.hasVoted(message.author.id).then(async voted => {
			if(!voted) message.reply(`❌ Please vote in the past 12 hours to use this command! (https://top.gg/bot/733480290592358411/vote)`)
			if(voted){
				await message.channel.send(`${args.join(' ')}\n**- ${message.author.username}**`)
				console.log(`${message.author.username} (${message.author.id}) Said: ${message.content}`)
			}
		});
	},
};