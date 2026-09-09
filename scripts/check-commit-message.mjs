#!/usr/bin/env node
// Validates a commit message (or a pull request title) against the plain
// English convention this repo uses: a capitalized imperative subject of at
// most ten words and sixty characters, no Conventional Commit prefix, no
// colon, no trailing punctuation, and a body of at most four short lines.
// Runs from the lefthook commit-msg hook (--file) and from CI on PR titles
// (--env PR_TITLE). Ported from the SiteCMD web repo.

import fs from 'node:fs';

const MAX_SUBJECT_LENGTH = 60;
const MAX_SUBJECT_WORDS = 10;
const MAX_BODY_LENGTH = 400;
const MAX_BODY_LINES = 4;

const CONVENTIONAL_PREFIX =
  /^(?:build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(?:!?:|\([^)]*\)!?:)\s*/i;
const TICKET_PREFIX = /^(?:\[[^\]]+\]|[A-Z][A-Z0-9]+-\d+:?)\s+/;
const NON_IMPERATIVE_OPENING =
  /^(?:Added|Changed|Created|Documented|Fixed|Hardened|Implemented|Improved|Moved|Refactored|Removed|Renamed|Updated|Adding|Changing|Creating|Documenting|Fixing|Hardening|Implementing|Improving|Moving|Refactoring|Removing|Renaming|Updating)\b/;
const VAGUE_SUBJECT =
  /^(?:(?:more|miscellaneous|misc) changes?|updates?|fix(?:es)?|cleanup|wip|work in progress|(?:fix|address|resolve|handle) (?:issues|feedback|findings|problems))$/i;
const TRAILER = /^(?:Signed-off-by|Reviewed-by|Refs|Closes|Fixes):\s+\S/i;

// Dependabot writes its own titles and offers no template. Its shapes are
// already imperative, colon-free plain English; only the length is relaxed.
const DEPENDENCY_BUMP = [
  /^Bump \S+ from \S+ to \S+(?: in the \S+ group)?$/,
  /^Bump the \S+ group (?:across \d+ director(?:y|ies) )?with \d+ updates?$/,
];

function isDependencyBump(subject) {
  return DEPENDENCY_BUMP.some((pattern) => pattern.test(subject));
}

function visibleLines(message) {
  const lines = String(message ?? '')
    .replace(/\r\n?/g, '\n')
    .split('\n');
  const scissors = lines.findIndex((line) => /^# -+ >8 -+/.test(line));
  const beforeScissors = scissors === -1 ? lines : lines.slice(0, scissors);
  return beforeScissors.filter((line) => !line.startsWith('#'));
}

export function commitMessageFailures(message, { subjectOnly = false } = {}) {
  const lines = visibleLines(message);
  while (lines.length > 0 && lines.at(-1).trim() === '') lines.pop();
  while (lines.length > 0 && lines[0].trim() === '') lines.shift();

  const subject = lines[0]?.trim() ?? '';
  if (!subject) return ['Write a commit subject.'];

  const failures = [];
  const words = subject.split(/\s+/u);

  if (subject.length > MAX_SUBJECT_LENGTH && !isDependencyBump(subject)) {
    failures.push(
      `Keep the subject at ${MAX_SUBJECT_LENGTH} characters or fewer.`,
    );
  }
  if (words.length < 2) {
    failures.push('Name both an action and the thing it changes.');
  } else if (words.length > MAX_SUBJECT_WORDS && !isDependencyBump(subject)) {
    failures.push(`Keep the subject at ${MAX_SUBJECT_WORDS} words or fewer.`);
  }
  if (!/^[A-Z]/.test(subject)) {
    failures.push('Start the subject with a capitalized imperative verb.');
  }
  if (CONVENTIONAL_PREFIX.test(subject)) {
    failures.push('Remove the Conventional Commit prefix.');
  }
  if (TICKET_PREFIX.test(subject)) {
    failures.push('Move ticket references out of the subject prefix.');
  }
  if (subject.includes(':')) {
    failures.push('Write one plain-English subject without a prefix or colon.');
  }
  if (/[.!?;:]$/.test(subject)) {
    failures.push('Do not end the subject with punctuation.');
  }
  if (NON_IMPERATIVE_OPENING.test(subject)) {
    failures.push(
      'Use the imperative form, such as Add, Fix, Remove, or Update.',
    );
  }
  if (VAGUE_SUBJECT.test(subject)) {
    failures.push('Name the specific behavior or component being changed.');
  }
  if (/^\s*co-authored-by:/im.test(String(message ?? ''))) {
    failures.push(
      'Do not add Co-authored-by trailers; commits carry one author.',
    );
  }

  if (!subjectOnly) {
    const hasBody = lines.slice(1).some((line) => line.trim() !== '');
    if (hasBody && lines[1]?.trim() !== '') {
      failures.push('Leave a blank line between the subject and body.');
    }

    const bodyLines = lines
      .slice(2)
      .map((line) => line.trim())
      .filter((line) => line !== '' && !TRAILER.test(line));
    if (bodyLines.length > MAX_BODY_LINES) {
      failures.push(
        `Keep the body at ${MAX_BODY_LINES} non-empty lines or fewer.`,
      );
    }
    if (bodyLines.join('\n').length > MAX_BODY_LENGTH) {
      failures.push(`Keep the body at ${MAX_BODY_LENGTH} characters or fewer.`);
    }
  }

  return [...new Set(failures)];
}

function fail(message) {
  process.stderr.write(`Commit message check failed: ${message}\n`);
  process.exit(2);
}

function main() {
  const args = process.argv.slice(2);
  let message;
  let subjectOnly = false;

  if (args[0] === '--file' && args[1]) {
    try {
      message = fs.readFileSync(args[1], 'utf8');
    } catch (error) {
      fail(`cannot read ${args[1]}: ${error.message}`);
    }
  } else if (args[0] === '--env' && args[1]) {
    message = process.env[args[1]];
    subjectOnly = true;
    if (message === undefined)
      fail(`environment variable ${args[1]} is not set`);
  } else {
    fail('use --file <commit-message-file> or --env <variable-name>');
  }

  const failures = commitMessageFailures(message, { subjectOnly });
  if (failures.length === 0) process.exit(0);

  process.stderr.write(
    'Commit message must be clear, concise, and written in plain English:\n',
  );
  for (const failure of failures) process.stderr.write(`- ${failure}\n`);
  process.stderr.write('Example: Add security headers for Cloudflare Pages\n');
  process.exit(1);
}

if (
  process.argv[1] &&
  import.meta.url === new URL(`file://${process.argv[1]}`).href
) {
  main();
}
