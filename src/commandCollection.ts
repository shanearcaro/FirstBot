import { Client, Message } from "discord.js";
import { Command } from "./commands";
import * as util from "./utils"

export const commandCollection: Command[] = [];

// Ping command
commandCollection.push({
    command: "ping",
    description: "Pongs the user",
    response: (client: Client, message: Message) => {
        message.channel.send("Pong!");
    }
});

// Reply command
commandCollection.push({
    command: "reply",
    description: "Replys with the same message",
    response: (client: Client, message: Message) => {
        console.log(`Message: ${util.getArgumentsAsString(message)}`)
        message.channel.send(util.getArgumentsAsString(message));
    }
});

// Shutdown command
commandCollection.push({
    command: "shutdown",
    description: "Shut down the bot",
    response: (client: Client, message: Message) => {
        message.channel.send(`User ${client.user?.tag} is shutting down.`);
        process.abort();
    }
});

// Hi command
commandCollection.push({
    command: "hi",
    description: "Greeting message",
    response: (client: Client, message: Message) => {
        const random: number = Math.trunc(Math.random() * 5)
        const greetings: string[] = ["Hello", "Welcome", "What's up!", "What's going on!", "Sup!"];
        message.channel.send(greetings[random]);
    }
});
