# Migration Guide

# v1 → v2

This document highlights **breaking changes** and shows **short examples** to help you upgrade from `@ngraveio/bc-ur` version **1.x** to **2.x**.

## 1. Updated Imports

### v1 (Old)

```ts
import { UR, UREncoder, URDecoder } from "@ngraveio/bc-ur";
```

### v2 (New)

```ts
import { UR, UrFountainEncoder, UrFountainDecoder } from "@ngraveio/bc-ur";
```

- `UREncoder` → `UrFountainEncoder`
- `URDecoder` → `UrFountainDecoder`

UR encoders and decoders now have more descriptive names as they handle multipart URs (animated QR codes).

## 2. Multipart (Animated QR) Encoding

Let's assume you have a **CBOR payload** and a **type** for the UR.

### v1 (Old)

```ts
const payload = Buffer.from(JSON.stringify(syncPayloadQR)).toString("hex");

const ur = UR.fromBuffer(Buffer.from(payload, "hex"));
const encoder = new UREncoder(ur, 200);

const part = encoder.nextPart();
console.log(part);
// "ur:bytes/1-3/lpad..."
```

### v2 (New)

```ts
const payload = Buffer.from(JSON.stringify(syncPayloadQR)).toString("hex");

const ur = UR.fromData({ type: "bytes", payload: Buffer.from(payload, "hex") });
const encoder = new UrFountainEncoder(ur, 200);

const part = encoder.nextPartUr().toString();
console.log(part);
// "ur:bytes/1-3/lpada..."
```

## 3. Multipart (Animated QR) Decoding

### v1 (Old)

```ts
const decoder = new URDecoder();
decoder.receivePart(fragment);

if (decoder.isSuccess()) {
  const resultUr = decoder.resultUR(); // to get the final UR
  const decoded = decoder.resultUR().decodeCBOR().toString(); // to get the decoded data
}
```

### v2 (New)

```ts
import { UrFountainDecoder } from "@ngraveio/bc-ur";

const decoder = new UrFountainDecoder();
decoder.receivePartUr(fragment);

if (decoder.isSuccessful()) {
  const resultUr = decoder.resultUr; // to get the final UR
  const decoded = decoder.getDecodedData(); // to get the decoded data
  // or
  const decoded2 = resultUr.decode();
}
```

## 4. Getting decoding progress

### v1 (Old)

```ts
const decoder = new URDecoder();
decoder.receivePart(fragment);
decoder.getProgress(); // e.g. 0.3
```

### v2 (New)

```ts
const decoder = new UrFountainDecoder();
decoder.receivePartUr(fragment);
decoder.getProgress(); // e.g. 0.3
```

## 5. Resetting Decoder

### v1 (Old)

before, you would have to create a new instance of the decoder to reset it.

```ts
import { URDecoder } from "@ngraveio/bc-ur";

// Initialize the decoder
let decoder = new URDecoder();

// perform some decoding
decoder.receivePart(fragment);
decoder.receivePart(fragment);
// ...
decoder.receivePart(fragment);
// ...

// Reset the decoder
decoder = new URDecoder();
```

### v2 (New)

Now, you can reset the decoder by calling the `reset()` method.

```ts
import { UrFountainDecoder } from "@ngraveio/bc-ur";

// Initialize the decoder
const decoder = new UrFountainDecoder();

// perform some decoding
// ...

// Reset the decoder
decoder.reset();
```

## 6. Length of Multi-part URs

### v1 (Old)

```ts
const encoder = new UREncoder(ur, 200);
encoder.fragments.length; // e.g. 30
```

### v2 (New)

```ts
const encoder = new UrFountainEncoder(ur, 200);
encoder._pureFragments.length; // e.g. 30
```

## 7. Decoding registry items ( + tag, URType, etc )

### v1 (Old)

Before the registry items were supported by the library, you would do something like this:

1. Extend the existing `URDecoder` and add custom method to recognize your own registry items, something like this:

```tsx
import {
  // ...
  Bytes,
  CryptoOutput,
  // ...
} from "@keystonehq/bc-ur-registry";
import {
  // ...
  CryptoHDKey,
  // ...
} from "@ngraveio/bc-ur-multi-layer-sync";

export class URRegistryDecoder extends URDecoder {
  public resultRegistryType = () => {
    const ur = this.resultUR();
    switch (ur.type) {
      case "bytes":
        return Bytes.fromCBOR(ur.cbor);
      case "crypto-hdkey":
        return CryptoHDKey.fromCBOR(ur.cbor);
      case "crypto-output":
        return CryptoOutput.fromCBOR(ur.cbor);
      // ...
      // ...
      default:
        throw new Error("Unknown UR type");
    }
  };
}
```

```package.json
{
  "@keystonehq/bc-ur-registry": "0.5.4",
  "@ngraveio/bc-ur": "1.1.3",
  "@ngraveio/bc-ur-multi-layer-sync": "0.2.1"
}
```

2. Then, you would use it like this:

```ts
import { URDecoder } from "@ngraveio/bc-ur";
let decoder = new URDecoder();
decoder.receivePartUr(fragment);
if (decoder.isSuccess()) {
  const registryItem = decoder.resultRegistryType(); // get "registry item" via custom method you defined earlier
  const tag = registryItem.getRegistryType().getTag(); // to get the **tag**
  const urType = registryItem.getRegistryType().getType(); // to get the **URType**
}
```

### v2 (New)

Now, when decoding data, `UrFountainDecoder` will already recognize some of the registry items out-of-the-box.

Most of registry items are already implemented in:

- [`@ngraveio/ur-sign`](https://www.npmjs.com/package/@ngraveio/ur-sign)
- [`@ngraveio/ur-sync`](https://www.npmjs.com/package/@ngraveio/ur-sync)
- [`@ngraveio/ur-blockchain-commons`](https://www.npmjs.com/package/@ngraveio/ur-blockchain-commons)

Read more: https://github.com/ngraveio/ur-registry

e.g. `Bytes` or `CryptoCoinInfo` from `@keystonehq/bc-ur-registry` have equivalents in `@ngraveio/ur-registry`.

Below, you can see how to decode the registry items recognized by `UrFountainDecoder`:

```ts
const decoder = new UrFountainDecoder();
decoder.receivePartUr(fragment);
if (decoder.isSuccessful()) {
  const registryItem = decoder.getDecodedData(); // if the UR is a registry item recognized by UrRegistry
  const tag = registryItem.type.tag; // to get the **tag**
  const urType = registryItem.type.URType; // to get the **URType**
}
```

You may need to add some of your own registry items via [`UrRegistry`](https://github.com/ngraveio/bc-ur/tree/main?tab=readme-ov-file#registry-items), but most of the common ones are already implemented.

Additional reading:

- https://github.com/ngraveio/ur-registry/blob/main/refactor.md#migration