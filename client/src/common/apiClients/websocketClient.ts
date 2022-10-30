import { config } from '../config';

const { BASE_WS_URL } = config;
export function getWebsocket(path: string) {
  return new WebSocket(`${BASE_WS_URL}/${path}`);
}
