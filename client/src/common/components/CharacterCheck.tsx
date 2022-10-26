import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getPlayerName } from "../localStorage";

interface CharacterCheckProps {
  children: JSX.Element;
}

export function CharacterCheck({ children }: CharacterCheckProps): JSX.Element {
  const navigate = useNavigate();
  const name = getPlayerName();
  useEffect(() => {
    if (!name) { 
      navigate("/");
    }
  }, [navigate, name]);
  return name ? children : <div />;
}
