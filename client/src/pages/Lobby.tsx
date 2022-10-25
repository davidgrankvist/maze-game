import { useNavigate } from "react-router";
import { getPlayerName, getRoom, setPlayerName, setRoom } from "../common/localStorage";

export function Lobby(): JSX.Element {
  const navigate = useNavigate();
  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    const form = e.target as any;
    const formData = new FormData(form);
    // const isHost = Boolean(formData.get("is-host"));
    // TODO post the data somewhere
    
    const playerName = String(formData.get("name"));
    setPlayerName(playerName);

    const roomCode = formData.get("room") as string;
    setRoom(roomCode);
    navigate(`/room/${roomCode}`);
  };
  return (
    <div className="flex justify-center">
      <form onSubmit={handleSubmit} className="form-control">
        <label className="input-group">
          <span>Name</span>
          <input name="name" type="text" required={true} placeholder="Your character name" className="input input-bordered" autoComplete="off" defaultValue={getPlayerName() ?? ""}/>
        </label>
        <label className="input-group mt-2">
          <span>Room</span>
          <input name="room" type="text" required={true} placeholder="The room code" className="input input-bordered" autoComplete="off" defaultValue={getRoom() ?? ""} />
        </label>
        <label className="label cursor-pointer">
          <span className="label-text">Join room</span> 
          <input type="radio" name="is-host" value="" className="radio checked:bg-blue-500" defaultChecked={true} />
        </label>
        <label className="label cursor-pointer">
          <span className="label-text">Create room</span> 
          <input type="radio" name="is-host" value="true" className="radio checked:bg-blue-500" />
        </label>
        <button type="submit" className="btn btn-primary">Done</button>
      </form>
    </div>
  );
}
