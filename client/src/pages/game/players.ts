import { GameObj } from "kaboom";
import { Vec2 } from "../../common/gameTypes";
import { getPlayerName } from "../../common/localStorage";
import { distance, getPlayerState, PLAYER_SPEED, POSITION_TOLERANCE } from "./gameState";
import { korigin } from "./globals";

const hasSprite: Record<string, boolean> = {};

export function addOtherPlayerSprite(playerName: string) {
  if (hasSprite[playerName] || playerName === getPlayerName()) {
    return;
  }
  const { position } = getPlayerState(playerName);
  const player = add([
    sprite("bean"),
    pos(position.x, position.y),
    area(),
    korigin("center"),
  ]);
  player.onUpdate(() => {
    const { position } = getPlayerState(playerName);
    player.moveTo(vec2(position.x, position.y), PLAYER_SPEED);
  });
  hasSprite[playerName] = true;
}

export function adjustPosition(sprite: GameObj<any>, actualPosition: Vec2) {
    const spritePos = sprite.pos;
    if (distance(spritePos, actualPosition) > POSITION_TOLERANCE) {
      sprite.moveTo(vec2(actualPosition.x, actualPosition.y));
    }
}
