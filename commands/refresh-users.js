const users = require("../schema/users");
const DiscordOauth2 = require("discord-oauth2");
const { DataResolver } = require("discord.js");
const oauth = new DiscordOauth2();

module.exports = {
    name: "refresh-users",
    run: async (message, client) => {
        let args = message.content.split(" ");
        if (!args[1])
            return message.reply({
                content: `**:x: Example : [** ${client.prefix}refresh-members (all/user)** ]**`,
            });

        if (args[1] == "all") {
            let refreshed = 0;
            let usersData = await users.find({});

            let msg = await message.reply({
                content: `**⏱️ Please wait [** Members are refreshing. **]**`,
            });

            for await (const userData of usersData) {
                let data = await oauth.tokenRequest({
                    redirectUri: `${require('../config.json').DOMAIN_TYPE}://${process.env.domain}/callback`,
                    clientId: process.env.CLIENT_ID,
                    clientSecret: process.env.CLIENT_SECRET,
                    refreshToken: userData.refresh_token,
                    grantType: "refresh_token",
                });

                let getUser = await users.findOne({
                    userId: userData.userId,
                });

                getUser.access_token = data.access_token;
                getUser.refresh_token = data.refresh_token;

                await getUser.save();

                if (userData.access_token != data.access_token) refreshed++;
            }

            msg.edit({
                content: `**✅ Done [** Refreshed \`${refreshed}\` member. **]**`,
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

            let msg = await message.reply({
                content: `**⏱️ Please wait [** Member is refreshing. **]**`,
            });

            let data = await oauth.tokenRequest({
                redirectUri: `${require('../config.json').DOMAIN_TYPE}://${process.env.domain}/callback`,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: userData.refresh_token,
                grantType: "refresh_token",
            });

            let getUser = await users.findOne({
                userId: userData.userId,
            });

            getUser.access_token = data.access_token;
            getUser.refresh_token = data.refresh_token;

            await getUser.save();

            msg.edit({
                content: `**✅ Done [** Refreshed the member. **]**`,
            });
        }
    },
};
