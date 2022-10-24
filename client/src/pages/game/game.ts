import kaboom, { KaboomCtx } from "kaboom";

interface GameOptions {
  canvas: HTMLCanvasElement;
}

export const initGame = ({ canvas }: GameOptions) => {
  kaboom({
    canvas,
  });
  // workaround for type conflict
  const korigin = (origin as unknown as KaboomCtx["origin"]);

  loadRoot("https://kaboomjs.com/");
  loadSprite("bean", "sprites/bean.png");
  loadSprite("steel", "sprites/steel.png");

  const player = add([
    sprite("bean"),
    pos(80, 40),
    area(),
    body(),
  ]);

  const SPEED = 400;
  onKeyPress("w", () => {
    if (player.isGrounded()) {
      player.jump()
    }
  })
  onKeyDown("a", () => {
    player.move(-SPEED, 0);
  })
  onKeyDown("d", () => {
    player.move(SPEED, 0);
  })
  player.onUpdate(() => {
    camPos(player.pos);
  });

  addLevel([
    "                           ",
    "     == ===============    ",
    "                      =    ",
    "         ====              ",
    "                      =    ",
    "               =      =    ",
    "==================  =======",
    "                      =    ",
    "     ==  ==============    ",
    "     ==                    ",
], {
    width: 64,
    height: 64,
    "=": () => [
        sprite("steel"),
        area(),
        solid(),
    ],
})
}
