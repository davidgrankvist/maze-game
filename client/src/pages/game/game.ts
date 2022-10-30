import kaboom, { KaboomCtx } from "kaboom";
import { GameWebsocketClient } from "../../common/apiClients/gameApiClient";
import { GameActionId } from "../../common/gameTypes";
import { getPlayerName } from "../../common/localStorage";
import { addPlayerToState, applyAction, getPlayerVelocity, hasJoined } from "./gameState";
import { addOtherPlayerSprite } from "./players";

interface GameOptions {
  canvas: HTMLCanvasElement;
  socket: GameWebsocketClient;
}

export const initGame = ({ canvas, socket }: GameOptions) => {
  const playerName = getPlayerName() as string;
  addPlayerToState(playerName);

  kaboom({
    canvas,
  });
  // workaround for type conflict
  const korigin = (origin as unknown as KaboomCtx["origin"]);

  loadRoot("https://kaboomjs.com/");
  loadSprite("bean", "sprites/bean.png");
  loadSprite("steel", "sprites/steel.png");

  socket.subscribeActions(action => {
    if (!hasJoined(action.sender)) {
      addPlayerToState(action.sender)
      if (action.sender !== getPlayerName()) {
        addOtherPlayerSprite(action.sender)
      }
    }
    applyAction(action);
  });
  socket.subscribeGameState(gameState => {
    // use this to check if positions need to be adjusted
  });

  const player = add([
    sprite("bean"),
    pos(80, 40),
    area(),
    body(),
  ]);

  onKeyPress("w", () => {
    if (player.isGrounded()) {
      socket.publishActionById(GameActionId.Jump);
    }
  });
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
