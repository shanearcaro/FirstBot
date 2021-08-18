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
exports.commandCollection = void 0;
var util = __importStar(require("./utils"));
exports.commandCollection = [];
// Ping command
exports.commandCollection.push({
    command: "ping",
    description: "Pongs the user",
    response: function (client, message) {
        message.channel.send("Pong!");
    }
});
// Reply command
exports.commandCollection.push({
    command: "reply",
    description: "Replys with the same message",
    response: function (client, message) {
        console.log("Message: " + util.getArgumentsAsString(message));
        message.channel.send(util.getArgumentsAsString(message));
    }
});
// Shutdown command
exports.commandCollection.push({
    command: "shutdown",
    description: "Shut down the bot",
    response: function (client, message) {
        var _a;
        message.channel.send("User " + ((_a = client.user) === null || _a === void 0 ? void 0 : _a.tag) + " is shutting down.");
        process.abort();
    }
});
// Hi command
exports.commandCollection.push({
    command: "hi",
    description: "Greeting message",
    response: function (client, message) {
        var random = Math.trunc(Math.random() * 5);
        var greetings = ["Hello", "Welcome", "What's up!", "What's going on!", "Sup!"];
        message.channel.send(greetings[random]);
    }
});
