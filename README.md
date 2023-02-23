### Overview

No dependency TypeScript implementation of Linspell spell checking algorithm optimised for performance and low memory footprint

### Installation

```shell
yarn install linspell
```

or

```shell
npm install linspell
```

### API

#### LinSpell

Creates an instance of LinSpell class

- input
  - words?: string[] (default: [])
  - maxEditDistance?: number (default: 2)
  - suggestionType?: [SuggestionType](#suggestiontype) (default: 'in-max-distance')
- output
  - LinSpell instance

Note: words array is expected to be sorted as search for exact match is done using binary search algorithm

Example

```ts
import { LinSpell } from 'linspell';

const defaultChecker = new LinSpell();
const customChecker = new LinSpell({
  words: ['elo', 'hello', 'hell', 'help'].sort(),
  maxEditDistance: 3,
  suggestionType: 'top',
});
```

#### LinSpell#provideWords

Overrides instance's dictionary with provided array of words; array is expected to be sorted

- input
  - words: string[]
- output: none

Example

```ts
import { LinSpell } from 'linspell';

const words = ['elo', 'hello', 'hell', 'help'].sort();
const checker = new LinSpell();
checker.provideWords(words);
```

#### LinSpell#lookup

Provides match results for given word in instance's dictionary

- input
  - word: string
  - maxEditDistance?: number (default: instance's maxEditDistance)
  - suggestionType?: [SuggestionType](#suggestiontype) (default: instance's suggestionType)
- output
  - found: boolean; signifies whether an exact match was found
  - suggestions: string[]; suggestions sorted from best to worst match

Example

```ts
import { LinSpell } from 'linspell';

const words = ['elo', 'hello', 'hell', 'help'].sort();
const checker = new LinSpell();
checker.provideWords(['bar', 'foo']);
console.log(checker.lookup('foo')); // [true, ['foo']]
```

#### SuggestionType

- 'top' - returns only the best match; best performance
- 'smallest-distance' - returns all matches with the lowest distance found; medium performance
- 'in-max-distance' - returns all matches with distance lower than maxEditDistance; worst performance
