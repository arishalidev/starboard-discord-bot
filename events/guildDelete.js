const {connection} = require('../sqlSettings.js')

module.exports = async (client, guild) => {

    function delteServer(table){
        console.log(`Left server: '${guild.name}', (${guild.id})`)
        connection.query(`DELETE FROM ${table} WHERE guild_id=${guild.id}`, (err, rows) => {
            if(err) return console.error(`Could not delete row for ${guild.name}, (${guild.id}) or there was none`)
            console.log(`Deleted '${table}' mysql table for ${guild.id}`)
        });
    }

    delteServer('Settings')
    delteServer('Boards')
};