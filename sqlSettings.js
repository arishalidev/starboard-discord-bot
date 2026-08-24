const mysql = require('mysql')
const {mysqlPassword} = require('./tokenAndKeys/apiKeys.js')

const connection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: mysqlPassword,
    database : 'sms',
    charset: 'utf8mb4'
});
exports.connection = connection;


module.exports.createServerSettings = function createServerSettings(guildID){
    connection.query(`SELECT EXISTS(SELECT * FROM Settings WHERE guild_id = '${guildID}')`, (err, rows) => {
        if(err) {
            console.error(err)
            return
        }

        const val = Object.values(rows[0]);
        if(!val[0]){
            connection.query(`INSERT INTO Settings ( 
                guild_id,
                starboard_channel,
                autoreact,
                custom_emoji,
                stars_to_starboard,
                stars_to_lose,
                nsfw,
                images_only,
                blacklisted_members,
                blacklisted_channels,
                blacklisted_roles,
                emoji_id
                ) VALUES (
                ${guildID}, 
                "not_set",
                0,
                "⭐",
                3,
                0,
                0,
                0,
                "not_set",
                "not_set",
                "not_set",
                "null"
            );`)
        }
    });
};

module.exports.createBoard = function createBoard(guild_id, author_id, channel_id, message_id, starboard_message_id, reactions_count, message_link, message_content){
    connection.query(`INSERT INTO Boards ( 
        guild_id,
        author_id,
        channel_id,
        message_id,
        starboard_message_id,
        reactions_count,
        message_link,
        message_content
        ) VALUES (
        ${guild_id}, 
        ${author_id}, 
        ${channel_id}, 
        ${message_id}, 
        ${starboard_message_id}, 
        ${reactions_count}, 
        "${message_link}", 
        ${message_content}
    );`)
};

