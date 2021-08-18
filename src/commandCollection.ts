import { Client, Message } from "discord.js";
import { AmongUs, Player } from "./amongus";
import { Command } from "./commands";
import * as util from "./utils"
const { prefix } = require("../src/config");

export const commandCollection: Command[] = [];
let game: AmongUs | null = null;

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
        client.destroy();
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

// === In Person Among Us Commands Below ===
commandCollection.push({
    command: "createGame",
    description: "Start an Among Us Game, Arguments: MaxNumberOfPlayers, NumberOfShortTasks, NumberOfCommonTasks, NumberOfLongTasks, NumberOfModerators, NumberOfImpostors",
    response: (client: Client, message: Message) => {
        if (game !== null) {
            message.channel.send(util.sendMessage("A game has already been created", true));
            message.channel.send(util.sendMessage(`Use ${prefix}quit to end the current game.`, true));
            return;
        }

        game = new AmongUs();
        const args = util.getArgumentsAsArray(message);
        console.log(args);
        game.setValues(...util.stringArrayToNumberArray(args));
        console.log(args);

        console.log();
        console.log(game);
        message.channel.send(util.sendMessage(`
        Created Among Us Game**:
        **Max Number of Players**: ${game.maxNumberOfPlayers}
        **Number of Short Tasks**: ${game.numberOfShortTasks}
        **Number of Common Tasks**: ${game.numberOfCommonTasks}
        **Number of Long Tasks**: ${game.numberOfLongTasks}
        **Number of Moderators**: ${game.numberOfModerators}
        **Number of Impostors**: ${game.numberOfImpostors}
        
        Type ${prefix}join to join now`, true))
    }
});

commandCollection.push({
    command: "join",
    description: "Join an AmongUs game",
    response: (client: Client, message: Message) => {
        if (game === null) {
            message.channel.send(util.sendMessage(`Cannot join game: no game is active.`, true));
            message.channel.send(util.sendMessage(`Use ${prefix}createGame to create a new game.**`, true));
            return;
        }

        if (game.players.length === game.maxNumberOfPlayers) {
            message.channel.send(util.sendMessage(`Max number of players reached!**`, true));
            message.channel.send(util.sendMessage(`Either change the maximum number of players allowed or sit out for now.**`, true));
            return;
        }

        const userTag = message.author.tag;
        let alreadyJoined: boolean = false;
        game.players.some((player: Player) => {
            if (player.user === userTag) {
                // Player has already joined the game
                message.channel.send(util.sendMessage(`You have already joined the game ${userTag}**`, true));
                alreadyJoined = true;
            }
        });

        if (alreadyJoined)
            return;

        let player: Player = {
            user: userTag
        }

        game.players.push(player);
        message.channel.send(util.sendMessage(`${userTag} has joined! [${game.players.length}/${game.maxNumberOfPlayers}]**`, true))
    }
});
