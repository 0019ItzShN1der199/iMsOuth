module.exports = (client) => {
    let prefix = client.prefix;
    client.on("messageCreate", async (message) => {
        if (!message.content.startsWith(prefix)) return;
        if (message.author.bot) return;
        let cmd = message.content.split(" ")[0].slice(prefix.length);
        if (!cmd) return;
        if (!client.commands.get(cmd)) return;
        if (!client.owners.includes(message.author.id)) return;
        try {
            client.commands.get(cmd).run(message, client);
        } catch (err) {
            console.log(err);
        }
    });
};
