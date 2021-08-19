import { Client, Message, TextBasedChannels, User, UserFlags, UserFlagsString } from "discord.js";
import { AmongUs, Player, roles} from "../amongus";
import { Command } from "./commands";
import * as util from "../utils"
import { Channel } from "diagnostics_channel";
const { prefix } = require("../../config/config.json");

export const commandCollection: Command[] = [];
let game: AmongUs | null = null;
let gameHost: string = "";
let gameHostName: string = "";
let gameStarted: boolean = false;
let gameChannel: TextBasedChannels;

// Shutdown command
commandCollection.push({
    command: "shutdown",
    description: "Shut down the bot",
    isDMable: false,
    response: (client: Client, message: Message, isDM: boolean) => {
        message.channel.send(`User ${client.user?.tag} is shutting down.`);
        client.destroy();
    }
});

// === In Person Among Us Commands Below ===
commandCollection.push({
    command: "create",
    description: "Create an Among Us Game",
    isDMable: false,
    response: (client: Client, message: Message, isDM: boolean) => {
        if (isDM) {
            client.users.fetch(message.author.id).then((user: User) => {
                user.send(util.sendMessage(`Your cannot direct message this command`));
            });
            return;
        }
        // Check if game exists
        if (game !== null) {
            message.channel.send(util.sendMessage("A game has already been created"));
            message.channel.send(util.sendMessage(`Use ${prefix}stop to end the current game.`));
            return;
        }

        game = new AmongUs();
        gameChannel = message.channel;
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
        Number of Imposters: ${game.numberOfImposters}`));

        message.channel.send(util.sendMessage(`Type ${prefix}join to join now`));
        message.channel.send(util.sendMessage(`Use ${prefix}help for a list of available commands.`));
    }
});

commandCollection.push({
    command: "edit",
    description: "Edit game settings. Only the creator of the game can use this command.",
    isDMable: false,
    response: (client: Client, message: Message, isDM: boolean) => {
        if (isDM) {
            client.users.fetch(message.author.id).then((user: User) => {
                user.send(util.sendMessage(`Your cannot direct message this command`));
            });
            return;
        }

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

        if (gameStarted) {
            message.channel.send(util.sendMessage(`Cannot edit game: game has already started`));
            return
        }

        const args = util.getArgumentsAsArray(message);
        if (!(args.length === 1 && args[0] === ""))
            game.setValues(...util.stringArrayToNumberArray(args));

        message.channel.send(util.sendMessage(`Created Among Us Game:
        Max Number of Players: ${game.maxNumberOfPlayers}
        Number of Short Tasks: ${game.numberOfShortTasks}
        Number of Common Tasks: ${game.numberOfCommonTasks}
        Number of Long Tasks: ${game.numberOfLongTasks}
        Number of Moderators: ${game.numberOfModerators}
        Number of Imposters: ${game.numberOfImposters}`));
    }
});

commandCollection.push({
    command: "join",
    description: "Join the game.",
    isDMable: false,
    response: (client: Client, message: Message, isDM: boolean) => {
        if (isDM) {
            client.users.fetch(message.author.id).then((user: User) => {
                user.send(util.sendMessage(`Your cannot direct message this command`));
            });
            return;
        }

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

        if (gameStarted) {
            message.channel.send(util.sendMessage(`Cannot join game: game has already started`));
            return
        }

        const userTag: string = message.author.tag;
        const username: string = message.author.username;
        const userID: string = message.author.id;
        const nickname: string = message.member?.nickname ?? username;

        let alreadyJoined: boolean = false;
        game.players.some((player: Player) => {
            if (player.userTag === userTag) {
                // Player has already joined the game
                message.channel.send(util.sendMessage(`You have already joined the game ${player.nickname}`));
                alreadyJoined = true;
            }
        });

        if (alreadyJoined)
            return;

        let player: Player = {
            userTag: userTag,
            nickname: nickname,
            id: userID,
            role: roles.PLAYER,
            completedTasks: 0,
            dead: false,
            tasks: []
        }

        game.players.push(player);
        message.channel.send(util.sendMessage(`${player.nickname} has joined! [${game.players.length}/${game.maxNumberOfPlayers}]`));
    }
});

commandCollection.push({
    command: "leave",
    description: "Leave the current game.",
    isDMable: false,
    response: (client: Client, message: Message, isDM: boolean) => {
        if (isDM) {
            client.users.fetch(message.author.id).then((user: User) => {
                user.send(util.sendMessage(`Your cannot direct message this command`));
            });
            return;
        }

        if (game === null) {
            message.channel.send(util.sendMessage(`Cannot leave game: no game is active.`));
            message.channel.send(util.sendMessage(`Use ${prefix}create to create a new game.`));
            return;
        }

        if (gameStarted) {
            message.channel.send(util.sendMessage(`Cannot leave game: game has already started`));
            message.channel.send(util.sendMessage(`You wouldn't want to abandon your friends, would you?`));
            return
        }

        const userTag: string = message.author.tag;
        const username: string = message.author.username;
        const nickname: string = message.member?.nickname ?? username;
        let leftGame: boolean = false;
        game.players.forEach((player: Player, index: number) => {
            if (player.userTag === userTag) {
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
    description: "Stop the current game. Only the creator of the game can use this command.",
    isDMable: false,
    response: (client: Client, message: Message, isDM: boolean) => {
        if (isDM) {
            client.users.fetch(message.author.id).then((user: User) => {
                user.send(util.sendMessage(`Your cannot direct message this command`));
            });
            return;
        }

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
        gameStarted = false;
        message.channel.send(util.sendMessage(`Current Among Us game has been terminated.`));
    }
});

commandCollection.push({
    command: "mod",
    description: "Become a game moderator.",
    isDMable: false,
    response: (client: Client, message: Message, isDM: boolean) => {
        if (isDM) {
            client.users.fetch(message.author.id).then((user: User) => {
                user.send(util.sendMessage(`Your cannot direct message this command`));
            });
            return;
        }

        if (game === null) {
            message.channel.send(util.sendMessage(`Cannot join moderators: no game is active.`));
            message.channel.send(util.sendMessage(`Use ${prefix}create to create a new game.`));
            return;
        }

        if (gameStarted) {
            message.channel.send(util.sendMessage(`Cannot join moderators: game has already started`));
            return
        }

        const userTag: string = message.author.tag;
        const username: string = message.author.username;
        const nickname: string = message.member?.nickname ?? username;
        let playerJoined: boolean = false;
        game.players.forEach((player: Player) => {
            if (player.userTag === userTag)
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
            if (player.userTag === userTag) {
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
    description: "Start the game. Only the creator of the game can use this command.",
    isDMable: false,
    response: (client: Client, message: Message, isDM: boolean) => {
        if (isDM) {
            client.users.fetch(message.author.id).then((user: User) => {
                user.send(util.sendMessage(`Your cannot direct message this command`));
            });
            return;
        }

        if (game === null) {
            message.channel.send(util.sendMessage(`Cannot start game: no game is active.`));
            message.channel.send(util.sendMessage(`Use ${prefix}create to create a new game.`));
            return;
        }

        const userTag: string = message.author.tag;
        if (gameHost !== userTag) {
            message.channel.send(util.sendMessage(`Cannot start game: you are not the creator`));
            message.channel.send(util.sendMessage(`${gameHostName} has permission to start the game.`));
            return
        }

        if (gameStarted) {
            message.channel.send(util.sendMessage(`Cannot start game: game has already started`));
            return
        }

        const minimumPlayers: number = game!.numberOfImposters * 2 + game!.numberOfModerators;

        if (game!.players.length < minimumPlayers) {
            message.channel.send(util.sendMessage(`Cannot start game: minimum players needed: ${minimumPlayers}`));
            message.channel.send(util.sendMessage(`Currently have [${game.players.length}/${game.maxNumberOfPlayers}]`))
            return;
        }

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
                client.users.fetch(game.players[numbers[random]].id).then((user: User) => {
                    user.send(util.sendMessage(`You are a game moderator!`));
                    user.send(util.sendMessage(`Use the ${prefix}dead command to mark players as dead, this command must be used as a DM.`));
                    user.send(util.sendMessage(`Watch out for game alerts from the bot.`));
                });
                numbers.splice(random, 1); 
            }
            numbers = [];
        }
        else {
            game.players.forEach((player: Player) => {
                if (player.role === roles.MOD) {
                    client.users.fetch(player.id).then((user: User) => {
                        user.send(util.sendMessage(`You are a game moderator!`));
                        user.send(util.sendMessage(`Use the ${prefix}dead command to mark players as dead, this command must be used as a DM.`));
                        user.send(util.sendMessage(`Watch out for game alerts from the bot.`))
                    });
                }
            });
        }

        // Randomly choose IMPOSTERs
        game.players.forEach((player: Player, index: number) => {
            if (player.role != roles.MOD)
                numbers.push(index);
        })

        for (let i = 0; i < game.numberOfImposters; i++) {
            let random = Math.trunc(Math.random() * numbers.length)
            game.players[numbers[random]].role = roles.IMPOSTER;
            client.users.fetch(game.players[numbers[random]].id).then((user: User) => {
                user.send(util.sendMessage(`You are the imposter!`));
                if (game!.numberOfImposters === 1)
                    user.send(util.sendMessage(`You have no allies.`));
            });
            numbers.splice(random, 1);
        }

        if (game.numberOfImposters > 1) {
            game.players.forEach((player: Player) => {
                if (player.role === roles.IMPOSTER) {
                    let otherImposters: string[] = [];
                    game!.players.forEach((imposter: Player) => {
                        if (imposter.role === roles.IMPOSTER && imposter.userTag != player.userTag)
                            otherImposters.push(imposter.nickname);
                    })
                    client.users.fetch(player.id).then((user: User) => {
                        user.send(util.sendMessage(`Your imposter allies are: ${otherImposters}`));
                    });
                }
            });
        }
        gameStarted = true;
        message.channel.send(util.sendMessage(`The game has now started, good luck!`));

        // TODO: Assign players some tasks
        // Figure out a way to keep track of tasks
        // so they don't have to be re-added every time
    }
});

commandCollection.push({
    command: "done",
    description: "Mark a task as complete.",
    isDMable: false,
    response: (client: Client, message: Message, isDM: boolean) => {
        if (isDM) {
            client.users.fetch(message.author.id).then((user: User) => {
                user.send(util.sendMessage(`Your cannot direct message this command`));
            });
            return;
        }

        if (game === null) {
            message.channel.send(util.sendMessage(`Cannot finish task: no game is active.`));
            message.channel.send(util.sendMessage(`Use ${prefix}create to create a new game.`));
            return;
        }

        const totalTasks: number = game?.numberOfShortTasks! + game?.numberOfCommonTasks! + game?.numberOfLongTasks!;
        const userTag: string = message.author.tag;

        game.players.forEach((player: Player) => {
            if (player.userTag === userTag) {
                console.log(`${player.nickname} has ${player.completedTasks} completed tasks`)
                if (player.completedTasks === totalTasks && (player.role == roles.PLAYER || player.role == roles.IMPOSTER)) 
                    message.channel.send(util.sendMessage(`You have already completed all your tasks ${player.nickname}!`));
                else if (player.role == roles.PLAYER || player.role == roles.IMPOSTER)
                    message.channel.send(util.sendMessage(`${player.nickname} has finished [${++player.completedTasks}/${totalTasks}] tasks!`))
                if (player.role === roles.PLAYER) {
                    game!.finishedTasks++;
                    console.log(`FINISHED TASKS: ${game?.finishedTasks}`);
                    if (game!.finishedTasks === game!.totalTaskCount) {
                        // Game is over innocents win
                        game?.players.forEach((player: Player) => {
                            client.users.fetch(player.id).then((user: User) => {
                                user.send(util.sendMessage(`GAME IS OVER: Innocents Win!`))
                            });
                        });
                        message.channel.send(util.sendMessage(`GAME IS OVER: Innocents Win!`));
                        game = null;
                        gameStarted = false;
                    }
                }
                if (player.role === roles.MOD) {
                    message.channel.send(util.sendMessage(`You cannot finish tasks, you are a moderator.`));
                }
            }
        });
    }
});

commandCollection.push({
    command: "dead",
    description: "Mark players as dead. Only moderators and imposters can use this command.",
    isDMable: true,
    response: (client: Client, message: Message, isDM: boolean) => {
        if (!isDM) {
            client.users.fetch(message.author.id).then((user: User) => {
                user.send(util.sendMessage(`The ${prefix}dead command must be used as a DM.`));
            });
            message.channel.lastMessage!.delete();
            return;
        }

        const userTag: string = message.author.tag;

        if (game === null) {
            message.channel.send(util.sendMessage(`Cannot use command: no game is active.`));
            message.channel.send(util.sendMessage(`Use ${prefix}create to create a new game.`));
            return;
        }

        const args = util.getArgumentsAsArray(message);
        game.players.forEach((player: Player) => {
            if (player.userTag === userTag) {
                if (player.role === roles.PLAYER) {
                    message.channel.send(util.sendMessage(`You are not allowed to mark players as dead.`));
                    message.channel.send(util.sendMessage(`To report a dead body use the ${prefix}report command`))
                    return;
                }
                let gamePlayers: Player[];
                // gamePlayers doesn't include name of imposter that used the command
                if (player.role === roles.MOD) {
                    gamePlayers = game!.players.filter((gameP: Player) => {
                        return !gameP.dead && (gameP.role === roles.PLAYER || gameP.role === roles.IMPOSTER);
                    });
                }
                else {
                    gamePlayers = game!.players.filter((gameP: Player) => {
                        return !gameP.dead && gameP.userTag != player.userTag && (gameP.role === roles.PLAYER || gameP.role === roles.IMPOSTER);
                    });
                }
                if (args.length === 1 && args[0] === "") {
                    message.channel.send(util.sendMessage(`Use the ${prefix}dead command again with the number of the corresponding dead player`));
                    gamePlayers!.forEach((gameP: Player, index: number) => {
                        message.channel.send(util.sendMessage(`[${index}]: ${gameP.nickname}`));
                    });
                }
                else if (args.length === 1 && args[0] !== "" && gamePlayers.length > 0) {
                    // Set player as dead
                    const playerIndex: number = Number(args[0]);
                    const deadPlayer: Player = gamePlayers![playerIndex];
                    game!.players.forEach((gameP: Player) => {
                        if (gameP.userTag === deadPlayer.userTag) {
                            gameP.dead = true;
                            // Player is marked dead, check if game is over
                            let numberOfPlayers: number = 0;
                            let numberOfImposters: number = 0;
                            console.log(`Number of Players: ${numberOfPlayers}, Number of Imposters: ${numberOfImposters}`)
                            game!.players.forEach((gP: Player) => {
                                numberOfPlayers += (gP.role === roles.PLAYER && !gP.dead) ? 1 : 0;
                            });
                            game!.players.forEach((gP: Player) => {
                                numberOfImposters += (gP.role === roles.IMPOSTER && !gP.dead) ? 1 : 0;
                            });

                            if (player.role === roles.IMPOSTER) {
                                message.channel.send(util.sendMessage(`${gameP.nickname} has now been marked as dead.`));
                            }
                            game!.players.forEach((moderator: Player) => {
                                if (moderator.role === roles.MOD) {
                                    client.users.fetch(moderator.id).then((user: User) => {
                                        user.send(util.sendMessage(`${gameP.nickname} has now been marked as dead.`));
                                    });
                                }
                            });
                            
                            // Game is over
                            if (numberOfImposters >= numberOfPlayers || numberOfImposters === 0) {
                                game?.players.forEach((gP: Player) => {
                                    client.users.fetch(gP.id).then((user: User) => {
                                        user.send(util.sendMessage(`GAME IS OVER: Imposters win!`))
                                    });
                                });
                                gameChannel.send(util.sendMessage(`GAME IS OVER: Imposters win!`));
                            }
                        }
                    });
                }
                else {
                    message.channel.send(`Command used improperly! Use ${prefix}dead [number] for the corresponding player`)
                }
            }
        });
    }
});

commandCollection.push({
    command: "report",
    description: "Report a dead body",
    isDMable: false,
    response: (client: Client, message: Message, isDM: boolean) => {
        if (isDM) {
            client.users.fetch(message.author.id).then((user: User) => {
                user.send(util.sendMessage(`Your cannot direct message this command`));
            });
            return;
        }

        if (game === null) {
            message.channel.send(util.sendMessage(`Cannot report a body: no game is active.`));
            message.channel.send(util.sendMessage(`Use ${prefix}create to create a new game.`));
            return;
        }
        game!.players.forEach((player: Player) => {
            client.users.fetch(player.id).then((user: User) => {
                user.send(util.sendMessage(`A BODY HAS BEEN REPORTED!`));
                user.send(util.sendMessage(`STOP WHAT YOU'RE DOING AND GO TO THE MEETING AREA`));
            });
        });
        message.channel.send(util.sendMessage(`A BODY HAS BEEN REPORTED!`));
        message.channel.send(util.sendMessage(`STOP WHAT YOU'RE DOING AND GO TO THE MEETING AREA`));
    }
});

commandCollection.push({
    command: "meeting",
    description: "Call an emergency meeting",
    isDMable: false,
    response: (client: Client, message: Message, isDM: boolean) => {
        if (isDM) {
            client.users.fetch(message.author.id).then((user: User) => {
                user.send(util.sendMessage(`Your cannot direct message this command`));
            });
            return;
        }

        if (game === null) {
            message.channel.send(util.sendMessage(`Cannot call a meeting: no game is active.`));
            message.channel.send(util.sendMessage(`Use ${prefix}create to create a new game.`));
            return;
        }
        game!.players.forEach((player: Player) => {
            client.users.fetch(player.id).then((user: User) => {
                user.send(util.sendMessage(`AN EMERGENCY MEETING HAS BEEN CALLED!`));
                user.send(util.sendMessage(`STOP WHAT YOU'RE DOING AND GO TO THE MEETING AREA`));
            });
        });
        message.channel.send(util.sendMessage(`AN EMERGENCY MEETING HAS BEEN CALLED!`));
        message.channel.send(util.sendMessage(`STOP WHAT YOU'RE DOING AND GO TO THE MEETING AREA`));
        
    }
});

commandCollection.push({
    command: "help",
    description: "List all available commands",
    isDMable: true,
    response: (client: Client, message: Message, isDM: boolean) => {
        commandCollection.forEach((command: Command, index: number) => {
            message.channel.send(util.sendMessage(`**${prefix}${command.command}:** ${command.description}\n`, false));
        });
    }
});