import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getRoom } from "../common/apiClients/roomApiClient";
import { Room as RoomType } from "../common/gameTypes";
import { getPlayerName } from "../common/localStorage";
import { useInterval } from "../common/util/hooks";

export function Room(): JSX.Element {
  const navigate = useNavigate();
  const { roomCode } = useParams() as { roomCode: string};
  const playerName = getPlayerName() as string;
  const [room, setRoom] = useState<RoomType>({ host: '', code: roomCode, players: [{ name: playerName }]});
  const isHost = room.host === playerName;
  const isLoading = !room.host;

  const fetchAndSetRoom = () => {
    getRoom(roomCode as string)
    .then(r => setRoom(r))
    .catch(err => console.error(err))
  };
  useInterval(fetchAndSetRoom, 5000);

  const onInvite = async () => {
    await navigator.clipboard.writeText(window.location.href);
  }
  const onStartGame = () => {
    // TODO call some api here to start the game
    navigate(`/game/${roomCode}`);
  };
  if (isLoading) {
    return <div />;
  }
  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center mb-60">
        <div className="max-w-md">
          {isHost ? (
            <>
              <h1 className="text-5xl font-bold">You are the host</h1>
              <p className="py-6">Wait for everyone to join and then start the game!</p>
              <div className="w-full place-content-evenly">
                <button className="btn btn-secondary lg:mr-5" onClick={onInvite}>Copy invite link</button>
                <button className="btn btn-primary" onClick={onStartGame}>Start game</button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-5xl font-bold">Game starting soon</h1>
              <p className="py-6">Waiting for the host to start the game</p>
              <progress className="w-3/4 progress progress-info"></progress>
            </>
          )}
          <div className="absolute left-0 w-full flex justify-center">
          <table className="mt-5 w-96 table table-zebra">
            <thead>
              <tr>
                <th className="bg-base-300">Players on this room</th>
              </tr>
            </thead>
            <tbody>
              {room.players.map(pl => <tr key={pl.name}><td>{pl.name === playerName ? pl.name + " (you)" : pl.name}</td></tr>)}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
}
