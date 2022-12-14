import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { getGame } from "../common/apiClients/gameApiClient";
import { GameWebsocketClient } from "../common/apiClients/gameWebsocketClient";
import { isHttpError } from "../common/apiClients/httpErrors";
import { ErrorPage } from "../common/components/ErrorPage";
import { NotFoundErrorPage } from "../common/components/NotFoundErrorPage";
import { Game, Room } from "../common/gameTypes";
import { getPlayerName } from "../common/localStorage";
import { useAsyncCall } from "../common/util/hooks";
import { initGame } from "./game/game";

interface GameProps {
  initialRoom: Room;
}
function GameCheck({ initialRoom }: GameProps): JSX.Element {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  useEffect(() => {
    if (!initialRoom.isGameTime) {
      const navTo = `/room/${roomCode}`;
      navigate(navTo);
    }
  }, [initialRoom.isGameTime]);

  return initialRoom.isGameTime ? <GameMapCheck /> : <div />;
}

function GameMapCheck(): JSX.Element {
  const { roomCode } = useParams() as { roomCode: string};
  const { result: gameResult, error, loading } = useAsyncCall(async () => {
    return await getGame(roomCode);
  });

  if (loading) {
    return <div />;
  }

  if (error || !gameResult) {
    return isHttpError(404, error) ? <NotFoundErrorPage /> : <ErrorPage />
  }
  return <GameCanvas game={gameResult} />;
}

interface GameCanvasProps {
  game: Game;
}
function GameCanvas({ game }: GameCanvasProps): JSX.Element {
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
    initGame({ canvas, socket, game });
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

export { GameCheck as Game };
