import { parseHangul, isChildOrMother, Jamo } from "../index";

describe("parseHangul", () => {
  test("sample", () => {
    const actual = parseHangul("ㄱ", "ㅏ");
    expect(actual.composingLetter).toBe("가");
  });

  test.each<[string, Jamo]>([
    ["ㄴ", "Child"],
    ["ㅏ", "Mother"],
    ["ㅈ", "Child"],
    ["ㅉ", "Child"],
    ["ㅙ", "Mother"],
  ])("is valid isChildOrMother", (inputChar, expected) => {
    const actual = isChildOrMother(inputChar);
    expect(actual).toBe(expected);
  })
});
