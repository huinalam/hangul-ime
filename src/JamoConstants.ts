export namespace JamoConstants {
  /** 자음 목록 */
  export const consonants: ReadonlyArray<string> =
    "ㄱㄲㄳㄴㄵㄶㄷㄸㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅃㅄㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ".split("");

  /** 모음 목록 */
  export const vowels: ReadonlyArray<string> =
    "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ".split("");

  /** 초성 목록 */
  export const initialConsonants: ReadonlyArray<string> =
    "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ".split("");

  /** 중성 목록 */
  export const medialVowels: ReadonlyArray<string> =
    "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ".split("");

  /** 종성 목록 */
  export const finalConsonats: ReadonlyArray<string> =
    "ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ".split("");

  /** 합성하기 위한 모음 매칭표 */
  export const vowelMapForComposition: ReadonlyMap<string, string> = new Map([
    ["ㅗㅏ", "ㅘ"],
    ["ㅗㅐ", "ㅙ"],
    ["ㅗㅣ", "ㅚ"],
    ["ㅜㅓ", "ㅝ"],
    ["ㅜㅔ", "ㅞ"],
    ["ㅜㅣ", "ㅟ"],
    ["ㅡㅣ", "ㅢ"],
  ]);

  /** 분해하기 위한 모음 매칭표 */
  export const vowelMapForDecomposition: ReadonlyMap<string, string> = new Map([
    ["ㅘ", "ㅗㅏ"],
    ["ㅙ", "ㅗㅐ"],
    ["ㅚ", "ㅗㅣ"],
    ["ㅝ", "ㅜㅓ"],
    ["ㅞ", "ㅜㅔ"],
    ["ㅟ", "ㅜㅣ"],
    ["ㅢ", "ㅡㅣ"],
  ]);

  /** 합성하기 위한 종성 매칭표 */
  export const finalConsonatMapForComposition: ReadonlyMap<string, string> =
    new Map([
      ["ㄱㅅ", "ㄳ"],
      ["ㄴㅈ", "ㄵ"],
      ["ㄴㅎ", "ㄶ"],
      ["ㄹㄱ", "ㄺ"],
      ["ㄹㅁ", "ㄻ"],
      ["ㄹㅂ", "ㄼ"],
      ["ㄹㅅ", "ㄽ"],
      ["ㄹㅌ", "ㄾ"],
      ["ㄹㅍ", "ㄿ"],
      ["ㄹㅎ", "ㅀ"],
      ["ㅂㅅ", "ㅄ"],
    ]);

  /** 분해하기 위한 종성 매칭표 */
  export const finalConsonatMapForDecomposition: ReadonlyMap<string, string> =
    new Map([
      ["ㄳ", "ㄱㅅ"],
      ["ㄵ", "ㄴㅈ"],
      ["ㄶ", "ㄴㅎ"],
      ["ㄺ", "ㄹㄱ"],
      ["ㄻ", "ㄹㅁ"],
      ["ㄼ", "ㄹㅂ"],
      ["ㄽ", "ㄹㅅ"],
      ["ㄾ", "ㄹㅌ"],
      ["ㄿ", "ㄹㅍ"],
      ["ㅀ", "ㄹㅎ"],
      ["ㅄ", "ㅂㅅ"],
    ]);
}
