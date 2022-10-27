import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { getPlayerName } from "../localStorage";

interface CharacterCheckProps {
  children: JSX.Element;
}

export function CharacterCheck({ children }: CharacterCheckProps): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const name = getPlayerName();
  const { roomCode } = useParams();
  useEffect(() => {
    if (!name) { 
      const navTo = roomCode ? `/?returnTo=${location.pathname}` : "/";
      navigate(navTo);
    }
  }, [navigate, name]);
  return name ? children : <div />;
}
