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
  loadSprite("steel", "https://kaboomjs.com/sprites/steel.png");

  loadSpriteAtlas("/sprites/dungeon.png", {
    "hero": {
      "x": 128,
      "y": 196,
      "width": 144,
      "height": 28,
      "sliceX": 9,
      "anims": {
        "idle": {
          "from": 0,
          "to": 3,
          "speed": 3,
          "loop": true
        },
        "run": {
          "from": 4,
          "to": 7,
          "speed": 10,
          "loop": true
        },
      }
    },
  });

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
    pos(position.x, position.y),
    sprite("hero", { anim: "idle" }),
    area({ width: 12, height: 12, offset: vec2(0, 6) }),
    scale(2),
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
  onKeyDown("a", () => {
    player.flipX(true);
  });
  onKeyDown("d", () => {
    player.flipX(false);
  })
  onKeyPress(["w", "a", "s", "d"], () => {
    player.play("run")
  })
  onKeyRelease(["w", "a", "s", "d"], () => {
    if (
      !isKeyDown("w")
      && !isKeyDown("a")
      && !isKeyDown("s")
      && !isKeyDown("d")
    ) {
      player.play("idle")
    }
  })

  addMergedLevel(game.gameMap.tiles);
}
