module.exports = {
    name: "revoke",
    run: async (message, client) => {
        let Users = require("../schema/users.js");
        let fetch = require("node-fetch");
        let args = message.content.split(" ");
        if (!args[1])
            return message.reply({
                content: `**:x: Error [** You must provide the user that you want to revoke. **]**`,
            });
        let user;
        if (message.mentions.users.first()) {
            user = message.mentions.users.first();
        } else {
            let fetchedUser = await client.users
                .fetch(args[1])
                .catch((err) => {});
            if (fetchedUser) user = fetchedUser;
            else user = null;
        }
        if (user == null)
            return message.reply({
                content: `**:x: Error [** Cannot find this user. **]**`,
            });

        let userData = await Users.findOne({
            userId: user.id,
        });

        if (!userData)
            return message.reply({
                content: `**:x: Error [** This user isn't authorized before. **]**`,
            });

        const DiscordOauth2 = require("discord-oauth2");
        const oauth = new DiscordOauth2();

        const credentials = Buffer.from(
            `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
        ).toString("base64");

        await oauth.revokeToken(userData.access_token, credentials);

        userData.delete();

        message.reply({
            content: `**✅ Success [** This user was revoked successfully **]**`,
        });
    },
};
