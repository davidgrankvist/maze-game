import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getPlayerName } from "../common/localStorage";

export function Room(): JSX.Element {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const playerName = getPlayerName();
  const [players, setPlayers] = useState([
    {
      name: 'bob',
    },
    {
      name: 'alice',
    },
    {
      name: playerName,
    },
  ]);
  const [isHost] = useState(true);

  const onStartGame = () => {
    // TODO call some api here to create the room

    navigate(`/game/${roomCode}`);
  };
  return (
    <div className="w-full h-1/2 flex justify-center">
      <div className="w-1/3 mt-20 flex flex-col">
        {isHost ? (
          <div className="flex flex-col items-center">
            <p className="mb-3">You are the host. You have power.</p>
            <button className="w-1/3 btn btn-primary" onClick={onStartGame}>Start game</button> 
          </div>
          ) : (
          <div className="flex flex-col items-center">
            <p>Waiting for the host to start the game</p>
            <progress className="w-3/4 progress progress-info"></progress>
          </div>
        )}
      </div>
     <div className="divider divider-horizontal" />
     <div className="w-1/3 mt-20 mb-20">
        <table className="w-full table table-zebra">
          <thead>
            <tr>
              <th>Players on this room</th>
            </tr>
          </thead>
          <tbody>
            {players.map(pl => <tr key={pl.name}><td>{pl.name === playerName ? pl.name + " (you)" : pl.name}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
