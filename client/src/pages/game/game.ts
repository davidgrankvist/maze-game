import kaboom from "kaboom";
import { GameWebsocketClient } from "../../common/apiClients/gameWebsocketClient";
import { Game, GameActionId } from "../../common/gameTypes";
import { getPlayerName } from "../../common/localStorage";
import { getPlayerState, newPlayersHaveJoined, updateGameState, } from "./gameState";
import { korigin } from "./globals";
import { addMergedLevel } from "./level";
import { addOtherPlayerSprite, adjustPosition } from "./players";

interface GameOptions {
  canvas: HTMLCanvasElement;
  socket: GameWebsocketClient;
  game: Game;
}

export const initGame = ({ canvas, socket, game }: GameOptions) => {
  kaboom({
    canvas,
  });
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

  const { position } = getPlayerState(getPlayerName() as string);
  const player = add([
    sprite("bean"),
    pos(position.x, position.y),
    area(),
    solid(),
    korigin("center"),
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
  player.onCollide("block", (_obj, col) => {
    if (!col) {
      return;
    }
    if (col.isTop()) {
      socket.publishActionById(GameActionId.MoveUpStop)
    }
    if (col.isBottom()) {
      socket.publishActionById(GameActionId.MoveDownStop)
    }
    if (col.isLeft()) {
      socket.publishActionById(GameActionId.MoveLeftStop)
    }
    if (col.isRight()) {
      socket.publishActionById(GameActionId.MoveRightStop)
    }
  });

  addMergedLevel(game.gameMap.tiles);
}
