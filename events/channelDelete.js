const config = require('../config')
const {connection} = require('../sqlSettings.js')

module.exports = (client, channel) => {
    if(channel.type == 'dm') return;
    connection.query(`SELECT blacklisted_channels FROM Settings WHERE guild_id = ${channel.guild.id}`, async (err, rows) => {
        const blChannel = rows[0].blacklisted_channels.split(',')
        if(blChannel == 'not_set') return;
        var channelIndex = blChannel.indexOf(channel.id)
        if(channelIndex <= -1){
            return;
        }else{
            inputChannel = blChannel;
            inputChannel.splice(channelIndex, 1)
            if(!inputChannel[0]){
                inputChannel = 'not_set'
            }
            connection.query(`UPDATE Settings
            SET blacklisted_channels = '${inputChannel}'
            WHERE guild_id = ${channel.guild.id}`)
            return;
        }
    });
};
