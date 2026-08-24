const Discord = require('discord.js')
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const fs = require(`fs`);

const {token} = require('./tokenAndKeys/token.js')
const {  defaultPrefix } = require('./config.js');
const {connection} = require(`./sqlSettings.js`)

console.log('Starting bot...')

//#region event handler
const eventFolderNames = ['events'];
for(var i = 0; i < eventFolderNames.length; i++){
    fs.readdir(`./${eventFolderNames}`, (err, files) => {
        if(err) return console.error(err);
        files.forEach(file => {
            if(!file.endsWith('.js')) return;
            const evt =  require(`./${eventFolderNames}/${file}`);
            let evtName = file.split('.')[0];
            client.on(evtName, evt.bind(null, client));
            console.log(`Loaded event '${evtName}'`);
        });
    });
}
//#endregion

//#region command handler
client.commands = new Discord.Collection();
const folderNames = ['commands/A public', 'commands/C administrator', 'commands/E owner'];
for(var i = 0; i < folderNames.length; i++){
    const commandFiles = fs.readdirSync(`./${folderNames[i]}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./${folderNames[i]}/${file}`);
        client.commands.set(command.name, command);
        console.log(`Loaded command '${command.name}'`);
    }
    console.log(`Loaded folder '${folderNames[i]}'`);
}
//#endregion

client.on('message', async message => {
    if(!message.content.toLowerCase().startsWith(defaultPrefix)) return;
    if(message.author.bot || message.channel.type == "dm") return;
    
    const args = message.content.slice(defaultPrefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if(!client.commands.has(command)) return;
    if(!message.member.guild.me.hasPermission(`VIEW_CHANNEL`, `SEND_MESSAGES`, `EMBED_LINKS`)) return;
    

    // ============================= PERMS =============================
    const commandPerms = client.commands.get(command).perms;
    if(commandPerms == 'admin'){
        if(!message.member.hasPermission(`ADMINISTRATOR`)){
            return message.channel.send(`❌ Hey! You dont have sufficient permissions for this. (\`Administrator\`)`);
        }
    }
    if(commandPerms == 'owner'){
        if(message.author.id !== '298285408221921281'){
            return message.channel.send(`❌ Hey! You cant run this command.`);
        }
    }
    // ============================= END =============================
    try {
        await client.commands.get(command).execute(message, args, client, connection);
        console.log(`Command Run: ${client.commands.get(command).name}`)
    } catch (err) {
        await message.reply(`something went wrong while executing that command!`)
        throw err;
    }
});
//#endregion
client.on('debug', console.log)
      .on('warn', console.log)
client.login(token)