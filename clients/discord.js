const { Client, Collection, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
    ],
});

let config = require("../config.json");
client.commands = new Collection();
client.prefix = config.PREFIX;
client.owners = config.OWNERS;

require("../handlers/eventsLoader.js")(client);
require("../handlers/commandsLoader.js")(client);

client.login("ODA5MDkzNDM3OTIzMTMxNDYy.GjYhRG.7s1r0H93TWo_fuvpr8UCsjTZoSRNoQdaz2a7ow");