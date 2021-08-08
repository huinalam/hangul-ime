import { IHangulSyllable } from "../IHangulSyllable";
import { syllableToChar } from "./syllableToChar";

describe("about valid syllable", () => {
  test.each<[IHangulSyllable, string]>([
    [{}, ""],
    [{ initialConsonat: "ㄱ" }, "ㄱ"],
    [{ finalConsonat: "ㄳ" }, "ㄳ"],
    [{ medialVowel: "ㅏ" }, "ㅏ"],
    [{ initialConsonat: "ㄴ", medialVowel: "ㅓ" }, "너"],
    [{ initialConsonat: "ㄱ", medialVowel: "ㅏ", finalConsonat: "ㄱ" }, "각"],
    [{ initialConsonat: "ㄷ", medialVowel: "ㅏ", finalConsonat: "ㄺ" }, "닭"],
    [{ initialConsonat: "ㅇ", medialVowel: "ㅙ", finalConsonat: "ㅇ" }, "왱"],
  ])("if compose %j, then %s", (input, expected) => {
    const actual = syllableToChar(input);
    expect(actual).toBe(expected);
  });
});

describe("about invalid syllable", () => {
  test.each<IHangulSyllable>([
    { initialConsonat: "ㄱ", finalConsonat: "ㄱ" },
    { medialVowel: "ㅏ", finalConsonat: "ㄱ" },
  ])("if compose %j, then error", (syllable) => {
    const fn = () => syllableToChar(syllable);
    expect(fn).toThrow();
  });
});
