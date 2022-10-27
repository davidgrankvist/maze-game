import { isProd } from "../environment";

const BASE_URL = isProd() ? "/api" : "localhost:8090/api";

const BASE_HEADERS = {
  "Content-Type": "application/json"
};

export async function postJson<T>(path: string, body: any, options?: RequestInit): Promise<T> {
  return await fetch(`${BASE_URL}/${path}`, {
    method: "POST",
    headers: BASE_HEADERS,
    body: JSON.stringify(body),
    ...(options || {}),
  }).then(resp => resp.json())
}

export async function getJson<T>(path: string, options?: RequestInit): Promise<T> {
  return await fetch(`${BASE_URL}/${path}`, {
    headers: BASE_HEADERS,
    ...(options || {}),
  }).then(resp => resp.json())
}
