export interface Room {
    name: string;
    status: string;
    owner: string;
    players: {
        left: string;
        right: string;
    }
}