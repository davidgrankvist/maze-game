import { useNavigate } from "react-router";


export function Lobby(): JSX.Element {
  const navigate = useNavigate();

  const onCreateRoom: React.FormEventHandler = () => {
    // TODO get this in the backend response
    const roomCode = "roomarino";
    navigate(`/room/${roomCode}`);
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
