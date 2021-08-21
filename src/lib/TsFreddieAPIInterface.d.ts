interface PlayerData_Type {
    points: {
        total: number;
        points?: number;
        rank: string | number;
    };
    team_rank: {
        rank: string;
    };
    rank: {
        rank: string;
    };
    // maps: {};
    maps: any;
}

export interface PlayerData_Map {
    points: number;
    total_finishes: number;
    finishes: number;
    team_rank?: number;
    rank?: number;
    time?: number;
    first_finish?: number;
}

export interface PlayerData {
    player: string;
    points: {
        total: number;
        points: number;
        rank: number;
    };
    team_rank: {
        rank: string;
    };
    rank: {
        rank: string;
    };
    points_last_month: {
        points: number;
        rank: number;
    };
    points_last_week: {
        points: number;
        rank: number;
    };
    first_finish: {
        timestamp: number;
        map: string;
        time: number;
    };
    last_finishes: {
        timestamp: number;
        map: string;
        time: number;
        country: string;
        type: string;
    }[];
    favoritePartners: {
        name: string;
        finishes: number;
    }[];
    types: {
        Novice: PlayerData_Type;
        Moderate: PlayerData_Type;
        Brutal: PlayerData_Type;
        Insane: PlayerData_Type;
        Dummy: PlayerData_Type;
        DDmaX: PlayerData_Type;
        Oldschool: PlayerData_Type;
        Solo: PlayerData_Type;
        Race: PlayerData_Type;
        Fun: PlayerData_Type;
    };
}

interface FindDataPlayer {
    name: string;
    clan: string;
    score: number;
    is_player: boolean;
    flag: number;
    server: {
        ip: string;
        port: number;
        // protocols: [
        //     string;
        //     string
        // ];
        protocols: string[];
        max_clients: number;
        max_players: number;
        passworded: boolean;
        game_type: string;
        name: string;
        version: string;
        map: string;
        locale: string;
        num_clients: number;
        num_players: number;
        num_spectators: number;
    };
}

export interface FindData {
    players: FindDataPlayer[];
}
