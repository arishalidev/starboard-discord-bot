const Discord = require('discord.js');
const config = require("../../config.js");

module.exports = {
	name: 'credits',
    description: 'Credits of the bot.',
    botPerms: [],
	userPerms: [],
    perms: 'public',
	async execute(message, args, client, connection) {
        const creditsembed = new Discord.MessageEmbed()
        .setColor(config.embedColour)
        .setTitle('Credits')
        .setDescription(`Bot made by <@298285408221921281>`)
        .addFields( 
                {name: "Bot Logo:" , value: "<@333618400876298241>", inline: true},
                {name: "Coding Language:", value: "Javascript, Node.js", inline: true},
                {name: "Npm Modules:", value: "Discord.js, Mysql, Nodemon", inline: true}
        )
        .setThumbnail(client.user.displayAvatarURL({dynamic: true}))

        return message.channel.send(creditsembed);
	},
};