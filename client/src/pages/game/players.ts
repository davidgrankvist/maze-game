import { GameObj } from "kaboom";
import { Vec2 } from "../../common/gameTypes";
import { getPlayerName } from "../../common/localStorage";
import { distance, getPlayerState, POSITION_TOLERANCE } from "./gameState";

const hasSprite: Record<string, boolean> = {};

export function addOtherPlayerSprite(playerName: string) {
  if (hasSprite[playerName] || playerName === getPlayerName()) {
    return;
  }
  const player = add([
    sprite("bean"),
    pos(0, 0),
    area(),
  ]);
  player.onUpdate(() => {
    const { position, velocity } = getPlayerState(playerName);
    adjustPosition(player, position)
    player.move(velocity.x, velocity.y);
  });
  hasSprite[playerName] = true;
}

export function adjustPosition(sprite: GameObj<any>, actualPosition: Vec2) {
    const spritePos = sprite.pos;
    if (distance(spritePos, actualPosition) > POSITION_TOLERANCE) {
      sprite.moveTo(vec2(actualPosition.x, actualPosition.y));
    }
}
