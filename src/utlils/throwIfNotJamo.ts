import isJamo from "./isJamo";

export default function throwIfNotJamo(inputKey: string) {
  if (isJamo(inputKey)) return;
  throw new Error(`${inputKey} is not jamo`);
}
