const config = require('../config')
const {connection} = require('../sqlSettings.js')

module.exports = (client, emoji) => {
    connection.query(`SELECT emoji_id FROM Settings WHERE guild_id = ${emoji.guild.id}`, async (err, rows) => {
        if(rows[0].emoji_id == emoji.id){
            connection.query(`UPDATE Settings SET custom_emoji = "⭐", emoji_id = "null" WHERE guild_id = ${emoji.guild.id};`);
        }
    });
};
