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
  MoveUp,
  MoveDown,
  MoveLeftStop,
  MoveRightStop,
  MoveUpStop,
  MoveDownStop,
}
export interface GameAction {
  id: GameActionId;
  sender: string;
  payload?: any;
}

export interface Vec2 {
  x: number;
  y: number;
}

export interface GamePlayer {
  position: Vec2;
  velocity: Vec2;
}

export interface GameState {
  players: Record<string, GamePlayer>;
}
