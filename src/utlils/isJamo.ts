import { JamoConstants } from "../JamoConstants";

export default function isJamo(inputKey: string) {
  return (
    inputKey.length === 1 &&
    (JamoConstants.consonants.includes(inputKey) ||
      JamoConstants.vowels.includes(inputKey))
  );
}
