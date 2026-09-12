import { Fragment } from 'react';
import type { ReactNode } from 'react';

const DEFAULT_WORDS = [
'Education',
'Skills',
'Opportunities',
'Opportunity',
'Youth'];


/**
 * Wraps a small set of meaning-carrying words in the gradient treatment.
 * The source string is never altered — only how it is painted.
 */
export function highlightWords(
text: string,
words: string[] = DEFAULT_WORDS,
gradientClassName = 'text-gradient')
: ReactNode {
  if (!text) {
    return text;
  }

  const pattern = new RegExp(`(${words.join('|')})`, 'gi');
  const segments = text.split(pattern);

  return (
    <>
      {segments.map((segment, index) => {
        const isMatch = words.some(
          (word) => word.toLowerCase() === segment.toLowerCase()
        );

        return isMatch ?
        <span key={`hl-${index}`} className={gradientClassName}>
            {segment}
          </span> :

        <Fragment key={`txt-${index}`}>{segment}</Fragment>;

      })}
    </>);

}