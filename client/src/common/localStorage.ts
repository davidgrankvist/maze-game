const LS_NAME_KEY = "maze-player-name";
const LS_ROOM_KEY = "maze-player-room";

export function setPlayerName(name: string) {
  localStorage.setItem(LS_NAME_KEY, name);
}

export function getPlayerName() {
  return localStorage.getItem(LS_NAME_KEY);
}

export function setRoom(roomCode: string) {
  localStorage.setItem(LS_ROOM_KEY, roomCode);
}

export function getRoom() {
  return localStorage.getItem(LS_ROOM_KEY);
}
