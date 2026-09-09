import { describe, expect, it } from 'vitest';
import { commitMessageFailures } from '../scripts/check-commit-message.mjs';

// The checker runs from the commit-msg hook and on pull request titles. These
// cases pin the convention so a "helpful" rewrite cannot quietly relax it.
describe('commit message convention', () => {
  it('accepts a plain imperative subject', () => {
    expect(
      commitMessageFailures('Add security headers for Cloudflare Pages'),
    ).toEqual([]);
  });

  it('accepts a short body separated by a blank line', () => {
    const message = [
      'Prerender the page at build time',
      '',
      'Recruiters who view source saw an empty root div.',
      'The client bundle now hydrates the rendered markup.',
    ].join('\n');
    expect(commitMessageFailures(message)).toEqual([]);
  });

  it('rejects the Conventional Commit prefix and colon', () => {
    const failures = commitMessageFailures('feat: add prerendering');
    expect(failures).toContain('Remove the Conventional Commit prefix.');
    expect(failures).toContain(
      'Write one plain-English subject without a prefix or colon.',
    );
  });

  it('rejects past tense, vague subjects, and trailing punctuation', () => {
    expect(commitMessageFailures('Fixed the menu.')).toEqual(
      expect.arrayContaining([
        'Use the imperative form, such as Add, Fix, Remove, or Update.',
        'Do not end the subject with punctuation.',
      ]),
    );
    expect(commitMessageFailures('Misc changes')).toContain(
      'Name the specific behavior or component being changed.',
    );
    expect(commitMessageFailures('fix')).toEqual(
      expect.arrayContaining(['Name both an action and the thing it changes.']),
    );
  });

  it('caps the subject at ten words and sixty characters', () => {
    const long =
      'Add a very long subject line that keeps going well past limit';
    expect(commitMessageFailures(long)).toEqual(
      expect.arrayContaining([
        'Keep the subject at 60 characters or fewer.',
        'Keep the subject at 10 words or fewer.',
      ]),
    );
  });

  it('caps the body at four non-empty lines', () => {
    const message = ['Tighten hero spacing', '', 'a', 'b', 'c', 'd', 'e'].join(
      '\n',
    );
    expect(commitMessageFailures(message)).toContain(
      'Keep the body at 4 non-empty lines or fewer.',
    );
  });

  it('requires a blank line before the body', () => {
    expect(
      commitMessageFailures('Tighten hero spacing\nBecause it was tall'),
    ).toContain('Leave a blank line between the subject and body.');
  });

  it('refuses tool attribution trailers', () => {
    const message =
      'Update resume PDF\n\nCo-Authored-By: Someone <x@example.com>';
    expect(commitMessageFailures(message)).toContain(
      'Do not add Co-authored-by trailers; commits carry one author.',
    );
  });

  it('ignores comment lines and everything after the scissors marker', () => {
    const message = [
      '# Please enter the commit message',
      'Remove unused project screenshots',
      '# ------------------------ >8 ------------------------',
      'diff --git a/x b/x',
    ].join('\n');
    expect(commitMessageFailures(message)).toEqual([]);
  });

  it('relaxes only the length rules for Dependabot titles', () => {
    const title =
      'Bump the npm-minor-patch group across 1 directory with 12 updates';
    expect(commitMessageFailures(title, { subjectOnly: true })).toEqual([]);
    expect(
      commitMessageFailures('bump the npm-minor-patch group with 2 updates', {
        subjectOnly: true,
      }),
    ).toContain('Start the subject with a capitalized imperative verb.');
  });
});
