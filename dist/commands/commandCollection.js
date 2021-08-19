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
var amongus_1 = require("../amongus");
var util = __importStar(require("../utils"));
var prefix = require("../config").prefix;
exports.commandCollection = [];
var game = null;
var gameHost = "";
var gameHostName = "";
var gameStarted = false;
var gameChannel;
// Shutdown command
exports.commandCollection.push({
    command: "shutdown",
    description: "Shut down the bot",
    isDMable: false,
    response: function (client, message, isDM) {
        var _a;
        message.channel.send("User " + ((_a = client.user) === null || _a === void 0 ? void 0 : _a.tag) + " is shutting down.");
        client.destroy();
    }
});
// === In Person Among Us Commands Below ===
exports.commandCollection.push({
    command: "create",
    description: "Create an Among Us Game",
    isDMable: false,
    response: function (client, message, isDM) {
        if (isDM) {
            client.users.fetch(message.author.id).then(function (user) {
                user.send(util.sendMessage("Your cannot direct message this command"));
            });
            return;
        }
        // Check if game exists
        if (game !== null) {
            message.channel.send(util.sendMessage("A game has already been created"));
            message.channel.send(util.sendMessage("Use " + prefix + "stop to end the current game."));
            return;
        }
        game = new amongus_1.AmongUs();
        gameChannel = message.channel;
        var args = util.getArgumentsAsArray(message);
        if (!(args.length === 1 && args[0] === ""))
            game.setValues.apply(game, util.stringArrayToNumberArray(args));
        gameHost = message.author.tag;
        gameHostName = message.author.username;
        message.channel.send(util.sendMessage("Created Among Us Game:\n        Max Number of Players: " + game.maxNumberOfPlayers + "\n        Number of Short Tasks: " + game.numberOfShortTasks + "\n        Number of Common Tasks: " + game.numberOfCommonTasks + "\n        Number of Long Tasks: " + game.numberOfLongTasks + "\n        Number of Moderators: " + game.numberOfModerators + "\n        Number of Imposters: " + game.numberOfImposters));
        message.channel.send(util.sendMessage("Type " + prefix + "join to join now"));
        message.channel.send(util.sendMessage("Use " + prefix + "help for a list of available commands."));
    }
});
exports.commandCollection.push({
    command: "edit",
    description: "Edit game settings. Only the creator of the game can use this command.",
    isDMable: false,
    response: function (client, message, isDM) {
        if (isDM) {
            client.users.fetch(message.author.id).then(function (user) {
                user.send(util.sendMessage("Your cannot direct message this command"));
            });
            return;
        }
        // Check if game exists
        if (game === null) {
            message.channel.send(util.sendMessage("Cannot change values: no game is active"));
            message.channel.send(util.sendMessage("Use " + prefix + "create to create a new game."));
            return;
        }
        var userTag = message.author.tag;
        if (gameHost !== userTag) {
            message.channel.send(util.sendMessage("Cannot edit game: you are not the creator"));
            message.channel.send(util.sendMessage(gameHostName + " has permission to edit the game."));
            return;
        }
        if (gameStarted) {
            message.channel.send(util.sendMessage("Cannot edit game: game has already started"));
            return;
        }
        var args = util.getArgumentsAsArray(message);
        if (!(args.length === 1 && args[0] === ""))
            game.setValues.apply(game, util.stringArrayToNumberArray(args));
        message.channel.send(util.sendMessage("Created Among Us Game:\n        Max Number of Players: " + game.maxNumberOfPlayers + "\n        Number of Short Tasks: " + game.numberOfShortTasks + "\n        Number of Common Tasks: " + game.numberOfCommonTasks + "\n        Number of Long Tasks: " + game.numberOfLongTasks + "\n        Number of Moderators: " + game.numberOfModerators + "\n        Number of Imposters: " + game.numberOfImposters));
    }
});
exports.commandCollection.push({
    command: "join",
    description: "Join the game.",
    isDMable: false,
    response: function (client, message, isDM) {
        var _a, _b;
        if (isDM) {
            client.users.fetch(message.author.id).then(function (user) {
                user.send(util.sendMessage("Your cannot direct message this command"));
            });
            return;
        }
        // Check if game exists
        if (game === null) {
            message.channel.send(util.sendMessage("Cannot join game: no game is active."));
            message.channel.send(util.sendMessage("Use " + prefix + "create to create a new game."));
            return;
        }
        // Check if players are allowed to join
        if (game.players.length === game.maxNumberOfPlayers) {
            message.channel.send(util.sendMessage("Max number of players reached!"));
            message.channel.send(util.sendMessage("Either change the maximum number of players allowed or sit out for now."));
            return;
        }
        if (gameStarted) {
            message.channel.send(util.sendMessage("Cannot join game: game has already started"));
            return;
        }
        var userTag = message.author.tag;
        var username = message.author.username;
        var userID = message.author.id;
        var nickname = (_b = (_a = message.member) === null || _a === void 0 ? void 0 : _a.nickname) !== null && _b !== void 0 ? _b : username;
        var alreadyJoined = false;
        game.players.some(function (player) {
            if (player.userTag === userTag) {
                // Player has already joined the game
                message.channel.send(util.sendMessage("You have already joined the game " + player.nickname));
                alreadyJoined = true;
            }
        });
        if (alreadyJoined)
            return;
        var player = {
            userTag: userTag,
            nickname: nickname,
            id: userID,
            role: amongus_1.roles.PLAYER,
            completedTasks: 0,
            dead: false,
            tasks: []
        };
        game.players.push(player);
        message.channel.send(util.sendMessage(player.nickname + " has joined! [" + game.players.length + "/" + game.maxNumberOfPlayers + "]"));
    }
});
exports.commandCollection.push({
    command: "leave",
    description: "Leave the current game.",
    isDMable: false,
    response: function (client, message, isDM) {
        var _a, _b;
        if (isDM) {
            client.users.fetch(message.author.id).then(function (user) {
                user.send(util.sendMessage("Your cannot direct message this command"));
            });
            return;
        }
        if (game === null) {
            message.channel.send(util.sendMessage("Cannot leave game: no game is active."));
            message.channel.send(util.sendMessage("Use " + prefix + "create to create a new game."));
            return;
        }
        if (gameStarted) {
            message.channel.send(util.sendMessage("Cannot leave game: game has already started"));
            message.channel.send(util.sendMessage("You wouldn't want to abandon your friends, would you?"));
            return;
        }
        var userTag = message.author.tag;
        var username = message.author.username;
        var nickname = (_b = (_a = message.member) === null || _a === void 0 ? void 0 : _a.nickname) !== null && _b !== void 0 ? _b : username;
        var leftGame = false;
        game.players.forEach(function (player, index) {
            if (player.userTag === userTag) {
                game.players.splice(index, 1);
                leftGame = true;
                // If player is a mod decrease the count
                if (player.role === amongus_1.roles.MOD)
                    game.currentMods -= 1;
            }
        });
        if (leftGame)
            message.channel.send(util.sendMessage(nickname + " has left! [" + game.players.length + "/" + game.maxNumberOfPlayers + "]"));
        else
            message.channel.send(util.sendMessage("You are not currently in the game " + nickname + "!"));
    }
});
exports.commandCollection.push({
    command: "stop",
    description: "Stop the current game. Only the creator of the game can use this command.",
    isDMable: false,
    response: function (client, message, isDM) {
        if (isDM) {
            client.users.fetch(message.author.id).then(function (user) {
                user.send(util.sendMessage("Your cannot direct message this command"));
            });
            return;
        }
        if (game === null) {
            message.channel.send(util.sendMessage("Cannot stop game: no game is active."));
            message.channel.send(util.sendMessage("Use " + prefix + "create to create a new game."));
            return;
        }
        var userTag = message.author.tag;
        if (gameHost !== userTag) {
            message.channel.send(util.sendMessage("Cannot stop game: you are not the creator"));
            message.channel.send(util.sendMessage(gameHostName + " has permission to stop the game."));
            return;
        }
        game = null;
        gameStarted = false;
        message.channel.send(util.sendMessage("Current Among Us game has been terminated."));
    }
});
exports.commandCollection.push({
    command: "mod",
    description: "Become a game moderator.",
    isDMable: false,
    response: function (client, message, isDM) {
        var _a, _b;
        if (isDM) {
            client.users.fetch(message.author.id).then(function (user) {
                user.send(util.sendMessage("Your cannot direct message this command"));
            });
            return;
        }
        if (game === null) {
            message.channel.send(util.sendMessage("Cannot join moderators: no game is active."));
            message.channel.send(util.sendMessage("Use " + prefix + "create to create a new game."));
            return;
        }
        if (gameStarted) {
            message.channel.send(util.sendMessage("Cannot join moderators: game has already started"));
            return;
        }
        var userTag = message.author.tag;
        var username = message.author.username;
        var nickname = (_b = (_a = message.member) === null || _a === void 0 ? void 0 : _a.nickname) !== null && _b !== void 0 ? _b : username;
        var playerJoined = false;
        game.players.forEach(function (player) {
            if (player.userTag === userTag)
                playerJoined = true;
        });
        // If player isn't in the game, can't join as moderator
        if (!playerJoined) {
            message.channel.send(util.sendMessage("You are not apart of the game " + nickname));
            message.channel.send(util.sendMessage("Use " + prefix + "join to join now"));
            return;
        }
        // If max number of moderators is reached, can't join moderator
        if (game.currentMods === game.numberOfModerators) {
            message.channel.send(util.sendMessage("Cannot join moderators: limit reached."));
            return;
        }
        // If player is already a moderator
        var alreadyMod = false;
        game.players.forEach(function (player) {
            if (player.userTag === userTag) {
                if (player.role === amongus_1.roles.MOD)
                    alreadyMod = true;
                else {
                    player.role = amongus_1.roles.MOD;
                    game.currentMods += 1;
                }
            }
        });
        if (alreadyMod) {
            message.channel.send(util.sendMessage("Cannot join moderators: already a moderator."));
            return;
        }
        message.channel.send(util.sendMessage(nickname + " is now a MODERATOR!"));
    }
});
exports.commandCollection.push({
    command: "start",
    description: "Start the game. Only the creator of the game can use this command.",
    isDMable: false,
    response: function (client, message, isDM) {
        if (isDM) {
            client.users.fetch(message.author.id).then(function (user) {
                user.send(util.sendMessage("Your cannot direct message this command"));
            });
            return;
        }
        if (game === null) {
            message.channel.send(util.sendMessage("Cannot start game: no game is active."));
            message.channel.send(util.sendMessage("Use " + prefix + "create to create a new game."));
            return;
        }
        var userTag = message.author.tag;
        if (gameHost !== userTag) {
            message.channel.send(util.sendMessage("Cannot start game: you are not the creator"));
            message.channel.send(util.sendMessage(gameHostName + " has permission to start the game."));
            return;
        }
        if (gameStarted) {
            message.channel.send(util.sendMessage("Cannot start game: game has already started"));
            return;
        }
        var minimumPlayers = game.numberOfImposters * 2 + game.numberOfModerators;
        if (game.players.length < minimumPlayers) {
            message.channel.send(util.sendMessage("Cannot start game: minimum players needed: " + minimumPlayers));
            message.channel.send(util.sendMessage("Currently have [" + game.players.length + "/" + game.maxNumberOfPlayers + "]"));
            return;
        }
        var numbers = [];
        // Randomly choose moderators
        if (game.currentMods != game.numberOfModerators) {
            game.players.forEach(function (player, index) {
                numbers.push(index);
            });
            for (var i = 0; i < game.numberOfModerators; i++) {
                var random = Math.trunc(Math.random() * numbers.length);
                game.players[numbers[random]].role = amongus_1.roles.MOD;
                message.channel.send(util.sendMessage(game.players[numbers[random]].nickname + " has been picked as a morderator."));
                client.users.fetch(game.players[numbers[random]].id).then(function (user) {
                    user.send(util.sendMessage("You are a game moderator!"));
                    user.send(util.sendMessage("Use the " + prefix + "dead command to mark players as dead, this command must be used as a DM."));
                    user.send(util.sendMessage("Watch out for game alerts from the bot."));
                });
                numbers.splice(random, 1);
            }
            numbers = [];
        }
        else {
            game.players.forEach(function (player) {
                if (player.role === amongus_1.roles.MOD) {
                    client.users.fetch(player.id).then(function (user) {
                        user.send(util.sendMessage("You are a game moderator!"));
                        user.send(util.sendMessage("Use the " + prefix + "dead command to mark players as dead, this command must be used as a DM."));
                        user.send(util.sendMessage("Watch out for game alerts from the bot."));
                    });
                }
            });
        }
        // Randomly choose IMPOSTERs
        game.players.forEach(function (player, index) {
            if (player.role != amongus_1.roles.MOD)
                numbers.push(index);
        });
        for (var i = 0; i < game.numberOfImposters; i++) {
            var random = Math.trunc(Math.random() * numbers.length);
            game.players[numbers[random]].role = amongus_1.roles.IMPOSTER;
            client.users.fetch(game.players[numbers[random]].id).then(function (user) {
                user.send(util.sendMessage("You are the imposter!"));
                if (game.numberOfImposters === 1)
                    user.send(util.sendMessage("You have no allies."));
            });
            numbers.splice(random, 1);
        }
        if (game.numberOfImposters > 1) {
            game.players.forEach(function (player) {
                if (player.role === amongus_1.roles.IMPOSTER) {
                    var otherImposters_1 = [];
                    game.players.forEach(function (imposter) {
                        if (imposter.role === amongus_1.roles.IMPOSTER && imposter.userTag != player.userTag)
                            otherImposters_1.push(imposter.nickname);
                    });
                    client.users.fetch(player.id).then(function (user) {
                        user.send(util.sendMessage("Your imposter allies are: " + otherImposters_1));
                    });
                }
            });
        }
        gameStarted = true;
        message.channel.send(util.sendMessage("The game has now started, good luck!"));
        // TODO: Assign players some tasks
        // Figure out a way to keep track of tasks
        // so they don't have to be re-added every time
    }
});
exports.commandCollection.push({
    command: "done",
    description: "Mark a task as complete.",
    isDMable: false,
    response: function (client, message, isDM) {
        if (isDM) {
            client.users.fetch(message.author.id).then(function (user) {
                user.send(util.sendMessage("Your cannot direct message this command"));
            });
            return;
        }
        if (game === null) {
            message.channel.send(util.sendMessage("Cannot finish task: no game is active."));
            message.channel.send(util.sendMessage("Use " + prefix + "create to create a new game."));
            return;
        }
        var totalTasks = (game === null || game === void 0 ? void 0 : game.numberOfShortTasks) + (game === null || game === void 0 ? void 0 : game.numberOfCommonTasks) + (game === null || game === void 0 ? void 0 : game.numberOfLongTasks);
        var userTag = message.author.tag;
        game.players.forEach(function (player) {
            if (player.userTag === userTag) {
                console.log(player.nickname + " has " + player.completedTasks + " completed tasks");
                if (player.completedTasks === totalTasks && (player.role == amongus_1.roles.PLAYER || player.role == amongus_1.roles.IMPOSTER))
                    message.channel.send(util.sendMessage("You have already completed all your tasks " + player.nickname + "!"));
                else if (player.role == amongus_1.roles.PLAYER || player.role == amongus_1.roles.IMPOSTER)
                    message.channel.send(util.sendMessage(player.nickname + " has finished [" + ++player.completedTasks + "/" + totalTasks + "] tasks!"));
                if (player.role === amongus_1.roles.PLAYER) {
                    game.finishedTasks++;
                    console.log("FINISHED TASKS: " + (game === null || game === void 0 ? void 0 : game.finishedTasks));
                    if (game.finishedTasks === game.totalTaskCount) {
                        // Game is over innocents win
                        game === null || game === void 0 ? void 0 : game.players.forEach(function (player) {
                            client.users.fetch(player.id).then(function (user) {
                                user.send(util.sendMessage("GAME IS OVER: Innocents Win!"));
                            });
                        });
                        message.channel.send(util.sendMessage("GAME IS OVER: Innocents Win!"));
                        game = null;
                        gameStarted = false;
                    }
                }
                if (player.role === amongus_1.roles.MOD) {
                    message.channel.send(util.sendMessage("You cannot finish tasks, you are a moderator."));
                }
            }
        });
    }
});
exports.commandCollection.push({
    command: "dead",
    description: "Mark players as dead. Only moderators and imposters can use this command.",
    isDMable: true,
    response: function (client, message, isDM) {
        if (!isDM) {
            client.users.fetch(message.author.id).then(function (user) {
                user.send(util.sendMessage("The " + prefix + "dead command must be used as a DM."));
            });
            message.channel.lastMessage.delete();
            return;
        }
        var userTag = message.author.tag;
        if (game === null) {
            message.channel.send(util.sendMessage("Cannot use command: no game is active."));
            message.channel.send(util.sendMessage("Use " + prefix + "create to create a new game."));
            return;
        }
        var args = util.getArgumentsAsArray(message);
        game.players.forEach(function (player) {
            if (player.userTag === userTag) {
                if (player.role === amongus_1.roles.PLAYER) {
                    message.channel.send(util.sendMessage("You are not allowed to mark players as dead."));
                    message.channel.send(util.sendMessage("To report a dead body use the " + prefix + "report command"));
                    return;
                }
                var gamePlayers = void 0;
                // gamePlayers doesn't include name of imposter that used the command
                if (player.role === amongus_1.roles.MOD) {
                    gamePlayers = game.players.filter(function (gameP) {
                        return !gameP.dead && (gameP.role === amongus_1.roles.PLAYER || gameP.role === amongus_1.roles.IMPOSTER);
                    });
                }
                else {
                    gamePlayers = game.players.filter(function (gameP) {
                        return !gameP.dead && gameP.userTag != player.userTag && (gameP.role === amongus_1.roles.PLAYER || gameP.role === amongus_1.roles.IMPOSTER);
                    });
                }
                if (args.length === 1 && args[0] === "") {
                    message.channel.send(util.sendMessage("Use the " + prefix + "dead command again with the number of the corresponding dead player"));
                    gamePlayers.forEach(function (gameP, index) {
                        message.channel.send(util.sendMessage("[" + index + "]: " + gameP.nickname));
                    });
                }
                else if (args.length === 1 && args[0] !== "" && gamePlayers.length > 0) {
                    // Set player as dead
                    var playerIndex = Number(args[0]);
                    var deadPlayer_1 = gamePlayers[playerIndex];
                    game.players.forEach(function (gameP) {
                        if (gameP.userTag === deadPlayer_1.userTag) {
                            gameP.dead = true;
                            // Player is marked dead, check if game is over
                            var numberOfPlayers_1 = 0;
                            var numberOfImposters_1 = 0;
                            console.log("Number of Players: " + numberOfPlayers_1 + ", Number of Imposters: " + numberOfImposters_1);
                            game.players.forEach(function (gP) {
                                numberOfPlayers_1 += (gP.role === amongus_1.roles.PLAYER && !gP.dead) ? 1 : 0;
                            });
                            game.players.forEach(function (gP) {
                                numberOfImposters_1 += (gP.role === amongus_1.roles.IMPOSTER && !gP.dead) ? 1 : 0;
                            });
                            if (player.role === amongus_1.roles.IMPOSTER) {
                                message.channel.send(util.sendMessage(gameP.nickname + " has now been marked as dead."));
                            }
                            game.players.forEach(function (moderator) {
                                if (moderator.role === amongus_1.roles.MOD) {
                                    client.users.fetch(moderator.id).then(function (user) {
                                        user.send(util.sendMessage(gameP.nickname + " has now been marked as dead."));
                                    });
                                }
                            });
                            // Game is over
                            if (numberOfImposters_1 >= numberOfPlayers_1 || numberOfImposters_1 === 0) {
                                game === null || game === void 0 ? void 0 : game.players.forEach(function (gP) {
                                    client.users.fetch(gP.id).then(function (user) {
                                        user.send(util.sendMessage("GAME IS OVER: Imposters win!"));
                                    });
                                });
                                gameChannel.send(util.sendMessage("GAME IS OVER: Imposters win!"));
                            }
                        }
                    });
                }
                else {
                    message.channel.send("Command used improperly! Use " + prefix + "dead [number] for the corresponding player");
                }
            }
        });
    }
});
exports.commandCollection.push({
    command: "report",
    description: "Report a dead body",
    isDMable: false,
    response: function (client, message, isDM) {
        if (isDM) {
            client.users.fetch(message.author.id).then(function (user) {
                user.send(util.sendMessage("Your cannot direct message this command"));
            });
            return;
        }
        if (game === null) {
            message.channel.send(util.sendMessage("Cannot report a body: no game is active."));
            message.channel.send(util.sendMessage("Use " + prefix + "create to create a new game."));
            return;
        }
        game.players.forEach(function (player) {
            client.users.fetch(player.id).then(function (user) {
                user.send(util.sendMessage("A BODY HAS BEEN REPORTED!"));
                user.send(util.sendMessage("STOP WHAT YOU'RE DOING AND GO TO THE MEETING AREA"));
            });
        });
        message.channel.send(util.sendMessage("A BODY HAS BEEN REPORTED!"));
        message.channel.send(util.sendMessage("STOP WHAT YOU'RE DOING AND GO TO THE MEETING AREA"));
    }
});
exports.commandCollection.push({
    command: "meeting",
    description: "Call an emergency meeting",
    isDMable: false,
    response: function (client, message, isDM) {
        if (isDM) {
            client.users.fetch(message.author.id).then(function (user) {
                user.send(util.sendMessage("Your cannot direct message this command"));
            });
            return;
        }
        if (game === null) {
            message.channel.send(util.sendMessage("Cannot call a meeting: no game is active."));
            message.channel.send(util.sendMessage("Use " + prefix + "create to create a new game."));
            return;
        }
        game.players.forEach(function (player) {
            client.users.fetch(player.id).then(function (user) {
                user.send(util.sendMessage("AN EMERGENCY MEETING HAS BEEN CALLED!"));
                user.send(util.sendMessage("STOP WHAT YOU'RE DOING AND GO TO THE MEETING AREA"));
            });
        });
        message.channel.send(util.sendMessage("AN EMERGENCY MEETING HAS BEEN CALLED!"));
        message.channel.send(util.sendMessage("STOP WHAT YOU'RE DOING AND GO TO THE MEETING AREA"));
    }
});
exports.commandCollection.push({
    command: "help",
    description: "List all available commands",
    isDMable: true,
    response: function (client, message, isDM) {
        exports.commandCollection.forEach(function (command, index) {
            message.channel.send(util.sendMessage("**" + prefix + command.command + ":** " + command.description + "\n", false));
        });
    }
});
