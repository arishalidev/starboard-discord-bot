const { createServerSettings, connection } = require(`../sqlSettings.js`)
const {apiKeys, topggkey} = require('../tokenAndKeys/apiKeys.js');
const blapi = require("blapi");
const DBL = require("dblapi.js");

module.exports = async (client) => {
  console.log(`Client has successfully logged in as ${client.user.tag}!`);

    // Checks for any new guilds that are not in sql on startup and every 15 seconds
    var guildslist = client.guilds.cache.map(t => t.id)
    for(var i = 0; i < client.guilds.cache.size; i++){
      const lookedGuild = guildslist[i]
      createServerSettings(lookedGuild)
      const currentGuild = client.guilds.cache.get(lookedGuild)
    }



    const dbl = new DBL(topggkey, client);
    blapi.handle(client, apiKeys, 60);
    dbl.postStats(client.guilds.size);

    client.user.setActivity(`sms help`, { type:'PLAYING' });
    setInterval(() => {
      dbl.postStats(client.guilds.size);
      console.log(`Dbl stats posted`)
      var smssupportguild = client.guilds.cache.get('734548620279414794')
      client.channels.cache.get('744335314142888026').setName(`Users: ${client.users.cache.size}`, 'Update Stats for bot')
      client.channels.cache.get('744335499434393700').setName(`Guilds: ${client.guilds.cache.size}`, 'Update Stats for bot')
      client.channels.cache.get('744337975680303195').setName(`Members: ${smssupportguild.memberCount}`, 'Update Stats for server')
  }, 900000);

    console.log(`Connected! Currently in ${client.guilds.cache.size} severs.`)
};