import { Message } from "discord.js";
const { prefix } = require("../src/config");
const prepend: string = "🔥 ";
const bold: string = "**";
const italicize: string = "*";

// True if message starts with prefix, false otherwise
export function startsWithPrefix(message: Message): boolean {
    return message.content.startsWith(prefix);
}

// Send command from message
export function getCommand(message: Message): string {
    if (!startsWithPrefix(message))
        return "";

    const { content } = message;

    if (content.indexOf(" ") === -1)
        return content.substring(1);
    return content.substring(1, content.indexOf(" "));
}

// All arguments from a command, empty string if no argumets
export function getArgumentsAsArray(message: Message): string[] {
    const { content } = message;

    // No arugmets
    if (content.indexOf(" ") === -1 || !startsWithPrefix(message))
        return [""];

    const text = content.substring(content.indexOf(" ") + 1);
    return text.split(" ");
}

// All arguments from a command, empty string if no argumets
export function getArgumentsAsString(message: Message): string {
    const { content } = message;

    // No arugmets
    if (content.indexOf(" ") === -1 || !startsWithPrefix(message))
        return "";

    const text = content.substring(content.indexOf(" ") + 1);
    return text;
}

export function stringArrayToNumberArray(array: string[]): number[] {
    let numberArray: number[] = [];

    array.forEach(( value: string, index: number) => {
        numberArray[index] = Number(value);
    });
    return numberArray;
}

export function sendMessage(message: string, isBold: boolean = true, isItalic: boolean = false): string {
    message = prepend + message;
    if (isBold) message = bold + message + bold;
    if (isItalic) message = italicize + message + italicize;
    return message;
}
