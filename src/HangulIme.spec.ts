import HangulIme from "./HangulIme";

describe("sample scenario", () => {
  test("input 'ㄱ'", () => {
    const sut = new HangulIme();
    const onComplete = jest.fn();
    const onCompose = jest.fn();
    const onEmpty = jest.fn();

    sut.insert("ㄱ").onComplete(onComplete).onCompose(onCompose);

    expect(onCompose).toBeCalled();
    expect(onComplete).not.toBeCalled();
    expect(onEmpty).not.toBeCalled();
  });

  test("input '각난자'", () => {
    const sut = new HangulIme();
    const inputKeys = ["ㄱ", "ㅏ", "ㄱ", "ㄴ", "ㅏ", "ㄴ", "ㅈ", "ㅏ"];
    let actualText = "";
    const expectedInputText = "각난자";

    for (const key of inputKeys) {
      sut.insert(key).onComplete((completedSyllable) => {
        actualText += completedSyllable;
      });
    }

    actualText += sut.composingSyllable;

    expect(actualText).toBe(expectedInputText);
  });
});

describe("about callback", () => {
  test("call onCompose", () => {
    const sut = new HangulIme();
    const onComplete = jest.fn();
    const onCompose = jest.fn();

    sut.insert("ㄱ").onComplete(onComplete).onCompose(onCompose);

    expect(onCompose).toBeCalled();
    expect(onComplete).not.toBeCalled();
  });

  test("call onComplete", () => {
    const sut = new HangulIme();
    const onComplete = jest.fn();
    const onCompose = jest.fn();
    const onEmpty = jest.fn();

    sut.insert("ㄱ");
    sut.insert("ㄱ").onComplete(onComplete).onCompose(onCompose);

    expect(onCompose).not.toBeCalled();
    expect(onComplete).toBeCalled();
    expect(onEmpty).not.toBeCalled();
  });
});

describe("about composing", () => {
  test("if input 'ㄱㅏ', then call compose", () => {
    const sut = new HangulIme();
    const onComplete = jest.fn();
    const onCompose = jest.fn();

    sut.insert("ㄱ");
    sut.insert("ㅏ").onComplete(onComplete).onCompose(onCompose);

    expect(onCompose).toBeCalled();
    expect(onComplete).not.toBeCalled();
  });

  test.each<[string[], string]>([
    [["ㄱ", "ㅏ", "ㄱ"], "각"],
    [["ㄱ", "ㅏ", "ㅂ", "ㅅ"], "값"],
    [["ㄲ", "ㅏ", "ㄲ"], "깎"],
    [["ㄱ", "ㅗ", "ㅐ", "ㄹ", "ㄱ"], "괡"],
    [["ㄱ", "ㅅ"], "ㄳ"],
    [["ㅜ", "ㅔ"], "ㅞ"],
  ])("if input %j, then %s", (inputKeys, expectedSyllable) => {
    const sut = new HangulIme();

    for (const key of inputKeys) {
      sut.insert(key);
    }
    const actaulSylliable = sut.composingSyllable;

    expect(actaulSylliable).toBe(expectedSyllable);
  });
});

describe("about backsapce", () => {
  test("input 'ㄱ', if backspace, then empty", () => {
    const sut = new HangulIme();
    const onCompose = jest.fn();
    const onEmpty = jest.fn();

    sut.insert("ㄱ");
    sut.backspace().onEmpty(onEmpty).onCompose(onCompose);

    expect(onCompose).not.toBeCalled();
    expect(onEmpty).toBeCalled();
    expect(sut.composingSyllable).toBe("");
  });

  test("input 'ㄱ', input clear, if backspce, then call empty", () => {
    const sut = new HangulIme();
    const onCompose = jest.fn();
    const onEmpty = jest.fn();

    sut.insert("ㄱ");
    sut.clear();
    sut.backspace().onEmpty(onEmpty).onCompose(onCompose);

    expect(onCompose).not.toBeCalled();
    expect(onEmpty).toBeCalled();
    expect(sut.composingSyllable).toBe("");
  });

  test("if backspace, then call empty", () => {
    const sut = new HangulIme();
    const onCompose = jest.fn();
    const onEmpty = jest.fn();

    sut.backspace().onEmpty(onEmpty).onCompose(onCompose);

    expect(onCompose).not.toBeCalled();
    expect(onEmpty).toBeCalled();
    expect(sut.composingSyllable).toBe("");
    expect(sut.imeStep).toBe("empty");
  });

  test("input 'ㄱㅏㄱㅅ', if backspace, then syllable is '각'", () => {
    const sut = new HangulIme();
    const onCompose = jest.fn();
    const onEmpty = jest.fn();
    sut.insert("ㄱ");
    sut.insert("ㅏ");
    sut.insert("ㄱ");
    sut.insert("ㅅ");

    sut.backspace().onEmpty(onEmpty).onCompose(onCompose);

    expect(onCompose).toBeCalled();
    expect(onEmpty).not.toBeCalled();
    expect(sut.composingSyllable).toBe("각");
  });
});

describe("about composingSyllable", () => {
  test("if input 'ㄱㅏㄱㅅㅏ', then '각사'", () => {
    const sut = new HangulIme();

    sut.insert("ㄱ");
    sut.insert("ㅏ");
    sut.insert("ㄱ");
    sut.insert("ㅅ");
    sut.insert("ㅏ");

    expect(sut.latestCompletedSyllable).toBe("각");
    expect(sut.composingSyllable).toBe("사");
  });

  test("if input 'ㄱㅏㅈㅏ', then '가자'", () => {
    const sut = new HangulIme();

    sut.insert("ㄱ");
    sut.insert("ㅏ");
    sut.insert("ㅈ");
    sut.insert("ㅏ");

    expect(sut.latestCompletedSyllable).toBe("가");
    expect(sut.composingSyllable).toBe("자");
  });
});

describe("about clear", () => {
  test("input 'ㄱ', if clear, then empty", () => {
    const sut = new HangulIme();
    sut.insert("ㄱ");

    sut.clear();

    expect(sut.composingSyllable).toBe("");
    expect(sut.imeStep).toBe("empty");
  });

  test("input 'ㄱㄱ', if clear, latestCompletedSyllable is not empty", () => {
    const sut = new HangulIme();
    sut.insert("ㄱ");
    sut.insert("ㄱ");

    sut.clear();

    expect(sut.composingSyllable).toBe("");
    expect(sut.latestCompletedSyllable).toBe("ㄱ");
  });
});
