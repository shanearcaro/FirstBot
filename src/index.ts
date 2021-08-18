import Discord, { Client, Message, Intents } from "discord.js";
import { replyMessage } from "./commands";
import * as AmongUs from "./amongus";
const { token } = require("../src/config");

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

client.once('ready', () => {
	console.log(`User ${client.user?.tag} has logged in.`);
});

const guild = client.guilds.cache.first();
// Respond to commands sent within a discord server
client.on('messageCreate', (message: Message) => {
	console.log(`Received message: ${message.content}`);
	replyMessage(client, message);

});

client.login(token);