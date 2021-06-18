export const matchAllIndexes = (text: string, regex: RegExp) => {
  let match: RegExpExecArray | null;

  const matches: [startIndex: number, endIndex: number][] = [];

  do {
    match = regex.exec(text);

    if (match) {
      matches.push([match.index, match.index + match[0].length]);
    }
  } while (match);

  return matches;
};
