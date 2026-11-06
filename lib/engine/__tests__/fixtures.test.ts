import { describe, it, expect } from 'vitest';
import { FIXTURES } from '../__fixtures__/messages';
import { analyze } from '../index';

describe('fixtures', () => {
  it.each(FIXTURES)('$id → $expectedLevel', (fixture) => {
    const verdict = analyze(fixture.text);
    const ids = verdict.signals.map((signal) => signal.id);

    expect(verdict.level).toBe(fixture.expectedLevel);

    for (const id of fixture.mustInclude ?? []) {
      expect(ids).toContain(id);
    }

    for (const id of fixture.mustNotInclude ?? []) {
      expect(ids).not.toContain(id);
    }
  });
});
