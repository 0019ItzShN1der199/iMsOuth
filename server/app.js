const express = require("express");
const app = express();
const fetch = require("node-fetch");
const Users = require("../schema/users.js");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

app.get("/callback", async (req, res) => {
    let code = req.query.code;

    let body = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: `${require("../config.json").DOMAIN_TYPE}://${
            process.env.DOMAIN
        }/callback`,
        grant_type: "authorization_code",
        scopes: ["identify", "guilds", "guilds.join"],
        code,
    };

    let response = await fetch(`https://discord.com/api/oauth2/token`, {
        method: "POST",
        body: new URLSearchParams(body),
        headers: {
            "Content-Type": `application/x-www-form-urlencoded`,
        },
    });

    let data = await response.json();

    if (data.error) return res.render('error.ejs', {
        error: data
    });

    if (!data.error) {
        let userApiResponse = await fetch(
            "https://discord.com/api/v10/users/@me",
            {
                method: "GET",
                headers: {
                    Authorization: `${data.token_type} ${data.access_token}`,
                },
            }
        );

        let user_data = await userApiResponse.json();

        let dataOfUser = await Users.findOne({
            userId: user_data.id,
        });

        if (dataOfUser && dataOfUser.access_token == data.access_token)
            return res.render('error.ejs', {
                error: {
                    error: `invalid request`,
                    error_description: `You are already authorized.`
                }
            });
        if (dataOfUser && dataOfUser.access_token != data.access_token) {
            dataOfUser.access_token = data.access_token;
            dataOfUser.refresh_token = data.refresh_token;
            await dataOfUser.save();
        }

        if (!dataOfUser)
            dataOfUser = await new Users({
                userId: user_data.id,
                access_token: data.access_token,
                refresh_token: data.refresh_token,
            }).save();

        res.render('done.ejs', {
            success_message: require("../config.json")
            .AUTHORIZATION_SUCCESS_MESSAGE.replaceAll(
                "{username}",
                user_data.username
            )
            .replaceAll("{tag}", user_data.discriminator)
        });

        let { EmbedBuilder } = require("discord.js");

        let embed = new EmbedBuilder()
            .setTitle("NEW AUTHORIZATION")
            .setDescription(
                `👤 UserID: \`${
                    user_data.id
                }\`\n⏰ Authorized At: <t:${Math.floor(Date.now() / 1000)}:D>`
            )
            .setThumbnail(
                `https://cdn.discordapp.com/avatars/${user_data.id}/${user_data.avatar}.png?size=1024`
            )
            .setColor("Red")
            .setAuthor({
                name: `${user_data.username}#${user_data.discriminator}`,
                iconURL: user_data.avatar.startsWith("a_")
                    ? `https://cdn.discordapp.com/avatars/${user_data.id}/${user_data.avatar}.gif?size=1024`
                    : `https://cdn.discordapp.com/avatars/${user_data.id}/${user_data.avatar}.png?size=1024`,
            })
            .setTimestamp();

        let { WebhookClient } = require("discord.js");

        let webhook = new WebhookClient({
            url: require("../config.json").LOG_CHANNEL_WEBHOOK_URL,
        });

        if (require("../config.json").LOG_ENABLED == true)
            webhook.send({
                embeds: [embed],
                username: user_data.username,
                avatarURL: user_data.avatar.startsWith("a_")
                    ? `https://cdn.discordapp.com/avatars/${user_data.id}/${user_data.avatar}.gif?size=1024`
                    : `https://cdn.discordapp.com/avatars/${user_data.id}/${user_data.avatar}.png?size=1024`,
            });
    }
});

app.listen(2519);

module.exports = app;
