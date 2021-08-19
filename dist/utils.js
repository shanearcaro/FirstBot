"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.stringArrayToNumberArray = exports.getArgumentsAsString = exports.getArgumentsAsArray = exports.getCommand = exports.startsWithPrefix = void 0;
var prefix = require("../src/config").prefix;
var prepend = "🔥 ";
var bold = "**";
var italicize = "*";
// True if message starts with prefix, false otherwise
function startsWithPrefix(message) {
    return message.content.startsWith(prefix);
}
exports.startsWithPrefix = startsWithPrefix;
// Send command from message
function getCommand(message) {
    if (!startsWithPrefix(message))
        return "";
    var content = message.content;
    if (content.indexOf(" ") === -1)
        return content.substring(1);
    return content.substring(1, content.indexOf(" "));
}
exports.getCommand = getCommand;
// All arguments from a command, empty string if no argumets
function getArgumentsAsArray(message) {
    var content = message.content;
    // No arugmets
    if (content.indexOf(" ") === -1 || !startsWithPrefix(message))
        return [""];
    var text = content.substring(content.indexOf(" ") + 1);
    return text.split(" ");
}
exports.getArgumentsAsArray = getArgumentsAsArray;
// All arguments from a command, empty string if no argumets
function getArgumentsAsString(message) {
    var content = message.content;
    // No arugmets
    if (content.indexOf(" ") === -1 || !startsWithPrefix(message))
        return "";
    var text = content.substring(content.indexOf(" ") + 1);
    return text;
}
exports.getArgumentsAsString = getArgumentsAsString;
function stringArrayToNumberArray(array) {
    var numberArray = [];
    array.forEach(function (value, index) {
        numberArray[index] = Number(value);
    });
    return numberArray;
}
exports.stringArrayToNumberArray = stringArrayToNumberArray;
function sendMessage(message, isBold, isItalic) {
    if (isBold === void 0) { isBold = true; }
    if (isItalic === void 0) { isItalic = false; }
    message = prepend + message;
    if (isBold)
        message = bold + message + bold;
    if (isItalic)
        message = italicize + message + italicize;
    return message;
}
exports.sendMessage = sendMessage;
