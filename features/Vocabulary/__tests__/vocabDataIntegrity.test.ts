import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

type RawVocabEntry = {
  jmdict_seq: string;
  kana: string;
  kanji: string;
  waller_definition: string;
};

const here = dirname(fileURLToPath(import.meta.url));
const n5: RawVocabEntry[] = JSON.parse(
  readFileSync(join(here, '../../../public/data-vocab', 'n5.json'), 'utf8'),
) as RawVocabEntry[];

/**
 * Guards the data behind https://github.com/lingdojo/kana-dojo/issues/32499:
 * JMDict entry 1483185 (あちら/あっち) was split into two n5 rows — あちら
 * ("there") and あっち ("over there") — so the practice games treated two
 * readings of the same word as competing words: answering "achira" was
 * marked wrong while the key expected "acchi". The entry is a single row
 * now, with both meanings, so the variants can no longer compete.
 */
describe('vocab data: jmdict_seq 1483185 (あちら/あっち)', () => {
  it('has a single n5 row for the entry', () => {
    const rows = n5.filter(row => row.jmdict_seq === '1483185');
    expect(rows).toHaveLength(1);
  });

  it('keeps the primary reading あちら with both meanings', () => {
    const row = n5.find(row => row.jmdict_seq === '1483185');
    expect(row?.kana).toBe('あちら');
    expect(row?.waller_definition).toBe('there, over there');
  });
});
