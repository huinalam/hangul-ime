# hangul-ime

## DEMO

[Link](https://ykimn.csb.app/)

## Installation
```
npm install hangul-ime
or
yarn add hangul-ime
```

## Example

### 갃 입력

```ts
const hangulIme = new HangulIme();

hangulIme.insert("ㄱ");
hangulIme.insert("ㅏ");
hangulIme.insert("ㄱ");
hangulIme.insert("ㅅ");

console.log(hangulIme.composingSyllable); // result: 값
```

### 조합 완성된 경우
```ts
const hangulIme = new HangulIme();

hangulIme.insert("ㄱ");
hangulIme.insert("ㅏ");
hangulIme.insert("ㄱ");
hangulIme.insert("ㅅ");
hangulIme.insert("ㅏ");

console.log(hangulIme.completedSyllable); // result: 각
console.log(hangulIme.composingSyllable); // result: 사
```

### 조합 완성된 경우, 콜백으로 분기 처리

```ts
const hangulIme = new HangulIme();
let actualCompletedSyllable = "";
let actualComposingSyllable = "";
const onComplete = (completedSyllable: string, composingSyllable: string) => {
  actualCompletedSyllable = completedSyllable;
  actualComposingSyllable = composingSyllable;
};
const onCompose = (composingSyllable: string) => {
  actualComposingSyllable = composingSyllable;
}

hangulIme.insert("ㄱ").onComplete(onComplete).onCompose(onCompose);
hangulIme.insert("ㅏ").onComplete(onComplete).onCompose(onCompose);
hangulIme.insert("ㄱ").onComplete(onComplete).onCompose(onCompose);
hangulIme.insert("ㅅ").onComplete(onComplete).onCompose(onCompose);
hangulIme.insert("ㅏ").onComplete(onComplete).onCompose(onCompose);

console.log(actualCompletedSyllable); // result: 각
console.log(actualComposingSyllable); // result: 사
```

### 조합 완성된 경우, 조건절로 분기 처리

```ts
const hangulIme = new HangulIme();
let actualCompletedSyllable = "";
let actualComposingSyllable = "";

hangulIme.insert("ㄱ");
hangulIme.insert("ㅏ");
hangulIme.insert("ㄱ");
hangulIme.insert("ㅅ");
hangulIme.insert("ㅏ");

if (hangulIme.step === "completed") {
  actualCompletedSyllable = hangulIme.latestCompletedSyllable;
  actualComposingSyllable = hangulIme.composingSyllable;
}

console.log(actualCompletedSyllable); // result: 각
console.log(actualComposingSyllable); // result: 사
```

## Concept

- MS Windows 한글 IME 입력 방법을 따른다.

### 자모 블록 (JamoBlock)

- 자음, 모음을 통칭한다.

ex) ㄱ, ㄴ, ㄷ, ㅏ, ㅑ, ㅓ, ㅕ

### 한글 음절 (HangulSyllable)

- 자음, 모음의 조합이다.

ex) 가, 나, 값, ㅘ, ㄳ

### character

자음, 모음, 완성형 글자 등의 글자

## Related Link

- [Mole Virtual Keyboard](https://github.com/huinalam/mole-virtual-keyboard)
- [NPM Package](https://www.npmjs.com/package/hangul-ime)
- [Github](https://github.com/huinalam/hangul-ime)