import HangulSyllable from "./HangulSyllable";
import { JamoBlock } from "./JamoBlock";
import isJamo from "./utlils/isJamo";

/**
 * 음절을 조합하고 완성하는 IME
 */
export default class HangulIme
  implements IInsertCallback, IBackspaceCallback, IComposeCallback
{
  private _latestCompletedSyllable: string = "";
  public get latestCompletedSyllable() {
    return this._latestCompletedSyllable;
  }

  private _composingSyllable: string = "";
  public get composingSyllable() {
    return this._composingSyllable;
  }

  private _imeStep: HangulImeStep = "empty";
  public get imeStep() {
    return this._imeStep;
  }

  private _syllable: HangulSyllable = new HangulSyllable();

  /**
   * 한글 자모를 입력한다.
   * @param inputKey 한글 자모 키 값
   * @returns {IInsertCallback}
   */
  public insert(inputKey: string) {
    if (!isJamo(inputKey)) {
      this._imeStep = "completed";
      return this as IInsertCallback;
    }

    const isPossibleInput = this._syllable.tryInput(inputKey);
    if (isPossibleInput) return this.composing();
    this.complete(inputKey);

    return this as IInsertCallback;
  }

  /**
   * 한글 음절에 백스페이스를 물리다
   * @returns {IInsertCallback}
   */
  public backspace() {
    const isPossibleBackspace = this._syllable.tryBackspace();
    if (isPossibleBackspace && this._syllable.composingSyllable) {
      this._imeStep = "composing";
    } else {
      this._imeStep = "empty";
    }

    this._composingSyllable = this._syllable.composingSyllable;
    return this as IBackspaceCallback;
  }

  /** 글자 조합이 완성된 경우 callback을 호출한다. */
  public onComplete(
    callback: (completedSyllable: string, composingSyllable: string) => void
  ) {
    if (this._imeStep === "completed")
      callback(this.latestCompletedSyllable!, this.composingSyllable);
    return this as IComposeCallback;
  }

  /** 조합중인 글자가 빈 경우 callback을 호출한다. */
  public onEmpty(callback: () => void) {
    if (this._imeStep === "empty") callback();
    return this as IComposeCallback;
  }

  /** 글자를 조합 중인 경우 callback을 호출한다. */
  public onCompose(callback: (syllable: string) => void) {
    if (this._imeStep === "composing") callback(this._composingSyllable!);
  }

  public clear() {
    this._syllable.clear();
    this._composingSyllable = this._syllable.composingSyllable;
    this._imeStep = "empty";
  }

  private complete(inputKey: string) {
    this._imeStep = "completed";
    const inputKeyJamo = new JamoBlock(inputKey);
    const newSyllable = new HangulSyllable();
    const prevSyllable = this._syllable;
    this._syllable = newSyllable;

    if (inputKeyJamo.isVowel() && prevSyllable.finalConsonat) {
      decomposeSyllable(inputKey, prevSyllable, newSyllable);
    } else {
      newSyllable.tryInput(inputKey);
    }

    this._latestCompletedSyllable = prevSyllable.composingSyllable;
    this._composingSyllable = newSyllable.composingSyllable;
  }

  private composing() {
    this._imeStep = "composing";
    this._composingSyllable = this._syllable!.composingSyllable;
    return this as IInsertCallback;
  }
}

export interface IInsertCallback {
  onComplete(
    callback: (completedSyllable: string, composingSyllable: string) => void
  ): IComposeCallback;
}

export interface IBackspaceCallback {
  onEmpty(callback: () => void): IComposeCallback;
}

export interface IComposeCallback {
  onCompose(callback: (syllable: string) => void): void;
}

export type HangulImeStep = "empty" | "composing" | "completed";

function decomposeSyllable(
  inputKey: string,
  prevSyllable: HangulSyllable,
  newSyllable: HangulSyllable
) {
  const consonatsBlock = new JamoBlock(prevSyllable.finalConsonat!);
  if (consonatsBlock.isComposedFinalConsonats()) {
    const consonats = consonatsBlock.decompose();
    newSyllable.tryInput(consonats[1]);
    newSyllable.tryInput(inputKey);
  } else {
    newSyllable.tryInput(consonatsBlock.character);
    newSyllable.tryInput(inputKey);
  }
  prevSyllable!.tryBackspace();
}
