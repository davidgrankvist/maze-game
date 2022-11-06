import { KaboomCtx } from "kaboom";

// workaround for type conflict between kaboom and lib.dom.d.ts
export const korigin: KaboomCtx["origin"] = (o) => {
  return (origin as unknown as KaboomCtx["origin"])(o);
}
