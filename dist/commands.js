"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replyMessage = void 0;
var commandCollection_1 = require("./commandCollection");
var util = __importStar(require("./utils"));
var prefix = require("../src/config").prefix;
function replyMessage(client, message) {
    var content = message.content;
    // If message is not a command do not reply
    if (!content.startsWith(prefix))
        return;
    // Message is a bot command
    // Searches through array of available commands and give the proper response
    var messageCommand = util.getCommand(message);
    console.log("Message Command: " + messageCommand);
    commandCollection_1.commandCollection.some(function (cmd) {
        if (cmd.command === messageCommand) {
            console.log("Responding to: " + message.content);
            console.log();
            cmd.response(client, message);
        }
    });
}
exports.replyMessage = replyMessage;
