"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArgumentsAsString = exports.getArgumentsAsArray = exports.getCommand = exports.startsWithPrefix = void 0;
var prefix = require("../src/config").prefix;
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
    var text = content.substring(content.indexOf(" "));
    return text.split(" ");
}
exports.getArgumentsAsArray = getArgumentsAsArray;
// All arguments from a command, empty string if no argumets
function getArgumentsAsString(message) {
    var content = message.content;
    // No arugmets
    if (content.indexOf(" ") === -1 || !startsWithPrefix(message))
        return "";
    var text = content.substring(content.indexOf(" "));
    return text;
}
exports.getArgumentsAsString = getArgumentsAsString;
