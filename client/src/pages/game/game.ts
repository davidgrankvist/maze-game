import kaboom, { KaboomCtx } from "kaboom";
import { GameWebsocketClient } from "../../common/apiClients/gameApiClient";
import { GameActionId } from "../../common/gameTypes";
import { getPlayerName } from "../../common/localStorage";
import { getPlayerState, newPlayersHaveJoined, updateGameState, } from "./gameState";
import { addOtherPlayerSprite, adjustPosition } from "./players";

interface GameOptions {
  canvas: HTMLCanvasElement;
  socket: GameWebsocketClient;
}

export const initGame = ({ canvas, socket }: GameOptions) => {
  kaboom({
    canvas,
  });
  // workaround for type conflict
  const korigin = (origin as unknown as KaboomCtx["origin"]);

  loadRoot("https://kaboomjs.com/");
  loadSprite("bean", "sprites/bean.png");
  loadSprite("steel", "sprites/steel.png");

  socket.subscribeGameState(gameState => {
    updateGameState(gameState);

    if (newPlayersHaveJoined()) {
      Object.keys(gameState.players).forEach(name => {
        addOtherPlayerSprite(name)
      });
    }
  });

  const player = add([
    sprite("bean"),
    pos(0, 0),
    area(),
    solid(),
    z(999),
  ]);

  onKeyPress("w", () => {
    socket.publishActionById(GameActionId.MoveUp);
  });
  onKeyPress("a", () => {
    socket.publishActionById(GameActionId.MoveLeft);
  });
  onKeyPress("s", () => {
    socket.publishActionById(GameActionId.MoveDown);
  });
  onKeyPress("d", () => {
    socket.publishActionById(GameActionId.MoveRight);
  });
  onKeyRelease("w", () => {
    socket.publishActionById(GameActionId.MoveUpStop);
  });
  onKeyRelease("a", () => {
    socket.publishActionById(GameActionId.MoveLeftStop);
  });
  onKeyRelease("s", () => {
    socket.publishActionById(GameActionId.MoveDownStop);
  });
  onKeyRelease("d", () => {
    socket.publishActionById(GameActionId.MoveRightStop);
  });
  player.onUpdate(() => {
    const { position, velocity } = getPlayerState(getPlayerName() as string);
    adjustPosition(player, position);
    player.move(velocity.x, velocity.y);
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
        "block"
    ],
  })
}
