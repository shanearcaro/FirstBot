"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomTasks = exports.roles = exports.taskLength = exports.AmongUs = void 0;
var gameTasks = require("../tasks/task");
var taskList;
var AmongUs = /** @class */ (function () {
    function AmongUs(maxNumberOfPlayers, numberOfShortTasks, numberOfCommonTasks, numberOfLongTasks, numberOfModerators, numberOfImposters) {
        if (maxNumberOfPlayers === void 0) { maxNumberOfPlayers = GAME_DEFAULTS.MAXPLAYERS; }
        if (numberOfShortTasks === void 0) { numberOfShortTasks = GAME_DEFAULTS.SHORTTASKS; }
        if (numberOfCommonTasks === void 0) { numberOfCommonTasks = GAME_DEFAULTS.COMMONTASKS; }
        if (numberOfLongTasks === void 0) { numberOfLongTasks = GAME_DEFAULTS.LONGTASKS; }
        if (numberOfModerators === void 0) { numberOfModerators = GAME_DEFAULTS.MODERATORS; }
        if (numberOfImposters === void 0) { numberOfImposters = GAME_DEFAULTS.IMPOSTERS; }
        this.maxNumberOfPlayers = maxNumberOfPlayers;
        this.numberOfShortTasks = numberOfShortTasks;
        this.numberOfCommonTasks = numberOfCommonTasks;
        this.numberOfLongTasks = numberOfLongTasks;
        this.numberOfModerators = numberOfModerators;
        this.numberOfImposters = numberOfImposters;
        this.players = [];
        this.currentMods = 0;
        this.killedPlayers = 0;
        this.finishedTasks = 0;
        this.totalTaskCount = 0;
        this.checkProblems();
        taskList = getTasks();
    }
    // Set 
    AmongUs.prototype.setValues = function (maxNumberOfPlayers, numberOfShortTasks, numberOfCommonTasks, numberOfLongTasks, numberOfModerators, numberOfImpostors) {
        this.maxNumberOfPlayers = maxNumberOfPlayers !== null && maxNumberOfPlayers !== void 0 ? maxNumberOfPlayers : this.maxNumberOfPlayers;
        this.numberOfShortTasks = numberOfShortTasks !== null && numberOfShortTasks !== void 0 ? numberOfShortTasks : this.numberOfShortTasks;
        this.numberOfCommonTasks = numberOfCommonTasks !== null && numberOfCommonTasks !== void 0 ? numberOfCommonTasks : this.numberOfCommonTasks;
        this.numberOfLongTasks = numberOfLongTasks !== null && numberOfLongTasks !== void 0 ? numberOfLongTasks : this.numberOfLongTasks;
        this.numberOfModerators = numberOfModerators !== null && numberOfModerators !== void 0 ? numberOfModerators : this.numberOfModerators;
        this.numberOfImposters = numberOfImpostors !== null && numberOfImpostors !== void 0 ? numberOfImpostors : this.numberOfImposters;
        this.checkProblems();
        this.calculateTaskCount();
    };
    AmongUs.prototype.checkProblems = function () {
        if (this.maxNumberOfPlayers < 0)
            this.maxNumberOfPlayers = GAME_DEFAULTS.MAXPLAYERS;
        if (this.numberOfShortTasks < 0)
            this.numberOfShortTasks = GAME_DEFAULTS.SHORTTASKS;
        if (this.numberOfCommonTasks < 0)
            this.numberOfCommonTasks = GAME_DEFAULTS.COMMONTASKS;
        if (this.numberOfLongTasks < 0)
            this.numberOfLongTasks = GAME_DEFAULTS.LONGTASKS;
        if (this.numberOfModerators < 0)
            this.numberOfModerators = GAME_DEFAULTS.MODERATORS;
        if (this.numberOfImposters < 0)
            this.numberOfImposters = GAME_DEFAULTS.IMPOSTERS;
        this.calculateTaskCount();
    };
    AmongUs.prototype.calculateTaskCount = function () {
        var playerCount = this.maxNumberOfPlayers - this.numberOfImposters - this.numberOfModerators;
        var taskCount = this.numberOfShortTasks + this.numberOfCommonTasks + this.numberOfLongTasks;
        this.totalTaskCount = playerCount * taskCount;
    };
    return AmongUs;
}());
exports.AmongUs = AmongUs;
var taskLength;
(function (taskLength) {
    taskLength[taskLength["SHORT"] = 0] = "SHORT";
    taskLength[taskLength["COMMON"] = 1] = "COMMON";
    taskLength[taskLength["LONG"] = 2] = "LONG";
})(taskLength = exports.taskLength || (exports.taskLength = {}));
;
var GAME_DEFAULTS;
(function (GAME_DEFAULTS) {
    GAME_DEFAULTS[GAME_DEFAULTS["MAXPLAYERS"] = 10] = "MAXPLAYERS";
    GAME_DEFAULTS[GAME_DEFAULTS["SHORTTASKS"] = 3] = "SHORTTASKS";
    GAME_DEFAULTS[GAME_DEFAULTS["COMMONTASKS"] = 2] = "COMMONTASKS";
    GAME_DEFAULTS[GAME_DEFAULTS["LONGTASKS"] = 1] = "LONGTASKS";
    GAME_DEFAULTS[GAME_DEFAULTS["MODERATORS"] = 1] = "MODERATORS";
    GAME_DEFAULTS[GAME_DEFAULTS["IMPOSTERS"] = 2] = "IMPOSTERS";
})(GAME_DEFAULTS || (GAME_DEFAULTS = {}));
;
var roles;
(function (roles) {
    roles[roles["PLAYER"] = 0] = "PLAYER";
    roles[roles["IMPOSTER"] = 1] = "IMPOSTER";
    roles[roles["MOD"] = 2] = "MOD";
})(roles = exports.roles || (exports.roles = {}));
;
function createTask(name, description, room, duration) {
    return {
        name: name,
        description: description,
        room: room,
        duration: duration
    };
}
function convertTask(length) {
    if (length === "SHORT")
        return taskLength.SHORT;
    else if (length === "COMMON")
        return taskLength.COMMON;
    return taskLength.LONG;
}
function getTasks() {
    var tasks = [];
    for (var i in gameTasks) {
        var task = createTask(gameTasks[i].name, gameTasks[i].description, gameTasks[i].room, convertTask(gameTasks[i].duration));
        tasks.push(task);
    }
    return tasks;
}
function randomTasks(amount, duration) {
    var randTasks = [];
    var tasks = taskList.filter(function (task) {
        task.duration = duration;
    });
    if (amount > tasks.length)
        return null;
    for (var i = 0; i < amount; i++) {
        var random = Math.trunc(Math.random() * tasks.length);
        randTasks.push(tasks[random]);
        tasks.splice(random, 1);
    }
    return randTasks;
}
exports.randomTasks = randomTasks;
