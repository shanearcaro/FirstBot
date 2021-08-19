import { Message, Client } from "discord.js"
import { commandCollection } from "./commandCollection";
import * as util from "../utils";
const { prefix } = require("../../config/config.json");

export type Command = {
    command: string,
    description: string,
    isDMable: boolean,
    response: (client: Client, message: Message, isDM: boolean) => void;
}

export function replyMessage(client: Client, message: Message, isDM: boolean = false): void {
    const { content } = message;

    // If message is not a command do not reply
    if (!content.startsWith(prefix))
        return;

    // Message is a bot command
    // Searches through array of available commands and give the proper response
    let messageCommand = util.getCommand(message);
    console.log(`Message Command: ${messageCommand}`);
    commandCollection.some((cmd: Command) => {
        if (cmd.command.toLowerCase() === messageCommand.toLowerCase()) {
            console.log(`Responding to: ${message.content}`)
            console.log();
            cmd.response(client, message, isDM);
        }
    });
}