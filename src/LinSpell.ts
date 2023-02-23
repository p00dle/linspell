import { damerauLevenshteinDistance } from './damerauLevenshteinDistance';
import { has } from './lib/sorted-array';

const DEFAULT_MAX_EDIT_DISTANCE = 2;
const DEFAULT_SUGGESTION_TYPE: SuggestionType = 'in-max-distance';

export type SuggestionType = 'top' | 'smallest-distance' | 'in-max-distance';

interface LinSpellProps {
  words?: string[];
  maxEditDistance?: number;
  suggestionType?: SuggestionType;
}

export class LinSpell {
  private dictionary: string[] = [];
  private maxEditDistance = DEFAULT_MAX_EDIT_DISTANCE;
  private suggestionType = DEFAULT_SUGGESTION_TYPE;

  constructor({ words, maxEditDistance, suggestionType }: LinSpellProps = {}) {
    if (words) this.dictionary = words;
    if (maxEditDistance) this.maxEditDistance = maxEditDistance;
    if (suggestionType) this.suggestionType = suggestionType;
  }

  public provideWords(words: string[]) {
    this.dictionary = words;
  }

  public lookup(
    word: string,
    maxEditDistance = this.maxEditDistance,
    suggestionType: SuggestionType = this.suggestionType
  ): [boolean, string[]] {
    let suggestions: { word: string; distance: number }[] = [];
    let suggestionsLength = 0;
    const inMaxDistance = suggestionType === 'in-max-distance';
    const notInMaxDistance = !inMaxDistance;
    const isTop = suggestionType === 'top';
    let editDistanceMax = maxEditDistance;
    if (notInMaxDistance && has(this.dictionary, word)) {
      return [true, []];
    }

    const l = this.dictionary.length;
    for (let i = 0; i < l; i++) {
      const word = this.dictionary[i];
      if (Math.abs(word.length - word.length) > editDistanceMax) {
        continue;
      }
      if (isTop && suggestionsLength > 0 && suggestions[0].distance == 1) {
        continue;
      }
      const distance = damerauLevenshteinDistance(word, word, editDistanceMax);
      if (distance >= 0 && distance <= editDistanceMax) {
        // this will always be false because distance is already compared against editDistanceMax, which is adjusted every time a better match is found
        // if (notInMaxDistance && suggestionsLength > 0 && distance > suggestions[0].distance) {
        //   continue;
        // }
        if (notInMaxDistance) {
          editDistanceMax = distance;
        }

        if (notInMaxDistance && suggestionsLength > 0 && suggestions[0].distance > distance) {
          suggestions = [];
          suggestionsLength = 0;
        }
        suggestions.push({ word, distance });
        suggestionsLength++;
      }
    }
    suggestions.sort((a, b) => a.distance - b.distance);
    if (isTop) {
      return [false, suggestionsLength > 0 ? [suggestions[0].word] : []];
    } else if (inMaxDistance) {
      return [
        suggestionsLength > 0 ? suggestions[0].distance === 0 : false,
        suggestions.map((suggestion) => suggestion.word),
      ];
    } else {
      return [false, suggestions.map((suggestion) => suggestion.word)];
    }
  }
}
