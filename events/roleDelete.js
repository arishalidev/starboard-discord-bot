const config = require('../config')
const {connection} = require('../sqlSettings.js')

module.exports = (client, role) => {
    connection.query(`SELECT blacklisted_roles FROM Settings WHERE guild_id = ${role.guild.id}`, async (err, rows) => {
        const blRoles = rows[0].blacklisted_roles.split(',')
        if(blRoles == 'not_set') return;
        var roleIndex = blRoles.indexOf(role.id)
        if(roleIndex <= -1){
            return;
        }else{
            inputRole = blRoles;
            inputRole.splice(roleIndex, 1)
            if(!inputRole[0]){
                inputRole = 'not_set'
            }
            connection.query(`UPDATE Settings
            SET blacklisted_roles = '${inputRole}'
            WHERE guild_id = ${role.guild.id}`)
            return;
        }
    });
};
