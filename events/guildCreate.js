const config = require('../config')
const create = require('../sqlSettings.js')


module.exports = (client, guild) => {
    console.log(`Joined server: '${guild.name}', (${guild.id})`)
    create.createServerSettings(guild.id);
};