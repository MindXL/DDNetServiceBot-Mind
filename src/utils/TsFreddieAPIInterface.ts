interface PointsData_Type {
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

interface PointsData_Map {
    points: number;
    total_finishes: number;
    finishes: number;
    team_rank?: number;
    rank?: number;
    time?: number;
    first_finish?: number;
}

export interface PointsData {
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
        Novice: PointsData_Type;
        Moderate: PointsData_Type;
        Brutal: PointsData_Type;
        Insane: PointsData_Type;
        Dummy: PointsData_Type;
        DDmaX: PointsData_Type;
        Oldschool: PointsData_Type;
        Solo: PointsData_Type;
        Race: PointsData_Type;
        Fun: PointsData_Type;
    };
}

export interface FindDataPlayer{
    
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
