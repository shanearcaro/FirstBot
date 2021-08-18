export class AmongUs {
    public players: Player[] = [];
    public constructor(public maxNumberOfPlayers: number = GAME_DEFAULTS.MAXPLAYERS, public numberOfShortTasks: number = GAME_DEFAULTS.SHORTTASKS, 
        public numberOfCommonTasks: number = GAME_DEFAULTS.COMMONTASKS, public numberOfLongTasks: number = GAME_DEFAULTS.LONGTASKS, 
        public numberOfModerators: number = GAME_DEFAULTS.MODERATORS, public numberOfImpostors: number = GAME_DEFAULTS.IMPOSTORS) {
            // this.checkProblems();
    }

    // Set 
    setValues(maxNumberOfPlayers?: number, numberOfShortTasks?: number, numberOfCommonTasks?: number, numberOfLongTasks?: number, 
        numberOfModerators?: number, numberOfImpostors?: number): void {
            // this.maxNumberOfPlayers = maxNumberOfPlayers ?? this.maxNumberOfPlayers;
            // this.numberOfShortTasks = numberOfShortTasks ?? this.numberOfShortTasks;
            // this.numberOfCommonTasks = numberOfCommonTasks ?? this.numberOfCommonTasks;
            // this.numberOfLongTasks = numberOfLongTasks ?? this.numberOfLongTasks;
            // this.numberOfModerators = numberOfModerators ?? this.numberOfModerators;
            // this.numberOfImpostors = numberOfImpostors ?? this.numberOfImpostors;
            // this.checkProblems();
    }

    checkProblems(): void {
        // if (this.maxNumberOfPlayers < 0) this.maxNumberOfPlayers = GAME_DEFAULTS.MAXPLAYERS;
        // if (this.numberOfShortTasks < 0) this.numberOfShortTasks = GAME_DEFAULTS.SHORTTASKS;
        // if (this.numberOfCommonTasks < 0) this.numberOfCommonTasks = GAME_DEFAULTS.COMMONTASKS;
        // if (this.numberOfLongTasks < 0) this.numberOfLongTasks = GAME_DEFAULTS.LONGTASKS;
        // if (this.numberOfModerators < 0) this.numberOfModerators = GAME_DEFAULTS.MODERATORS;
        // if (this.numberOfImpostors < 0) this.numberOfImpostors = GAME_DEFAULTS.IMPOSTORS;
    }
}

export type Player = {
    user: string,
    tasks?: Task[],
}

export type Task = {
    name: string,
    description: string,
    room: number,
    duration: taskLength
}

export enum taskLength { SHORT, COMMON, LONG };
export enum GAME_DEFAULTS { MAXPLAYERS = 10, SHORTTASKS = 3, COMMONTASKS = 2, LONGTASKS = 1, MODERATORS = 1, IMPOSTORS = 2 };
