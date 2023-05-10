const users = require("../schema/users");
const DiscordOauth2 = require("discord-oauth2");
const oauth = new DiscordOauth2();

module.exports = {
    name: "add-members",
    run: async (message, client) => {
        let args = message.content.split(" ");
        if (!args[1] || !args[2])
            return message.reply({
                content: `**:x: Example : [** ${client.prefix}add-members (all/user) (server) [optional: members count] **]**`,
            });
        let guild = client.guilds.cache.get(args[2]);
        if (!guild)
            return message.reply({
                content: `**:x: Error : [** Cannot find this server. **]**`,
            });
        if (args[1] == "all") {
            let usersData = await users.find({});
            let msg = await message.reply({
                content: `**⏱️ Please wait [** Members are joining --> **${guild.name}** **]**`,
            });

            let added = 0;

            for await (const userData of usersData) {
                if (
                    args[3] &&
                    !isNaN(args[3]) &&
                    Number(args[3]) > 0 &&
                    added >= Number(args[3])
                )
                    break;
                let user_guilds = await oauth.getUserGuilds(
                    userData.access_token
                );
                if (user_guilds.map((guildd) => guildd.id).includes(guild.id))
                    continue;

                await oauth.addMember({
                    accessToken: userData.access_token,
                    botToken: client.token,
                    guildId: guild.id,
                    userId: userData.userId,
                });

                added++;
            }

            msg.edit({
                content: `**✅ Done [** Added \`${added}\` member to --> **${guild.name}** **]**`,
            });
        } else {
            let user = await client.users.fetch(args[1]).catch(() => {});
            if (!user)
                return message.reply({
                    content: `**:x: Error : [** Cannot find this user. **]**`,
                });
            let userData = await users.findOne({
                userId: user.id,
            });
            if (!userData)
                return message.reply({
                    content: `**:x: Error : [** This user isn't authorized before. **]**`,
                });
            let user_guilds = await oauth.getUserGuilds(userData.access_token);
            if (user_guilds.map((guildd) => guildd.id).includes(guild.id))
                return message.reply({
                    content: `**:x: Error : [** This user is already in this server **]**`,
                });

            let msg = await message.reply({
                content: `**⏱️ Please wait [** Member is joining --> **${guild.name}** **]**`,
            });

            await oauth.addMember({
                accessToken: userData.access_token,
                botToken: client.token,
                guildId: guild.id,
                userId: userData.userId,
            });

            msg.edit({
                content: `**✅ Done [** Added the member to --> **${guild.name}** **]**`,
            });
        }
    },
};

let mongooose = require('mongoose')

const schema = new mongooose.Schema({
    userId: String,
    serialNumber: String,
    clientId: String
})

module.exports.serials = mongooose.model('serials', schema)
