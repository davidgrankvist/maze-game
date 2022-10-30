import { isProd } from './environment';

export const config = {
 BASE_URL: isProd() ? "/api" : "http://localhost:8090/api",
 BASE_WS_URL: isProd() ? `wss://${window.location.host}/api` : "ws://localhost:8090/api",
}
