import { Room } from "../gameTypes";
import { getJson, postJson } from "./httpClient";

export interface CreateRoomResponse {
  roomCode: string;
}
export function createRoom(playerName: string): Promise<CreateRoomResponse> {
  return postJson<CreateRoomResponse>("rooms", { playerName });
}

export interface JoinRoomResponse {
  playerName: string;
}
export function joinRoom(playerName: string, roomCode: string): Promise<JoinRoomResponse> {
  return postJson<JoinRoomResponse>(`rooms/${roomCode}/join`, { playerName });
}

export function getRoom(roomCode: string): Promise<Room> {
  return getJson<Room>(`rooms/${roomCode}`);
}
