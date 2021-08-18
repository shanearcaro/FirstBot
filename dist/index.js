"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var commands_1 = require("./commands");
var token = require("../src/config").token;
var client = new discord_js_1.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
client.once('ready', function () {
    var _a;
    console.log("User " + ((_a = client.user) === null || _a === void 0 ? void 0 : _a.tag) + " has logged in.");
});
var guild = client.guilds.cache.first();
// Respond to commands sent within a discord server
client.on('messageCreate', function (message) {
    console.log("Received message: " + message.content);
    commands_1.replyMessage(client, message);
});
client.login(token);
