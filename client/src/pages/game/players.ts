import { getPlayerName } from "../../common/localStorage";
import { getPlayerVelocity } from "./gameState";

const hasSprite: Record<string, boolean> = {};

export function addOtherPlayerSprite(playerName: string) {
  if (hasSprite[playerName] || playerName === getPlayerName()) {
    return;
  }
  const player = add([
    sprite("bean"),
    pos(80, 40),
    area(),
    body(),
  ]);
  player.onUpdate(() => {
    const vel = getPlayerVelocity(playerName);
    player.move(vel.x, vel.y);
  });
  hasSprite[playerName] = true;
}
