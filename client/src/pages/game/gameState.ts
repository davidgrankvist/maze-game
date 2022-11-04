import { GamePlayer, GameState } from "../../common/gameTypes";

export const PLAYER_SPEED = 400;

let prevNumPlayers = 0
let gameState: GameState = {
  players: {}
}

export function newPlayersHaveJoined() {
  const currNumPlayers = Object.entries(gameState.players).length;
  return currNumPlayers !== prevNumPlayers;
}

export function updateGameState(state: GameState) {
  prevNumPlayers =  Object.entries(gameState.players).length;
  gameState = state;
}

export function hasJoined(playerName: string) {
  return !!gameState.players[playerName];
}

export function getPlayerState(playerName: string): GamePlayer {
  const player = gameState.players[playerName];
  const defaultVec2 = { x: 0, y: 0};
  return player || {
    position: defaultVec2,
    velocity: defaultVec2,
  }
}
