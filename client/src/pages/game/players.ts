import { getPlayerVelocity, isJumping, stopJumping } from "./gameState";

export function addOtherPlayerSprite(playerName: string) {
  const player = add([
    sprite("bean"),
    pos(80, 40),
    area(),
    body(),
  ]);
  player.onUpdate(() => {
    const vel = getPlayerVelocity(playerName);
    if (isJumping(playerName) && player.isGrounded()) {
      player.jump()
      stopJumping(playerName);
    } else {
      player.move(vel.x, vel.y);
    }
  });
}
