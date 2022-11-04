import { getPlayerName } from "../../common/localStorage";
import { getPlayerState } from "./gameState";

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
    player.move(velocity.x, velocity.y);
  });
  hasSprite[playerName] = true;
}
