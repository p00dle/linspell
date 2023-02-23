// ported from C#
// https://raw.githubusercontent.com/wolfgarbe/LinSpell/master/linspell/DamerauLevenshtein/DamerauLevenshtein.cs

export function damerauLevenshteinDistance(word1: string, word2: string, maxEditDistance: number): number {
  if (word1.length === 0) return word2.length;
  if (word2.length === 0) return word1.length;
  // eslint-disable-next-line prefer-const
  let [string1, string2] = word1.length > word2.length ? [word2, word1] : [word1, word2];
  let sLen = string1.length;
  let tLen = string2.length;
  while (sLen > 0 && string1[sLen - 1] === string2[tLen - 1]) {
    sLen--;
    tLen--;
  }
  let start = 0;

  if (string1[0] === string2[0] || sLen === 0) {
    while (start < sLen && string1[start] === string2[start]) {
      start++;
    }
    sLen -= start;
    tLen -= start;
    if (sLen == 0) return tLen;
    string2 = string2.slice(start, start + tLen);
  }

  const lenDiff = tLen - sLen;
  let maxDistance = maxEditDistance;
  if (maxDistance < 0 || maxDistance > tLen) {
    maxDistance = tLen;
  } else if (lenDiff > maxDistance) {
    return -1;
  }

  const v0 = [];
  const v2 = [];
  let j = 0;
  for (; j < maxDistance; j++) {
    v0[j] = j + 1;
  }
  for (; j < tLen; j++) {
    v0[j] = maxDistance + 1;
  }

  const jStartOffset = maxDistance - (tLen - sLen);
  const haveMax = maxDistance < tLen;
  let jStart = 0;
  let jEnd = maxDistance;
  let sChar = string1[0];
  let current = 0;
  for (let i = 0; i < sLen; i++) {
    const prevsChar = sChar;
    sChar = string1[start + i];
    let tChar = string2[0];
    let left = i;
    current = left + 1;
    let nextTransCost = 0;
    jStart += i > jStartOffset ? 1 : 0;
    jEnd += jEnd < tLen ? 1 : 0;
    for (j = jStart; j < jEnd; j++) {
      const above = current;
      let thisTransCost = nextTransCost;
      nextTransCost = v2[j];
      v2[j] = left;
      current = left;
      left = v0[j];
      const prevtChar = tChar;
      tChar = string2[j];
      if (sChar != tChar) {
        if (left < current) {
          current = left;
        }
        if (above < current) {
          current = above;
        }
        current++;
        if (i !== 0 && j !== 0 && sChar === prevtChar && prevsChar === tChar) {
          thisTransCost++;
          if (thisTransCost < current) {
            current = thisTransCost;
          }
        }
      }
      v0[j] = current;
    }
    if (haveMax && v0[i + lenDiff] > maxDistance) {
      return -1;
    }
  }
  return current;
}
