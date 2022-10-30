export interface Player {
  name: string;
}

export interface Room {
  code: string;
  host: string;
  players: Player[];
  isGameTime: boolean;
}

export enum GameActionId {
  MoveLeft = 1,
  MoveRight,
  MoveStop,
  Jump,
}
export interface GameAction {
  id: GameActionId;
  sender: string;
  payload?: any;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface GamePlayer {
  name: string;
  velocity: Velocity;
}

export interface GameState {
  players: Record<string, GamePlayer>;
}
