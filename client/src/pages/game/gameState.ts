import { GameAction, GameActionId, GamePlayer, GameState, Velocity } from "../../common/gameTypes";

const PLAYER_SPEED = 400;

const gameState: GameState = {
  players: {}
}

export function hasJoined(playerName: string) {
  return !!gameState.players[playerName];
}

export function addPlayerToState(playerName: string) {
  if (hasJoined(playerName)) {
    return;
  }
  gameState.players[playerName] = initPlayer(playerName);
}

export function getPlayerVelocity(playerName: string): Velocity {
  const player = gameState.players[playerName];
  return player ? player.velocity : { x: 0, y: 0};
}

function updatePlayerState(player: GamePlayer) {
  gameState.players[player.name] = player;
}

function initPlayer(playerName: string) {
  return { name: playerName, velocity: { x: 0, y: 0 }};
}

export function applyAction(action: GameAction) {
  const prevVel = getPlayerVelocity(action.sender);
  switch(+action.id) {
    case GameActionId.MoveLeft:
      updatePlayerState({ name: action.sender, velocity: { x: -PLAYER_SPEED, y: 0 }});
      break;
    case GameActionId.MoveRight:
      updatePlayerState({ name: action.sender, velocity: { x: PLAYER_SPEED, y: 0 }});
      break;
    case GameActionId.MoveStop:
      updatePlayerState({ name: action.sender, velocity: { x: 0, y: 0 }});
      break;
    case GameActionId.Jump:
      // positive vertical velocity to indicate jump
      updatePlayerState({ name: action.sender, velocity: { x: prevVel.x, y: 1 }});
      break;
  }
}

export function isJumping(playerName: string) {
  return gameState.players[playerName].velocity.y > 0;
}
export function stopJumping(playerName: string) {
  gameState.players[playerName].velocity.y = 0;
}
