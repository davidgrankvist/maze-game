const LS_NAME_KEY = "maze-player-name";

export function setPlayerName(name: string) {
  localStorage.setItem(LS_NAME_KEY, name);
}

export function getPlayerName() {
  return localStorage.getItem(LS_NAME_KEY);
}
