import { stringToUint8Array, uint8ArrayToHex } from "../src/helpers/uintArrayHelper";
import { sha256 } from "../src/helpers/sha256";

describe("SHA256", () => {
  test("matches known vectors", () => {
    // Standard SHA-256 vectors plus upstream sha.js boundary-style cases.
    const vectors: Array<[Uint8Array, string]> = [
      [
        stringToUint8Array(""),
        "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      ],
      [
        stringToUint8Array("abc"),
        "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
      ],
      [
        stringToUint8Array("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq"),
        "248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1",
      ],
      [
        stringToUint8Array("123"),
        "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
      ],
      [
        stringToUint8Array("123456789abcdef123456789abcdef123456789abcdef123456789abcdef"),
        "04630e8e56751a8cc3f32d647b916b9cfcc325965cf3cdac99fc5a15ff9dd69a",
      ],
      [
        stringToUint8Array("123456789abcdef123456789abcdef123456789abcdef123456789abc"),
        "9f090231ef8feb4a3a5fa82441fde958efd69825bcb4b14e3f43993d13e3fbf1",
      ],
      [
        stringToUint8Array("123456789abcdef123456789abcdef123456789abcdef123456789ab"),
        "b175d3a3aeba8bf2387d89e7066fa864fb245c6ad14ece4e2d0791c9ed8967ba",
      ],
      [
        stringToUint8Array("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcde"),
        "057ee79ece0b9a849552ab8d3c335fe9a5f1c46ef5f1d9b190c295728628299c",
      ],
      [
        stringToUint8Array("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"),
        "a8ae6e6ee929abea3afcfc5258c8ccd6f85273e0d4626d26c7279f3250f77c8e",
      ],
      [
        stringToUint8Array("foobarbaz"),
        "97df3588b5a3f24babc3851b372f0ba71a9dcdded43b14b9d06961bfc1707d9d",
      ],
      [
        stringToUint8Array("a".repeat(55)),
        "9f4390f8d30c2dd92ec9f095b65e2b9ae9b0a925a5258e241c9f1e910f734318",
      ],
      [
        stringToUint8Array("a".repeat(56)),
        "b35439a4ac6f0948b6d6f9e3c6af0f5f590ce20f1bde7090ef7970686ec6738a",
      ],
      [
        stringToUint8Array("a".repeat(64)),
        "ffe054fe7ae0cb6dc65c3af9b61d5209f439851db43d0ba5997337df154668eb",
      ],
      [
        stringToUint8Array("a".repeat(65)),
        "635361c48bb9eab14198e76ea8ab7f1a41685d6ad62aa9146d301d4f17eb0ae0",
      ],
      [
        Uint8Array.from([0x00, 0xff, 0x01, 0x02, 0x03, 0x80, 0x40, 0x20, 0x10, 0x08, 0x04, 0x02, 0x01]),
        "f42079ac9c510cb194925a775cb628d74fa7e0f9de4c3a6301e0f6933be6f9c8",
      ],
    ];

    for (const [input, expected] of vectors) {
      expect(uint8ArrayToHex(sha256(input))).toBe(expected);
      expect(sha256(input)).toHaveLength(32);
    }
  });

  test("is deterministic", () => {
    const input = stringToUint8Array("deterministic input");
    expect(uint8ArrayToHex(sha256(input))).toBe(uint8ArrayToHex(sha256(input)));
  });
});
