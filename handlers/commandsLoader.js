async function loadCommands(client) {
    let fs = require("fs");
    let commandsFolder = fs.readdirSync("commands");

    for (const file of commandsFolder) {
        let command = require(`../commands/${file}`);
        client.commands.set(command.name, command);
    }
}

module.exports = loadCommands;
