import Discord, { Client, Message, Intents } from "discord.js";
import { replyMessage } from "./commands/commands";
import * as AmongUs from "./amongus";
const { token } = require("../config/config.json");

// const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const client = new Client({ 
	intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"],
	partials: ["MESSAGE", "CHANNEL", "GUILD_MEMBER"]
});

client.once('ready', () => {
	console.log(`User ${client.user?.tag} has logged in.`);
});

// Respond to commands sent within a discord server
client.on('messageCreate', (message: Message) => {
	console.log(`Received message: ${message.content}`);
	replyMessage(client, message, message.channel.type === "DM");

});

client.login(token);
