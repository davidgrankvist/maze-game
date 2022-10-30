import { useParams } from "react-router";
import { getPlayerName } from "../localStorage";
import { getRoom, joinRoom } from "../apiClients/roomApiClient";
import { useAsyncCall } from "../util/hooks";
import { isHttpError } from "../apiClients/httpErrors";
import { NotFoundErrorPage } from "./NotFoundErrorPage";
import { ErrorPage } from "./ErrorPage";
import { RoomLoader } from "./RoomLoader";
import { Room } from "../gameTypes";

interface RoomCheckProps {
  render: (room: Room) => JSX.Element;
}

export function RoomCheck({ render }: RoomCheckProps): JSX.Element {
  const playerName = getPlayerName() as string;
  const { roomCode } = useParams() as { roomCode: string };
  const { result: roomResult, error, loading } = useAsyncCall(async () => { 
    let room = await getRoom(roomCode)
    const isHost = playerName === room.host;
    const isInRoom = room.players.find(pl => pl.name === playerName);
    if (!isHost && !isInRoom) {
      await joinRoom(playerName, roomCode);
      room = {
        ...room,
        players: [...room.players, { name: playerName }]
      }
    }
    return room;
  }, [roomCode]);

  if (loading) {
    return <RoomLoader />
  }
  if (error || !roomResult ) {
    return isHttpError(404, error) ? <NotFoundErrorPage /> : <ErrorPage />
  }
  return (
    <>
      {render(roomResult)}
    </>
  );
}
