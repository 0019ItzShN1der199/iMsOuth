async function loadEvents(client) {
    let fs = require("fs");
    let eventsFolder = fs.readdirSync("events");

    for (const file of eventsFolder) {
        let event = require(`../events/${file}`);
        event(client);
    }
}

module.exports = loadEvents;
