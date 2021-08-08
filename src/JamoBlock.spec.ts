import { JamoBlock } from "./JamoBlock";

test("sample scenario", () => {
  const sut = new JamoBlock("ㄱ");

  const isInitialConsonat = sut.isInitialConsonant();
  const isMedialVowel = sut.isMedialVowel();
  const isFinalConsonant = sut.isFinalConsonant();

  expect(isInitialConsonat).toBeTruthy();
  expect(isMedialVowel).toBeFalsy();
  expect(isFinalConsonant).toBeTruthy();
});

test("about generateComposedCharacter", () => {
  const sut = new JamoBlock("ㄱ");
  const composedChar = sut.generateComposedCharacter("ㅅ");
  expect(composedChar).toBe("ㄳ");
});

describe("about compose", () => {
  test.each<[string, string, string]>([
    ["ㄱ", "ㅅ", "ㄳ"],
    ["ㅗ", "ㅐ", "ㅙ"],
    ["ㅗ", "ㅏ", "ㅘ"],
    ["ㄴ", "ㅈ", "ㄵ"],
  ])("if %s and %s is compose, then %s", (existChar, inputChar, expected) => {
    const sut = new JamoBlock(existChar);
    const actual = sut.generateComposedCharacter(inputChar);
    expect(actual).toBe(expected);
  });

  test.each<[string, string, boolean]>([
    ["ㄱ", "ㅅ", true],
    ["ㅗ", "ㅐ", true],
    ["ㅑ", "ㅐ", false],
    ["ㄴ", "ㄷ", false],
    ["ㄴ", "ㅅ", false],
    ["ㅠ", "ㅐ", false],
  ])("if %s and %s can compose, then %s", (existChar, inputChar, expected) => {
    const sut = new JamoBlock(existChar);
    const actual = sut.canComposeCharacter(inputChar);
    expect(actual).toBe(expected);
  });

  test.each<[string, string]>([
    ["ㅑ", "ㅐ"],
    ["ㄴ", "ㄷ"],
    ["ㄴ", "ㅅ"],
    ["ㅠ", "ㅐ"],
  ])("if %s anb %s is compose, then error", (existChar, inputChar) => {
    const sut = new JamoBlock(existChar);
    const fn = () => {
      sut.generateComposedCharacter(inputChar);
    };
    expect(fn).toThrow();
  });
});

describe("about decomspose", () => {
  test.each<[string, string[]]>([
    ["ㄳ", ["ㄱ", "ㅅ"]],
    ["ㅙ", ["ㅗ", "ㅐ"]],
    ["ㅘ", ["ㅗ", "ㅏ"]],
    ["ㄵ", ["ㄴ", "ㅈ"]],
    ["ㅏ", ["ㅏ"]],
    ["ㄴ", ["ㄴ"]],
  ])("if decompose %s, then %j", (existChar, expectedList) => {
    const sut = new JamoBlock(existChar);

    const actual = sut.decompose();

    expect(actual).toHaveLength(expectedList.length);
    expect(actual).toEqual(expect.arrayContaining(expectedList));
  });
});

describe("if not jamo then throw error", () => {
  test.each<string>(["a", "와", "헿", "你", "ă"])("about consturctor", (inputKey) => {
    const fn = () => {
      new JamoBlock(inputKey);
    };
    expect(fn).toThrow();
  });

  test.each<string>(["a", "와", "헿", "你", "ă"])(
    "about canComposeCharacter",
    (inputKey) => {
      const fn = () => {
        const sut = new JamoBlock("ㄱ");
        sut.canComposeCharacter(inputKey);
      };
      expect(fn).toThrow();
    }
  );

  test.each<string>(["a", "와", "헿", "你", "ă"])(
    "about canComposeFinalConsonants",
    (inputKey) => {
      const fn = () => {
        const sut = new JamoBlock("ㄱ");
        sut.canComposeFinalConsonants(inputKey);
      };
      expect(fn).toThrow();
    }
  );

  test.each<string>(["a", "와", "헿", "你", "ă"])(
    "about canComposedVowel",
    (inputKey) => {
      const fn = () => {
        const sut = new JamoBlock("ㄱ");
        sut.canComposedVowel(inputKey);
      };
      expect(fn).toThrow();
    }
  );

  test.each<string>(["a", "와", "헿", "你", "ă"])(
    "about generateComposedCharacter",
    (inputKey) => {
      const fn = () => {
        const sut = new JamoBlock("ㄱ");
        sut.generateComposedCharacter(inputKey);
      };
      expect(fn).toThrow();
    }
  );
});
