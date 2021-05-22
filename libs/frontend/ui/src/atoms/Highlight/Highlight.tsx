import { findAll } from 'highlight-words-core';
import React, { useMemo } from 'react';

export interface HighlightProps {
  text: string;
  value: string;
}

export const Highlight = ({ text, value }: HighlightProps) => {
  const chunks = useMemo(() => {
    return findAll({
      searchWords: [value],
      textToHighlight: text,
      caseSensitive: false,
    });
  }, [text, value]);

  return (
    <>
      {chunks.map(({ highlight, start, end }, index) => {
        const child = text.substr(start, end - start);

        return (
          <span key={index} style={{ fontWeight: highlight ? 700 : undefined }}>
            {child}
          </span>
        );
      })}
    </>
  );
};
