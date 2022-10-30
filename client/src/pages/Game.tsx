import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { GameWebsocketClient } from "../common/apiClients/gameApiClient";
import { getPlayerName } from "../common/localStorage";
import { initGame } from "./game/game";

export function Game(): JSX.Element {
  const { roomCode } = useParams() as { roomCode: string};
  const playerName = getPlayerName() as string;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<GameWebsocketClient | null>(null);

  useEffect(() => {
    const { current: canvas } = canvasRef;
    if (!canvas) {
      return;
    }
    if (socketRef.current) {
      return;
    }
    socketRef.current = new GameWebsocketClient({ gameCode: roomCode, playerName });

    const socket = socketRef.current;
    initGame({ canvas, socket });
    canvas.focus();

    return () => {
      socket.close();
    }
  }, [canvasRef])

  return (
    <div className="fixed top-0 left-0 w-screen h-screen">
      <canvas ref={canvasRef} id="gameCanvas" className="w-full h-full" />
    </div>
  );
}
