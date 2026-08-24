const Discord = require('discord.js');
const config = require("../../config.js");

module.exports = {
	name: 'invite',
    description: 'Invite link for bot.',
    botPerms: [],
	userPerms: [],
    perms: 'public',
	async execute(message, args, client, connection) {
        const invitePlayerMember = new Discord.MessageEmbed()
        .setColor(config.embedColour)
        .setDescription(`Invite sms to your server!`)
        .setThumbnail(client.user.displayAvatarURL({dynamic: true}))
        .addFields(
            { name: '🔗 Invite link:', value: '[Invite the bot to your server](https://discord.com/oauth2/authorize?client_id=733480290592358411&permissions=117968&scope=bot)', inline: false },
            { name: '🪛 Server link:', value: '[Join the official support server](https://discord.gg/2n3qN7p)'},
        )
        .addFields(
            { name: '⬆️ Upvote Bot:', value: 'Enjoy sms? [Upvote the bot](https://forms.gle/3RjjEnyEjCfCPKmo7)', inline: false },
            { name: '📋 Bugreport link:', value: 'Found a bug? [Submit a bugreport](https://forms.gle/3RjjEnyEjCfCPKmo7)', inline: false },
        )
        .setTitle('Invite Sms')
        .setURL('https://discord.com/oauth2/authorize?client_id=733480290592358411&permissions=117968&scope=bot')

        return message.channel.send(invitePlayerMember);
	},
};