
import { useNavigate } from "react-router";
import { getPlayerName, setPlayerName } from "../common/localStorage";


export function Character(): JSX.Element {
  const navigate = useNavigate();

  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    const form = e.target as any;
    const formData = new FormData(form);
    
    const playerName = String(formData.get("name"));
    setPlayerName(playerName);

    navigate(`/lobby`);
  };
  return (
    <div className="hero min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Welcome!</h1>
          <p className="py-6">Here you can create a game character.</p>
        </div>
        <form onSubmit={handleSubmit} className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-200">
          <div className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Player name</span>
              </label>
              <input name="name" type="text" placeholder="Pick a name..." className="input input-bordered" required={true} defaultValue={getPlayerName() ?? ""} />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">Done</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
