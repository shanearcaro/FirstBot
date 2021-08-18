import { Message, Client } from "discord.js"
import { commandCollection } from "./commandCollection";
import * as util from "./utils";
const { prefix } = require("../src/config");

export type Command = {
    command: string,
    description: string,
    response: (client: Client, message: Message) => void;
}

export function replyMessage(client: Client, message: Message): void {
    const { content } = message;

    // If message is not a command do not reply
    if (!content.startsWith(prefix))
        return;

    // Message is a bot command
    // Searches through array of available commands and give the proper response
    let messageCommand = util.getCommand(message);
    console.log(`Message Command: ${messageCommand}`);
    commandCollection.some((cmd: Command) => {
        if (cmd.command === messageCommand) {
            console.log(`Responding to: ${message.content}`)
            console.log();
            cmd.response(client, message);
        }
    });
}