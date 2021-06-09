export interface FindData {
    players: [
        ...[
            {
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
                    protocols: [...[string]];
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
        ]
    ];
}
