import { JamoConstants } from "../JamoConstants";
import { IHangulSyllable } from "../IHangulSyllable";

/**
 * 초성, 중성, 종성을 모아 음절로 완성한다.
 * @param syllable 조립형 음절
 * @returns 완성형 음절
 */
export function syllableToChar(syllable: IHangulSyllable): string {
  if (isEmpty(syllable)) return "";
  if (isOnlyInitalCosonat(syllable)) return syllable.initialConsonat!;
  if (isOnlyMediaVowel(syllable)) return syllable.medialVowel!;
  if (isOnlyFinalConsonat(syllable)) return syllable.finalConsonat!;

  const hangulFirstIndex = "가".charCodeAt(0);
  const emptyCharCount = 1;
  const jongseongLength = JamoConstants.finalConsonats.length + emptyCharCount;

  if (syllable.initialConsonat && syllable.medialVowel) {
    const choseongIdx =
      JamoConstants.initialConsonants.indexOf(syllable.initialConsonat) *
      JamoConstants.medialVowels.length *
      jongseongLength;
    const jungseongIdx =
      JamoConstants.medialVowels.indexOf(syllable.medialVowel) *
      jongseongLength;
    const jongseongIdx = syllable.finalConsonat
      ? JamoConstants.finalConsonats.indexOf(syllable.finalConsonat) +
        emptyCharCount
      : 0;

    return String.fromCharCode(
      hangulFirstIndex + choseongIdx + jungseongIdx + jongseongIdx
    );
  }

  throw new Error(`'${syllable.initialConsonat}','${syllable.medialVowel}','${syllable.finalConsonat}' 는 한글 음절로 변환할 수 없습니다.`);
}

function isOnlyFinalConsonat(syllable: IHangulSyllable) {
  return (
    !syllable.initialConsonat && !syllable.medialVowel && syllable.finalConsonat
  );
}

function isOnlyMediaVowel(syllable: IHangulSyllable) {
  return (
    !syllable.initialConsonat && syllable.medialVowel && !syllable.finalConsonat
  );
}

function isOnlyInitalCosonat(syllable: IHangulSyllable) {
  return (
    syllable.initialConsonat && !syllable.medialVowel && !syllable.finalConsonat
  );
}

function isEmpty(syllable: IHangulSyllable) {
  return (
    !syllable.initialConsonat &&
    !syllable.medialVowel &&
    !syllable.finalConsonat
  );
}
