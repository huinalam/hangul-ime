import { JamoConstants } from "./JamoConstants";
import throwIfNotJamo from "./utlils/throwIfNotJamo";

/**
 * 자음, 모음을 판단하고 조합합니다.
 */
export class JamoBlock {
  private _character: string;
  /** 자모 글자 */
  public get character() {
    return this._character;
  }

  constructor(inputChar: string) {
    throwIfNotJamo(inputChar);
    this._character = inputChar;
  }

  public isConsonant(): boolean {
    return JamoConstants.consonants.includes(this._character);
  }

  public isVowel(): boolean {
    return JamoConstants.vowels.includes(this._character);
  }

  public isInitialConsonant(): boolean {
    return JamoConstants.initialConsonants.includes(this._character);
  }

  public isMedialVowel(): boolean {
    return JamoConstants.medialVowels.includes(this._character);
  }

  public isFinalConsonant(): boolean {
    return JamoConstants.finalConsonats.includes(this._character);
  }

  /**
   * 합성 모음인지?
   */
  public isComposedVowel(): boolean {
    return JamoConstants.vowelMapForDecomposition.has(this._character);
  }

  /**
   * 모음을 합성할 수 있는지?
   * @param input 합성할 모음
   * @returns 가능 여부
   */
  public canComposedVowel(input: string): boolean {
    throwIfNotJamo(input);
    return JamoConstants.vowelMapForComposition.has(
      `${this._character}${input}`
    );
  }

  /**
   * 합성한 종성 자음인지?
   * @returns 가능 여부
   */
  public isComposedFinalConsonats(): boolean {
    return JamoConstants.finalConsonatMapForDecomposition.has(this._character);
  }

  /**
   * 종성 자음을 합성할 수 있는지?
   * @param input 합성할 자모
   * @returns 가능 여부
   */
  public canComposeFinalConsonants(input: string): boolean {
    throwIfNotJamo(input);
    return JamoConstants.finalConsonatMapForComposition.has(
      `${this._character}${input}`
    );
  }

  public canComposeCharacter(input: string) {
    throwIfNotJamo(input);
    return (
      this.canComposeFinalConsonants(input) || this.canComposedVowel(input)
    );
  }

  public generateComposedCharacter(input: string) {
    throwIfNotJamo(input);

    if (this.canComposedVowel(input)) {
      return JamoConstants.vowelMapForComposition.get(
        `${this._character}${input}`
      );
    }

    if (this.canComposeFinalConsonants(input)) {
      return JamoConstants.finalConsonatMapForComposition.get(
        `${this._character}${input}`
      );
    }

    throw new Error(`${this._character}와 ${input}을 합성을 할 수 없습니다.`);
  }

  /**
   * 자모를 분해합니다.
   * @returns 분해된 자모 목록
   */
  public decompose(): string[] {
    const vowels = JamoConstants.vowelMapForDecomposition.get(this._character);
    if (vowels) return vowels.split("");

    const consonants = JamoConstants.finalConsonatMapForDecomposition.get(
      this._character
    );
    if (consonants) return consonants.split("");

    return [this._character];
  }
}
