import Discord, { Client, Message, Intents } from "discord.js";
import { replyMessage } from "./commands";
import * as AmongUs from "./amongus";
const { token } = require("../src/config");

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES", "DIRECT_MESSAGE_TYPING"] });

client.once('ready', () => {
	console.log(`User ${client.user?.tag} has logged in.`);
});

// Respond to commands sent within a discord server
client.on('messageCreate', (message: Message) => {
	console.log(`Received message: ${message.content}`);
	replyMessage(client, message);

});

client.on('message', (message: Message) => {
	console.log(`Message: ${message.content}`);
	console.log(`Message Type: ${message.type}\n`);
	// message.author.send(`Testing reading private messages: ${message.content}`);
	// if (message.channel.type === 'DM') {
		// 
	// }
});

client.login(token);