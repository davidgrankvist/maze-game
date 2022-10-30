import kaboom, { KaboomCtx } from "kaboom";
import { GameWebsocketClient } from "../../common/apiClients/gameApiClient";
import { GameActionId } from "../../common/gameTypes";

interface GameOptions {
  canvas: HTMLCanvasElement;
  socket: GameWebsocketClient;
}

export const initGame = ({ canvas, socket }: GameOptions) => {
  socket.subscribeActions(action => {
    // use this to make other players move
  });
  socket.subscribeGameState(gameState => {
    // use this to check if positions need to be adjusted
  });

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

  onKeyPress("a", () => {
    socket.publishActionById(GameActionId.MoveLeft);
  });
  onKeyPress("d", () => {
    socket.publishActionById(GameActionId.MoveRight);
  });
  onKeyRelease(["a", "d"], () => {
    socket.publishActionById(GameActionId.MoveStop);
  });

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
