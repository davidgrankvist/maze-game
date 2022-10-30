import { GameAction, GameActionId, GameState } from '../gameTypes';
import { getWebsocket } from './websocketClient';

enum GameTopic {
  Actions = "game-actions",
  GameState = "game-state",
}

interface GameMessage {
  topic: GameTopic;
  payload: GameAction | GameState;
}

interface GameWebsocketOptions {
  gameCode: string;
  playerName: string;
}

function serializeMessage(message: GameMessage) {
  return JSON.stringify(message);
}
function deserializeMessage(message: string) {
  return JSON.parse(message) as GameMessage;
}

type MessageEventHandler = (evt: MessageEvent<any>) => void;
export class GameWebsocketClient {
  private socket: WebSocket;
  private eventHandlers: MessageEventHandler[] = [];

  constructor({ gameCode, playerName }: GameWebsocketOptions) {
    const path = `games/${gameCode}/${playerName}/ws`
    this.socket = getWebsocket(path);
  }

  close() {
    this.eventHandlers.forEach(cb => {
      this.socket.removeEventListener("message", cb);
    });
    this.socket.close();
  }

  private sendMessage(message: GameMessage) {
    this.socket.send(serializeMessage(message))
  }

  publishAction(action: Omit<GameAction, "sender">) {
    // sender is part of the URL and can be omitted here
    this.sendMessage({ topic: GameTopic.Actions, payload: action as GameAction });
  }

  publishActionById(actionId: GameActionId) {
    this.publishAction({ id: actionId });
  }

  subscribeActions(callback: (message: GameAction) => void) {
    const newCallback = (evt: MessageEvent<any>) => {
      const message = deserializeMessage(evt.data);
      if (message.topic === GameTopic.Actions) {
        callback(message.payload as GameAction);
      }
    };
    this.socket.addEventListener("message", newCallback);
    this.eventHandlers.push(newCallback);
  }
  subscribeGameState(callback: (message: GameState) => void) {
    const newCallback = (evt: MessageEvent<any>) => {
      const message = deserializeMessage(evt.data);
      if (message.topic === GameTopic.GameState) {
        callback(message.payload as GameState);
      }
    };
    this.socket.addEventListener("message", newCallback);
    this.eventHandlers.push(newCallback);
  }
}
