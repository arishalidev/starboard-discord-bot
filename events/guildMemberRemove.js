const {connection} = require('../sqlSettings.js')

module.exports = async (client, member) => {
    connection.query(`DELETE FROM Boards WHERE author_id=${member.id} AND guild_id=${member.guild.id}`, (err, rows) => {
        if(err) return;
        if(!rows[0]) return;
        console.log(`Deleted ${rows[0].author_id}'s rows from Boards`)
    });
};
