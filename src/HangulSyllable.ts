import { IHangulSyllable as IHangulSyllable } from "./IHangulSyllable";
import { JamoBlock } from "./JamoBlock";
import isJamo from "./utlils/isJamo";
import { syllableToChar } from "./utlils/syllableToChar";

/**
 * 한글 음절을 조합, 분해합니다.
 */
export default class HangulSyllable implements IHangulSyllable {
  private _initialConsonat: string | undefined;
  /** 초성 */
  public get initialConsonat(): string | undefined {
    return this._initialConsonat;
  }

  /** 중성 */
  private _medialVowel: string | undefined;
  public get medialVowel(): string | undefined {
    return this._medialVowel;
  }

  /** 종성 */
  private _finalConsonat: string | undefined;
  public get finalConsonat(): string | undefined {
    return this._finalConsonat;
  }

  /** 합성중인 음절 */
  public get composingSyllable(): string {
    return syllableToChar(this);
  }

  /**
   * 글자를 입력한다.
   * @param inputChar 입력할 글자
   * @returns 더이상 입력할 수 없을 때, false를 반환
   */
  public tryInput(inputChar: string): boolean {
    if (!isJamo(inputChar)) return false;

    const inputJamo = new JamoBlock(inputChar);

    if (this.isEditableInitialConsonant(inputJamo)) {
      if (this._initialConsonat) {
        const block = new JamoBlock(this._initialConsonat);
        if (block.canComposeFinalConsonants(inputChar)) {
          this._initialConsonat = undefined;
          this._finalConsonat = block.generateComposedCharacter(inputChar);
          return true;
        }
        return false;
      } else {
        this._initialConsonat = inputChar;
        return true;
      }
    }

    if (this.isEditableMedialVowel(inputJamo)) {
      if (this._medialVowel) {
        const block = new JamoBlock(this._medialVowel);
        if (inputJamo.isMedialVowel() && block.canComposedVowel(inputChar)) {
          this._medialVowel = block.generateComposedCharacter(inputChar);
          return true;
        }
      } else {
        this._medialVowel = inputChar;
        return true;
      }
    }

    if (this.isEditableFinalConsonant(inputJamo)) {
      if (!this._finalConsonat) {
        this._finalConsonat = inputChar;
        return true;
      } else {
        const block = new JamoBlock(this._finalConsonat);
        if (this._finalConsonat && block.canComposeFinalConsonants(inputChar)) {
          this._finalConsonat = block.generateComposedCharacter(inputChar);
          return true;
        }
      }
    }

    return false;
  }

  /**
   * 자모 1개를 삭제한다.
   * @returns 더이상 삭제할 수 없을 때, false를 반환다.
   */
  public tryBackspace() {
    if (this._finalConsonat) {
      const finalConsonatBlock = new JamoBlock(this._finalConsonat);
      const consonats = finalConsonatBlock.decompose();
      if (consonats.length >= 2) {
        consonats.pop();
        this._finalConsonat = consonats[0];
      } else {
        this._finalConsonat = undefined;
      }
      return true;
    }

    if (this._medialVowel) {
      const mediaVowel = new JamoBlock(this._medialVowel);
      const vowels = mediaVowel.decompose();
      if (vowels.length >= 2) {
        vowels.pop();
        this._medialVowel = vowels[0];
      } else {
        this._medialVowel = undefined;
      }
      return true;
    }

    if (this._initialConsonat) {
      this._initialConsonat = undefined;
      return true;
    }

    return false;
  }

  public clear() {
    this._initialConsonat = undefined;
    this._medialVowel = undefined;
    this._finalConsonat = undefined;
  }

  private isEditableFinalConsonant(inputJamo: JamoBlock) {
    return (
      this._initialConsonat && this._medialVowel && inputJamo.isFinalConsonant()
    );
  }

  private isEditableMedialVowel(inputJamo: JamoBlock) {
    return !this._finalConsonat && inputJamo.isMedialVowel();
  }

  private isEditableInitialConsonant(inputJamo: JamoBlock) {
    return (
      !this._medialVowel && !this._finalConsonat && inputJamo.isInitialConsonant()
    );
  }
}
