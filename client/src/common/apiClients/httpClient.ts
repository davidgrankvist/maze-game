import { isProd } from "../environment";
import { HttpError } from "./httpErrors";

const BASE_URL = isProd() ? "/api" : "http://localhost:8090/api";

const BASE_HEADERS = {
  "Content-Type": "application/json"
};

export async function postJson<T>(path: string, body: any, options?: RequestInit): Promise<T> {
  return await fetch(`${BASE_URL}/${path}`, {
    method: "POST",
    headers: BASE_HEADERS,
    body: JSON.stringify(body),
    ...(options || {}),
  }).then(mapToJsonOrHttpError);
}

export async function getJson<T>(path: string, options?: RequestInit): Promise<T> {
  return await fetch(`${BASE_URL}/${path}`, {
    headers: BASE_HEADERS,
    ...(options || {}),
  }).then(mapToJsonOrHttpError);
}

async function mapToJsonOrHttpError(resp: Response) {
    if (resp.ok) {
      return resp.json();
    } else {
      const txt = await resp.text();
      throw new HttpError(resp.status, txt);
    }
}
