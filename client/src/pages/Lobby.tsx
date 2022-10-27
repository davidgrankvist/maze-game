import { useNavigate } from "react-router";
import { createRoom } from "../common/apiClients/roomApiClient";
import { getPlayerName } from "../common/localStorage";

export function Lobby(): JSX.Element {
  const navigate = useNavigate();

  const onCreateRoom = async () => {
    const playerName = getPlayerName() as string;
    try {
      const { roomCode } = await createRoom(playerName);
      navigate(`/room/${roomCode}`);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Host a room</h1>
          <p className="py-6">Here you can create a game room. You will able to invite more players by sharing a link.</p>
          <button className="btn btn-primary" onClick={onCreateRoom}>Create room</button>
        </div>
      </div>
    </div>
  );
}
