let chalk = require('chalk')
module.exports = (client) => {
    client.on("ready", async () => {
        console.log(`# Signed as ${chalk.white.bold(client.user.tag)}`);
        await client.user.setStatus(require('../config.json').BOT_STATUS);
        await client.user.setActivity(require('../config.json').BOT_ACTIVITY);
    });
};
