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
    pos(position.x, position.y),
    sprite("hero", { anim: "idle" }),
    area({ width: 12, height: 12, offset: vec2(0, 6) }),
    scale(2),
    korigin("center"),
  ]);
  player.onUpdate(() => {
    const { position, velocity } = getPlayerState(playerName);
    player.moveTo(vec2(position.x, position.y), PLAYER_SPEED);

    const isIdle = velocity.x === 0 && velocity.y === 0;
    if (isIdle) {
      if (player.curAnim() !== "idle") {
        player.play("idle");
      }
    } else {
      if (player.curAnim() !== "run") {
        player.play("run");
      }
      const shouldFlipX = velocity.x < 0;
      player.flipX(shouldFlipX);
    }
  });
  hasSprite[playerName] = true;
}

export function adjustPosition(sprite: GameObj<any>, actualPosition: Vec2) {
    const spritePos = sprite.pos;
    if (distance(spritePos, actualPosition) > POSITION_TOLERANCE) {
      sprite.moveTo(vec2(actualPosition.x, actualPosition.y));
    }
}
