// ESM consumers should stay entirely within the ESM output tree.
// The CommonJS build gets its own wrapper entry via `cbor2-cjs.cts`.

//@ts-ignore
export { decode, encode, Tag, registerEncoder, comment, diagnose } from "./cbor2Wrapper.js";
//@ts-ignore
export type { DecodeOptions, EncodeOptions, CommentOptions } from "./cbor2Wrapper.js";
