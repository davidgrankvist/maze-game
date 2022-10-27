import { useEffect } from "react";
import { getRoom, joinRoom } from "../../common/apiClients/roomApiClient";
import { Room } from "../../common/gameTypes";
import { getPlayerName } from "../../common/localStorage";
import { useInterval } from "../../common/util/hooks";

export function usePollRoom(roomCode: string, setRoom: (r: Room) => void) {
  useInterval(async () => {
    const room = await getRoom(roomCode);
    setRoom(room);
  }, 5000);
}

export function useAutoJoinRoom(room: Room) {
  useEffect(() => {
    const playerName = getPlayerName() as string;
    const isHost = room.host === playerName;
    const isLoadingRoom = !room.host;
    if (isLoadingRoom || isHost) {
      return;
    }
    const hasJoined = room.players.find(pl => pl.name === playerName);
    if (hasJoined) {
      return;
    }

    const join = () => joinRoom(playerName, room.code).catch(err => console.error(err));
    join();
  }, [room])
}
