interface WordDiff {
  type: "add" | "remove" | "same";
  content: string;
}

export interface LineDiff {
  type: "add" | "remove" | "same";
  content: string;
  wordDiffs?: WordDiff[];
}

function compareWords(oldStr: string, newStr: string): WordDiff[] {
  const oldWords = oldStr.split(/(\s+)/);
  const newWords = newStr.split(/(\s+)/);
  const result: WordDiff[] = [];
  let i = 0,
    j = 0;

  while (i < oldWords.length || j < newWords.length) {
    if (
      i < oldWords.length &&
      j < newWords.length &&
      oldWords[i] === newWords[j]
    ) {
      result.push({ type: "same", content: oldWords[i] });
      i++;
      j++;
    } else {
      const lookAhead = 3;
      let bestMatch = -1;
      let bestDistance = Infinity;

      for (let k = 0; k <= lookAhead && i + k < oldWords.length; k++) {
        for (let l = 0; l <= lookAhead && j + l < newWords.length; l++) {
          if (oldWords[i + k] === newWords[j + l]) {
            const distance = k + l;
            if (distance < bestDistance) {
              bestDistance = distance;
              bestMatch = k;
            }
          }
        }
      }

      if (bestMatch !== -1) {
        for (let k = 0; k < bestMatch; k++) {
          result.push({ type: "remove", content: oldWords[i + k] });
        }
        for (let l = 0; l < bestDistance - bestMatch; l++) {
          result.push({ type: "add", content: newWords[j + l] });
        }
        i += bestMatch;
        j += bestDistance - bestMatch;
      } else {
        if (i < oldWords.length)
          result.push({ type: "remove", content: oldWords[i++] });
        if (j < newWords.length)
          result.push({ type: "add", content: newWords[j++] });
      }
    }
  }

  return result;
}

export function compareFiles(
  file1Lines: string[],
  file2Lines: string[]
): LineDiff[] {
  const diff: LineDiff[] = [];
  let i = 0,
    j = 0;

  while (i < file1Lines.length || j < file2Lines.length) {
    if (i < file1Lines.length && j < file2Lines.length) {
      if (file1Lines[i] === file2Lines[j]) {
        diff.push({ type: "same", content: file1Lines[i] });
        i++;
        j++;
      } else {
        const lookAhead = 3;
        let bestMatch = -1;
        let bestDistance = Infinity;

        for (let k = 0; k <= lookAhead && i + k < file1Lines.length; k++) {
          for (let l = 0; l <= lookAhead && j + l < file2Lines.length; l++) {
            if (file1Lines[i + k] === file2Lines[j + l]) {
              const distance = k + l;
              if (distance < bestDistance) {
                bestDistance = distance;
                bestMatch = k;
              }
            }
          }
        }

        if (bestMatch !== -1) {
          for (let k = 0; k < bestMatch; k++) {
            diff.push({
              type: "remove",
              content: file1Lines[i + k],
              wordDiffs: compareWords(file1Lines[i + k], ""),
            });
          }
          for (let l = 0; l < bestDistance - bestMatch; l++) {
            diff.push({
              type: "add",
              content: file2Lines[j + l],
              wordDiffs: compareWords("", file2Lines[j + l]),
            });
          }
          i += bestMatch;
          j += bestDistance - bestMatch;
        } else {
          const wordDiffs = compareWords(file1Lines[i], file2Lines[j]);
          if (wordDiffs.some((w) => w.type === "remove")) {
            diff.push({
              type: "remove",
              content: file1Lines[i],
              wordDiffs: wordDiffs.filter((w) => w.type !== "add"),
            });
          }
          if (wordDiffs.some((w) => w.type === "add")) {
            diff.push({
              type: "add",
              content: file2Lines[j],
              wordDiffs: wordDiffs.filter((w) => w.type !== "remove"),
            });
          }
          i++;
          j++;
        }
      }
    } else if (i < file1Lines.length) {
      diff.push({
        type: "remove",
        content: file1Lines[i],
        wordDiffs: compareWords(file1Lines[i], ""),
      });
      i++;
    } else {
      diff.push({
        type: "add",
        content: file2Lines[j],
        wordDiffs: compareWords("", file2Lines[j]),
      });
      j++;
    }
  }

  return diff;
}
