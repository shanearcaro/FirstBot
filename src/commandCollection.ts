import { Client, Message, User } from "discord.js";
import { AmongUs, Player, roles} from "./amongus";
import { Command } from "./commands";
import * as util from "./utils"
const { prefix } = require("../src/config");

export const commandCollection: Command[] = [];
let game: AmongUs | null = null;
let gameHost: string = "";
let gameHostName: string = "";

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
    command: "create",
    description: "Create an Among Us Game, Arguments: MaxNumberOfPlayers, NumberOfShortTasks, NumberOfCommonTasks, NumberOfLongTasks, NumberOfModerators, NumberOfImpostors",
    response: (client: Client, message: Message) => {
        // Check if game exists
        if (game !== null) {
            message.channel.send(util.sendMessage("A game has already been created"));
            message.channel.send(util.sendMessage(`Use ${prefix}stop to end the current game.`));
            return;
        }

        game = new AmongUs();
        const args = util.getArgumentsAsArray(message);

        if (!(args.length === 1 && args[0] === ""))
            game.setValues(...util.stringArrayToNumberArray(args));
        gameHost = message.author.tag;
        gameHostName = message.author.username;

        message.channel.send(util.sendMessage(`Created Among Us Game:
        Max Number of Players: ${game.maxNumberOfPlayers}
        Number of Short Tasks: ${game.numberOfShortTasks}
        Number of Common Tasks: ${game.numberOfCommonTasks}
        Number of Long Tasks: ${game.numberOfLongTasks}
        Number of Moderators: ${game.numberOfModerators}
        Number of Impostors: ${game.numberOfImpostors}`));

        message.channel.send(util.sendMessage(`Type ${prefix}join to join now`));
    }
});

commandCollection.push({
    command: "edit",
    description: "Edit Among Us Game settings",
    response: (client: Client, message: Message) => {
        // Check if game exists
        if (game === null) {
            message.channel.send(util.sendMessage("Cannot change values: no game is active"));
            message.channel.send(util.sendMessage(`Use ${prefix}create to create a new game.`));
            return;
        }

        const userTag: string = message.author.tag;

        if (gameHost !== userTag) {
            message.channel.send(util.sendMessage(`Cannot edit game: you are not the creator`));
            message.channel.send(util.sendMessage(`${gameHostName} has permission to edit the game.`));
            return
        }

        const args = util.getArgumentsAsArray(message);
        game.setValues(...util.stringArrayToNumberArray(args));

        message.channel.send(util.sendMessage(`Created Among Us Game:
        Max Number of Players: ${game.maxNumberOfPlayers}
        Number of Short Tasks: ${game.numberOfShortTasks}
        Number of Common Tasks: ${game.numberOfCommonTasks}
        Number of Long Tasks: ${game.numberOfLongTasks}
        Number of Moderators: ${game.numberOfModerators}
        Number of Impostors: ${game.numberOfImpostors}`));
    }
});

commandCollection.push({
    command: "join",
    description: "Join an AmongUs game",
    response: (client: Client, message: Message) => {
        // Check if game exists
        if (game === null) {
            message.channel.send(util.sendMessage(`Cannot join game: no game is active.`));
            message.channel.send(util.sendMessage(`Use ${prefix}create to create a new game.`));
            return;
        }

        // Check if players are allowed to join
        if (game.players.length === game.maxNumberOfPlayers) {
            message.channel.send(util.sendMessage(`Max number of players reached!`));
            message.channel.send(util.sendMessage(`Either change the maximum number of players allowed or sit out for now.`));
            return;
        }

        const userTag: string = message.author.tag;
        const username: string = message.author.username;
        const userID: string = message.author.id;
        const nickname: string = message.member?.nickname ?? username;

        let alreadyJoined: boolean = false;
        game.players.some((player: Player) => {
            if (player.user === userTag) {
                // Player has already joined the game
                message.channel.send(util.sendMessage(`You have already joined the game ${username}`));
                alreadyJoined = true;
            }
        });

        if (alreadyJoined)
            return;

        let player: Player = {
            user: userTag,
            nickname: nickname,
            id: userID,
            role: roles.PLAYER
        }

        game.players.push(player);
        message.channel.send(util.sendMessage(`${username} has joined! [${game.players.length}/${game.maxNumberOfPlayers}]`));
    }
});

commandCollection.push({
    command: "leave",
    description: "Leave the current game",
    response: (client: Client, message: Message) => {
        if (game === null) {
            message.channel.send(util.sendMessage(`Cannot leave game: no game is active.`));
            message.channel.send(util.sendMessage(`Use ${prefix}create to create a new game.`));
            return;
        }

        const userTag: string = message.author.tag;
        const username: string = message.author.username;
        const nickname: string = message.member?.nickname ?? username;
        let leftGame: boolean = false;
        game.players.forEach((player: Player, index: number) => {
            if (player.user === userTag) {
                game!.players.splice(index, 1);
                leftGame = true;
                // If player is a mod decrease the count
                if (player.role === roles.MOD)
                    game!.currentMods -= 1;
            }
        });

        if (leftGame)
            message.channel.send(util.sendMessage(`${nickname} has left! [${game.players.length}/${game.maxNumberOfPlayers}]`));
        else
            message.channel.send(util.sendMessage(`You are not currently in the game ${nickname}!`));
    }
});

commandCollection.push({
    command: "stop",
    description: "Terminate the current game",
    response: (client: Client, message: Message) => {
        if (game === null) {
            message.channel.send(util.sendMessage(`Cannot stop game: no game is active.`));
            message.channel.send(util.sendMessage(`Use ${prefix}create to create a new game.`));
            return;
        }

        const userTag: string = message.author.tag;

        if (gameHost !== userTag) {
            message.channel.send(util.sendMessage(`Cannot stop game: you are not the creator`));
            message.channel.send(util.sendMessage(`${gameHostName} has permission to stop the game.`));
            return
        }

        game = null;
        message.channel.send(util.sendMessage(`Current Among Us game has been terminated.`));
    }
});

commandCollection.push({
    command: "mod",
    description: "Become a game moderator",
    response: (client: Client, message: Message) => {
        if (game === null) {
            message.channel.send(util.sendMessage(`Cannot join moderators: no game is active.`));
            message.channel.send(util.sendMessage(`Use ${prefix}create to create a new game.`));
            return;
        }

        const userTag: string = message.author.tag;
        const username: string = message.author.username;
        const nickname: string = message.member?.nickname ?? username;
        let playerJoined: boolean = false;
        game.players.forEach((player: Player) => {
            if (player.user === userTag)
                playerJoined = true;
        });

        // If player isn't in the game, can't join as moderator
        if (!playerJoined) {
            message.channel.send(util.sendMessage(`You are not apart of the game ${nickname}`));
            message.channel.send(util.sendMessage(`Use ${prefix}join to join now`));
            return;
        }

        // If max number of moderators is reached, can't join moderator
        if (game.currentMods === game.numberOfModerators) {
            message.channel.send(util.sendMessage(`Cannot join moderators: limit reached.`));
            return;
        }

        // If player is already a moderator
        let alreadyMod: boolean = false;
        game.players.forEach((player: Player) => {
            if (player.user === userTag) {
                if (player.role === roles.MOD)
                    alreadyMod = true;
                else {
                    player.role = roles.MOD;
                    game!.currentMods += 1;
                }
            }
        })

        if (alreadyMod) {
            message.channel.send(util.sendMessage(`Cannot join moderators: already a moderator.`));
            return;
        }

        message.channel.send(util.sendMessage(`${nickname} is now a MODERATOR!`));
    }
})

commandCollection.push({
    command: "start",
    description: "Start the game",
    response: (client: Client, message: Message) => {
        if (game === null) {
            message.channel.send(util.sendMessage(`Cannot start game: no game is active.`));
            message.channel.send(util.sendMessage(`Use ${prefix}create to create a new game.`));
            return;
        }

        const userTag: string = message.author.tag;
        const username: string = message.author.username;
        const nickname: string = message.member?.nickname ?? username;
        if (gameHost !== userTag) {
            message.channel.send(util.sendMessage(`Cannot start game: you are not the creator`));
            message.channel.send(util.sendMessage(`${gameHostName} has permission to start the game.`));
            return
        }

        // const minimumPlayers: number = game!.numberOfImpostors * 2 + game!.numberOfModerators;

        // if (game!.players.length < minimumPlayers) {
        //     message.channel.send(util.sendMessage(`Cannot start game: minimum players needed: ${minimumPlayers}`));
        //     message.channel.send(util.sendMessage(`Currently have [${game.players.length}/${game.maxNumberOfPlayers}]`))
        //     return;
        // }

        let numbers: number[] = [];

        // Randomly choose moderators
        if (game.currentMods != game.numberOfModerators) {
            game.players.forEach((player: Player, index: number) => {
                numbers.push(index);
            })

            for (let i = 0; i < game.numberOfModerators; i++) {
                let random = Math.trunc(Math.random() * numbers.length)
                game.players[numbers[random]].role = roles.MOD;
                message.channel.send(util.sendMessage(`${game.players[numbers[random]].nickname} has been picked as a morderator.`))
                numbers.splice(random, 1); 
            }
            numbers = [];
        }

        // Randomly choose impostors
        game.players.forEach((player: Player, index: number) => {
            if (player.role != roles.MOD)
                numbers.push(index);
        })

        for (let i = 0; i < game.numberOfImpostors; i++) {
            let random = Math.trunc(Math.random() * numbers.length)
            game.players[numbers[random]].role = roles.IMPOSTOR;
            client.users.fetch(game.players[numbers[random]].id).then((user: User) => {
                user.send(util.sendMessage(`You are the imposter!`));
                if (game!.numberOfImpostors === 1)
                    user.send(util.sendMessage(`You have no allies.`));
            });
            numbers.splice(random, 1);
        }

        if (game.numberOfImpostors > 1) {
            game.players.forEach((player: Player) => {
                if (player.role === roles.IMPOSTOR) {
                    let otherImposters: string[] = [];
                    game!.players.forEach((imposter: Player) => {
                        if (imposter.role === roles.IMPOSTOR && imposter.user != player.user)
                            otherImposters.push(imposter.nickname);
                    })
                    client.users.fetch(player.id).then((user: User) => {
                        user.send(util.sendMessage(`Your imposter allies are: ${otherImposters}`));
                    });
                }
            });
        }
        message.channel.send(util.sendMessage(`The game has now started, good luck!`));

        // Assign players roles and tasks
    }
});
