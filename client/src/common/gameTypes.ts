export interface Player {
  name: string;
}

export interface Room {
  code: string;
  host: string;
  players: Player[];
}
