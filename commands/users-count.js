let fetch = require("node-fetch");
module.exports = {
    name: "users-count",
    run: async (message, client) => {
        let Users = require("../schema/users.js");
        let usersData = await Users.find({});
        let count = 0;

        let msg = await message.reply({
            content: `**⏱️ Please Wait [** Calculating members ... **]**`,
        });

        for await (const user of usersData) {
            let response = await fetch(
                "https://discord.com/api/v10/users/@me",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                    },
                }
            );
            let data = await response.json();
            if (data.id) count++;
        }

        msg.edit({
            content: `**Authorized members count :** \`${count}\``,
        });
    },
};
