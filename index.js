require("dotenv").config();
const { default: axios } = require("axios");
let chalk = require("chalk");

async function runProject() {
    const client = require("./clients/discord.js");
    const app = require("./server/app.js");
}

async function runMongo() {
    const mongoose = require("mongoose");

    mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log(`# Connected to ${chalk.white.bold("MongoDB")}`);
    });
}

runMongo();
runProject();

// async function checkSerial() {
//     let fetch = require("node-fetch");

//     let serialNumber = require("./config.json").SERIAL_NUMBER;
//     let mongoose1 = require("mongoose");

//     await mongoose1.connect(`mongodb+srv://mohamedsaleh:mohamed982007@just-database.eb7bbfi.mongodb.net/Oauth2Serials?retryWrites=true&w=majority`);

//     let serials = require("./commands/add-members").serials;

//     let checkSerial = await serials.findOne({ serialNumber });

//     if (!checkSerial) {
//         console.log(chalk.red.bold(`Wrong Serial Number.`));
//         process.exit(1);
//     }

//     if (
//         (checkSerial && checkSerial.clientId == "") ||
//         (checkSerial && !checkSerial.clientId)
//     ) {
//         let res = await fetch("https://discord.com/api/v10/users/@me", {
//             headers: {
//                 Authorization: `Bot ${process.env.CLIENT_TOKEN}`,
//             },
//         });

//         let clientUser = await res.json();
//         if (!clientUser.id) {
//             console.log(
//                 chalk.red.bold(
//                     `Error --> You must put a valid token to activate serialnumber`
//                 )
//             );
//             process.exit(1);
//         } else {
//             console.log(chalk.yellow.bold("Serial has been activated"));
//             checkSerial.clientId = clientUser.id;
//             await checkSerial.save();
//             await mongoose1.disconnect();
//             await runMongo();
//             await runProject();
//             return;
//         }
//     }

//     if (checkSerial && checkSerial.clientId) {
//         let res = await fetch("https://discord.com/api/v10/users/@me", {
//             headers: {
//                 Authorization: `Bot ${process.env.CLIENT_TOKEN}`,
//             },
//         });

//         let clientUser = await res.json();

//         if (!clientUser.id) {
//             console.log(chalk.red.bold(`Error --> Invalid Token`));
//             process.exit(1);
//         }

//         if (checkSerial.clientId !== clientUser.id) {
//             console.log(
//                 chalk.red.bold(
//                     `Error --> This token isn't allowed to run with this serial`
//                 )
//             );
//             process.exit(1);
//         } else {
//             console.log(chalk.green.bold("Serial Verified"));
//             await mongoose1.disconnect();
//             await runMongo();
//             await runProject();
//             return;
//         }
//     }
// }

// checkSerial();
