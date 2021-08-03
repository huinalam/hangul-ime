function isHangulChar(inputChar: string) {
  const code = inputChar.charCodeAt(0);
  if (0x1100 <= code && code <= 0x11ff) return true;
  if (0x3130 <= code && code <= 0x318f) return true;
  if (0xac00 <= code && code <= 0xd7a3) return true;
  return false;
}

function throwIfNot1Letter(inputChar: string) {
  if (!inputChar) throw new Error("empty letter");
  if (inputChar.length !== 1) throw new Error("please enter only 1 character");
  if (!isHangulChar(inputChar)) throw new Error(`${inputChar} is not korean`);
}

export function parseHangul(inputChar: string, conposingChar: string) {
  throwIfNot1Letter(inputChar);
  throwIfNot1Letter(conposingChar);
  const firstChar = String.fromCharCode("ㄱ".charCodeAt(0));

  return {
    completeLetter: ``,
    composingLetter: `가`,
  } as IParseResult;
}

export function isChildOrMother(inputChar: string): Jamo {
  throwIfNot1Letter(inputChar);

  return "choseong";
}

export type Jamo = "choseong" | "jungseong" | "jongseong";

export interface IParseResult {
  composingLetter: string;
  completeLetter: string;
}
