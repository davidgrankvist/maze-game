import { Game } from "../gameTypes";
import { getJson } from "./httpClient";

export function getGame(gameCode: string): Promise<Game> {
  return getJson<Game>(`games/${gameCode}`);
}
