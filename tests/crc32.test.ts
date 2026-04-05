import { hexToUint8Array, stringToUint8Array } from "../src/helpers/uintArrayHelper";
import { getCRCHex } from "../src/helpers/utils";

describe("CRC32", () => {
  test("matches known vectors", () => {
    const vectors: Array<[Uint8Array, string]> = [
      [stringToUint8Array(""), "00000000"],
      [stringToUint8Array("123456789"), "cbf43926"],
      [stringToUint8Array("Hello, world!"), "ebe6c6e6"],
      [stringToUint8Array("Wolf"), "598c84dc"],
      [Uint8Array.from([0x00, 0x00, 0x00, 0x00]), "2144df1c"],
      [Uint8Array.from([0xff, 0xff, 0xff, 0xff]), "ffffffff"],
      [Uint8Array.from({ length: 32 }, (_, i) => i), "91267e8a"],
      [
        hexToUint8Array("d9012ca20150c7098580125e2ab0981253468b2dbc5202d8641947da"),
        "d22c52b6",
      ],
    ];

    for (const [input, expected] of vectors) {
      expect(getCRCHex(input)).toBe(expected);
    }
  });

  test("is deterministic", () => {
    const input = Uint8Array.from([0xde, 0xad, 0xbe, 0xef]);
    expect(getCRCHex(input)).toBe(getCRCHex(input));
  });
});
