import { useParams } from "react-router";
import { getPlayerName } from "../common/localStorage";

export function Room(): JSX.Element {
  const { roomCode } = useParams();
  const playerName = getPlayerName();
  return (
    <div>
      <p>{`Room code: ${roomCode}`}</p>
      <p>{`Player name: ${playerName}`}</p>
    </div>
  );
}
