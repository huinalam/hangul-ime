import { JamoBlock } from "./JamoBlock";
import HangulSyllable from "./HangulSyllable";
import { JamoConstants } from "./JamoConstants";

test("sample scenario", () => {
  const sut = new HangulSyllable();

  sut.tryInput("ㄱ");
  sut.tryInput("ㅏ");
  sut.tryInput("ㄱ");
  expect(sut.composingSyllable).toBe("각");

  sut.tryBackspace();
  expect(sut.composingSyllable).toBe("가");

  sut.tryInput("ㄴ");
  expect(sut.composingSyllable).toBe("간");

  sut.tryInput("ㅈ");
  expect(sut.composingSyllable).toBe("갅");
});

describe("about tryInput", () => {
  test.each<[string[], any[], string]>([
    [[], [undefined, undefined, undefined], ""],
    [["ㄱ"], ["ㄱ", undefined, undefined], "ㄱ"],
    [["ㄱ", "ㅅ"], [undefined, undefined, "ㄳ"], "ㄳ"],
    [["ㅗ", "ㅏ"], [undefined, "ㅘ", undefined], "ㅘ"],
    [["ㅇ", "ㅗ", "ㅏ"], ["ㅇ", "ㅘ", undefined], "와"],
    [["ㅇ", "ㅗ", "ㅏ", "ㄱ"], ["ㅇ", "ㅘ", "ㄱ"], "왁"],
    [["ㅇ", "ㅗ", "ㅏ", "ㄱ", "ㅅ"], ["ㅇ", "ㅘ", "ㄳ"], "왃"],
    [["ㅇ", "ㅘ", "ㄳ"], ["ㅇ", "ㅘ", "ㄳ"], "왃"],
    [["ㄸ", "ㅘ", "ㄳ"], ["ㄸ", "ㅘ", "ㄳ"], "똯"],
  ])("when input %j, then jamo-blocks is %s, then syllable is %s", (inputList, expectedBlocks, expectedSyllable) => {
    const sut = new HangulSyllable();

    for (const input of inputList) {
      sut.tryInput(input);
    }

    expect(sut.initialConsonat).toBe(expectedBlocks[0]);
    expect(sut.medialVowel).toBe(expectedBlocks[1]);
    expect(sut.finalConsonat).toBe(expectedBlocks[2]);
    expect(sut.composingSyllable).toBe(expectedSyllable);
  });

  test("when input empty", () => {
    const sut = new HangulSyllable();

    expect(sut.initialConsonat).toBeFalsy();
    expect(sut.medialVowel).toBeFalsy();
    expect(sut.finalConsonat).toBeFalsy();
    expect(sut.composingSyllable).toBe("");
  });

  test.each<[string]>(JamoConstants.initialConsonants.map((char) => [char]))(
    "%s is initial consonant",
    (inputKey) => {
      const sut = new HangulSyllable();

      sut.tryInput(inputKey);

      expect(sut.initialConsonat).toBe(inputKey);
    }
  );

  test.each<[string]>(JamoConstants.medialVowels.map((char) => [char]))(
    "%s is medial vowel",
    (inputKey) => {
      const sut = new HangulSyllable();

      sut.tryInput(inputKey);

      expect(sut.medialVowel).toBe(inputKey);
    }
  );
});

describe("about backspace", () => {
  test("empty after backspace", () => {
    const sut = new HangulSyllable();

    sut.tryInput("ㅇ");
    sut.tryBackspace();

    expect(sut.initialConsonat).toBeFalsy();
    expect(sut.medialVowel).toBeFalsy();
    expect(sut.finalConsonat).toBeFalsy();
    expect(sut.composingSyllable).toBe("");
  });

  test("input '왥', if backspce, then '왤'", () => {
    const sut = new HangulSyllable();
    sut.tryInput("ㅇ");
    sut.tryInput("ㅗ");
    sut.tryInput("ㅐ");
    sut.tryInput("ㄹ");
    sut.tryInput("ㄱ");

    sut.tryBackspace();

    expect(sut.initialConsonat).toBeTruthy();
    expect(sut.medialVowel).toBeTruthy();
    expect(sut.finalConsonat).toBeTruthy();
    expect(sut.composingSyllable).toBe("왤");
  });

  test("input '왥', if backspace, then '옭'", () => {
    const sut = new HangulSyllable();
    sut.tryInput("ㅇ");
    sut.tryInput("ㅗ");
    sut.tryInput("ㅐ");

    sut.tryBackspace();
    sut.tryInput("ㄹ");
    sut.tryInput("ㄱ");

    expect(sut.initialConsonat).toBeTruthy();
    expect(sut.medialVowel).toBeTruthy();
    expect(sut.finalConsonat).toBeTruthy();
    expect(sut.composingSyllable).toBe("옭");
  });
});

describe("about fail to input jamo", () => {
  test("input '가', if input 'ㅏ', then false", () => {
    const sut = new HangulSyllable();
    sut.tryInput("ㄱ");
    sut.tryInput("ㅏ");

    const actual = sut.tryInput("ㅏ");

    expect(actual).toBeFalsy();
    expect(sut.composingSyllable).toBe("가");
  });

  test.each<[string[], string, boolean]>([
    [["ㄱ", "ㅏ"], "ㅏ", false],
    [["ㄱ", "ㅅ"], "ㅏ", false],
    [["ㄱ", "ㅏ"], "ㄱ", true],
    [["ㅏ"], "ㅅ", false],
    [["ㅗ", "ㅏ"], "ㄱ", false],
    [["ㄱ", "ㅅ"], "ㅏ", false],
  ])(
    "input %j, if input '%s', then %p",
    (preparedKeys, inputKey, expected) => {
      const sut = new HangulSyllable();
      for (const key of preparedKeys) {
        sut.tryInput(key);
      }

      const actual = sut.tryInput(inputKey);

      expect(actual).toBe(expected);
    }
  );
});

describe("about invalid charactor", () => {
  test.each<string>(["가", "악", "你", "好"])("if input %s is false", (inputChar) => {
    const sut = new HangulSyllable();
    const actual = sut.tryInput(inputChar);
    expect(actual).toBeFalsy();
  });
});

test.each<string[]>([
  ["ㄱ"],
  ["ㄱ", "ㅅ"],
  ["ㄱ", "ㅏ"],
  ["ㄱ", "ㅏ", "ㄱ"],
  ["ㄱ", "ㅏ", "ㄱ", "ㅅ"],
])("if clear then empty", (inputKeys) => {
  const sut = new HangulSyllable();
  for (const key of inputKeys) {
    sut.tryInput(key);
  }

  sut.clear();

  expect(sut.composingSyllable).toBe("");
});
