const gameTasks = require("../tasks/task");
let taskList: Task[];

export class AmongUs {
    public players: Player[] = [];
    public currentMods: number = 0;
    public killedPlayers: number = 0;
    public finishedTasks: number = 0;
    public totalTaskCount: number = 0;
    public constructor(public maxNumberOfPlayers: number = GAME_DEFAULTS.MAXPLAYERS, public numberOfShortTasks: number = GAME_DEFAULTS.SHORTTASKS, 
        public numberOfCommonTasks: number = GAME_DEFAULTS.COMMONTASKS, public numberOfLongTasks: number = GAME_DEFAULTS.LONGTASKS, 
        public numberOfModerators: number = GAME_DEFAULTS.MODERATORS, public numberOfImposters: number = GAME_DEFAULTS.IMPOSTERS) {
            this.checkProblems();
            taskList = getTasks();
    }

    // Set 
    setValues(maxNumberOfPlayers?: number, numberOfShortTasks?: number, numberOfCommonTasks?: number, numberOfLongTasks?: number, 
        numberOfModerators?: number, numberOfImpostors?: number): void {
            this.maxNumberOfPlayers = maxNumberOfPlayers ?? this.maxNumberOfPlayers;
            this.numberOfShortTasks = numberOfShortTasks ?? this.numberOfShortTasks;
            this.numberOfCommonTasks = numberOfCommonTasks ?? this.numberOfCommonTasks;
            this.numberOfLongTasks = numberOfLongTasks ?? this.numberOfLongTasks;
            this.numberOfModerators = numberOfModerators ?? this.numberOfModerators;
            this.numberOfImposters = numberOfImpostors ?? this.numberOfImposters;
            this.checkProblems();
            this.calculateTaskCount();
    }

    checkProblems(): void {
        if (this.maxNumberOfPlayers < 0) this.maxNumberOfPlayers = GAME_DEFAULTS.MAXPLAYERS;
        if (this.numberOfShortTasks < 0) this.numberOfShortTasks = GAME_DEFAULTS.SHORTTASKS;
        if (this.numberOfCommonTasks < 0) this.numberOfCommonTasks = GAME_DEFAULTS.COMMONTASKS;
        if (this.numberOfLongTasks < 0) this.numberOfLongTasks = GAME_DEFAULTS.LONGTASKS;
        if (this.numberOfModerators < 0) this.numberOfModerators = GAME_DEFAULTS.MODERATORS;
        if (this.numberOfImposters < 0) this.numberOfImposters = GAME_DEFAULTS.IMPOSTERS;
        this.calculateTaskCount();
    }

    calculateTaskCount(): void {
        let playerCount = this.maxNumberOfPlayers - this.numberOfImposters - this.numberOfModerators;
        let taskCount = this.numberOfShortTasks + this.numberOfCommonTasks + this.numberOfLongTasks;

        this.totalTaskCount = playerCount * taskCount;
    }
}

export type Player = {
    userTag: string,
    nickname: string,
    id: string,
    role: roles,
    completedTasks: number,
    dead: boolean,
    tasks: Task[],
}

export type Task = {
    name: string,
    description: string,
    room: string,
    duration: taskLength
}

export enum taskLength { SHORT, COMMON, LONG };
enum GAME_DEFAULTS { MAXPLAYERS = 10, SHORTTASKS = 3, COMMONTASKS = 2, LONGTASKS = 1, MODERATORS = 1, IMPOSTERS = 2 };
export enum roles { PLAYER, IMPOSTER, MOD }; 

function createTask(name: string, description: string, room: string, duration: taskLength): Task {
    return {
        name: name,
        description: description,
        room: room,
        duration: duration
    }
}

function convertTask(length: string): taskLength {
    if (length === "SHORT")
        return taskLength.SHORT;
    else if (length === "COMMON")
        return taskLength.COMMON;
    return taskLength.LONG;
}

function getTasks(): Task[] {
    let tasks: Task[] = [];
    for (let i in gameTasks) {
        let task = createTask(gameTasks[i].name, gameTasks[i].description, gameTasks[i].room, convertTask(gameTasks[i].duration));
        tasks.push(task);
    }
    return tasks;
}

export function randomTasks(amount: number, duration: taskLength): Task[] | null {
    let randTasks: Task[] = [];
    let tasks: Task[] = taskList.filter((task: Task) => {
        task.duration = duration;
    });

    if (amount > tasks.length)
        return null;

    for (let i = 0; i < amount; i++) {
        let random = Math.trunc(Math.random() * tasks.length);
        randTasks.push(tasks[random]);
        tasks.splice(random, 1);
    }
    
    return randTasks;
}