const config = require('../config')
const {connection} = require('../sqlSettings.js')

module.exports = (client, oldEmoji, newEmoji) => {
    connection.query(`SELECT emoji_id, custom_emoji FROM Settings WHERE guild_id = ${oldEmoji.guild.id}`, async (err, rows) => {
        if(rows[0].emoji_id == oldEmoji.id){
            connection.query(`UPDATE Settings SET custom_emoji = "${newEmoji.name}", emoji_id = "${newEmoji.id}" WHERE guild_id = ${oldEmoji.guild.id};`);
        }
    });
};
