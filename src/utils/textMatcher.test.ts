import { textMatch } from './textMatcher';

/**
 * "L" => L*
 * "=L" => L
 * "*L*" => *L*
 * "*L" => *L
 * "A B" => A* and B*
 * "A B, C" => (A* and B*) or C*
 * "!A" => all values must not match A
 * "=!A" => all values must not match exactly A
 * Returns true if there's a text match.
 */
describe('textMatch', () => {
  test('textMatch', () => {
    const validate = [
      {
        value: '',
        matched: [''],
        unmatched: ['a', 'a*', '*a*'],
      },
      {
        value: 'two words',
        matched: ['', '*wo', '*or*', 'tw', 'two', 'tw wo', 'tw, rr', '=!tw'],
        unmatched: ['ds', 'o', '=tw', 'tw rr', '!two', '!tw*'],
      },
    ];

    validate.forEach((v) => {
      for (const filter of v.matched) {
        expect(textMatch(v.value, filter), `Must match text: ${v.value} filter: ${filter}`).toBe(true);
      }
      for (const filter of v.unmatched) {
        expect(textMatch(v.value, filter), `Mustn't match text: ${v.value} filter: ${filter}`).toBe(false);
      }
    });
  });
});
