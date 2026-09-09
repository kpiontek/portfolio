// Renders the whole page to HTML and checks the structure a screen reader,
// a keyboard user, and a search crawler depend on.
//
// Real regressions this catches: a second h1 or a skipped heading level added
// while restyling a section, an image pasted in without alt text, a product
// card losing one of its two video sources (so Safari or Firefox shows a
// blank box), a target="_blank" link without rel="noreferrer" or without
// telling a screen reader a new tab is coming, an inline style creeping back
// into a codebase that keeps all styling in Portfolio.scss, and product link
// copy drifting away from the "Visit {Name}" pattern.
import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import Portfolio from '../src/Portfolio.jsx';

const root = fileURLToPath(new URL('..', import.meta.url));
const html = renderToString(createElement(Portfolio));
const indexHtml = readFileSync(root + 'index.html', 'utf8');

const NAMED_ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

/** Turns rendered HTML back into the text a person would hear or read. */
function toText(fragment) {
  return fragment
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, digits) => String.fromCodePoint(Number(digits)))
    .replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (_, name) => NAMED_ENTITIES[name])
    .replace(/\s+/g, ' ')
    .trim();
}

function parseAttributes(attributeText) {
  const attributes = {};
  const pattern =
    /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let match;
  while ((match = pattern.exec(attributeText)) !== null) {
    attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? '';
  }
  return attributes;
}

/** Container elements (`<a>`, `<video>`, ...). None of these nest on this page. */
function elements(source, tag) {
  const found = [];
  const pattern = new RegExp(`<${tag}\\b([^>]*)>([\\s\\S]*?)</${tag}>`, 'gi');
  let match;
  while ((match = pattern.exec(source)) !== null) {
    found.push({
      attributes: parseAttributes(match[1]),
      inner: match[2],
      outer: match[0],
    });
  }
  return found;
}

/** Self-closing elements (`<img />`, `<source />`). */
function voidElements(source, tag) {
  const found = [];
  const pattern = new RegExp(`<${tag}\\b([^>]*?)/?>`, 'gi');
  let match;
  while ((match = pattern.exec(source)) !== null) {
    found.push({ attributes: parseAttributes(match[1]), outer: match[0] });
  }
  return found;
}

const anchors = elements(html, 'a');
const headings = [
  ...html.matchAll(/<h([1-6])\b([^>]*)>([\s\S]*?)<\/h\1>/gi),
].map((match) => ({ level: Number(match[1]), text: toText(match[3]) }));
const projectCards = elements(html, 'article').filter((element) =>
  (element.attributes.class ?? '').split(/\s+/).includes('project-card'),
);

const NEW_TAB_PHRASE = /opens in a new tab/i;

describe('page structure', () => {
  it('renders', () => {
    expect(html.length).toBeGreaterThan(2000);
    expect(html).toContain('class="portfolio"');
  });

  it('has exactly one h1', () => {
    const h1s = headings.filter((heading) => heading.level === 1);
    expect(h1s.map((heading) => heading.text)).toEqual(["Hey, I'm Kyle."]);
  });

  it('has the section headings the nav promises', () => {
    const h2s = headings
      .filter((heading) => heading.level === 2)
      .map((heading) => heading.text);

    expect(h2s).toContain('Selected work');
    expect(h2s).toContain('Experience');
    expect(h2s).toContain('About');

    // The contact section's heading is conversational, so match the section
    // rather than the exact words.
    const contactSection = html.match(
      /<section class="contact"[\s\S]*?<\/section>/,
    )?.[0];
    expect(contactSection, 'no contact section rendered').toBeTruthy();
    const contactHeading = elements(contactSection, 'h2')[0];
    expect(contactHeading, 'contact section has no h2').toBeTruthy();
    expect(toText(contactHeading.inner).length).toBeGreaterThan(3);
    expect(h2s).toContain(toText(contactHeading.inner));
  });

  it('never skips a heading level', () => {
    let previous = 0;
    for (const heading of headings) {
      if (previous !== 0) {
        expect(
          heading.level,
          `h${heading.level} "${heading.text}" follows an h${previous}`,
        ).toBeLessThanOrEqual(previous + 1);
      }
      previous = heading.level;
    }
    expect(headings[0].level).toBe(1);
  });

  it('renders exactly four project cards', () => {
    expect(projectCards).toHaveLength(4);
  });

  it('points the skip link at an element that exists', () => {
    const skipLink = anchors.find((anchor) =>
      (anchor.attributes.class ?? '').includes('skip-link'),
    );
    expect(skipLink, 'no skip link rendered').toBeTruthy();
    expect(toText(skipLink.inner)).toBe('Skip to main content');

    const targetId = skipLink.attributes.href.replace(/^#/, '');
    expect(targetId).not.toBe('');
    expect(
      html.includes(`id="${targetId}"`),
      `skip link points at #${targetId}, which nothing on the page has`,
    ).toBe(true);
  });

  it('keeps styling in the stylesheet', () => {
    // The site has no inline styles; effects set custom properties at runtime
    // instead. An inline style in the markup means someone bypassed the CSP
    // and Portfolio.scss at once.
    expect(html).not.toContain('style="');
  });
});

describe('media', () => {
  it('gives every image an alt attribute', () => {
    const images = voidElements(html, 'img');
    expect(images.length).toBeGreaterThan(0);

    for (const image of images) {
      const { alt, 'aria-hidden': hidden } = image.attributes;
      expect(
        alt,
        `<img> without an alt attribute: ${image.outer}`,
      ).toBeDefined();

      if (alt.trim() === '') {
        expect(
          hidden,
          `decorative image needs aria-hidden="true": ${image.outer}`,
        ).toBe('true');
      }
    }
  });

  it('hides the product recordings from assistive tech and plays them safely', () => {
    const videos = elements(html, 'video');
    expect(videos).toHaveLength(4);

    for (const video of videos) {
      const { attributes, inner } = video;

      // The recordings are decoration; the surrounding link carries the name.
      expect(attributes['aria-hidden']).toBe('true');
      expect(attributes.tabindex).toBe('-1');

      // A poster plus intrinsic dimensions keeps the card from reflowing.
      expect(attributes.poster ?? '').not.toBe('');
      expect(attributes.width).toBe('1200');
      expect(attributes.height).toBe('750');

      // Autoplay only works when the video is muted, and it has to loop
      // silently without taking over the viewport on iOS.
      expect(attributes).toHaveProperty('muted');
      expect(attributes).toHaveProperty('playsinline');
      expect(attributes).toHaveProperty('loop');

      const types = voidElements(inner, 'source').map(
        (source) => source.attributes.type,
      );
      expect(types.sort()).toEqual(['video/mp4', 'video/webm']);
    }
  });
});

describe('links', () => {
  it('uses only safe href schemes', () => {
    expect(anchors.length).toBeGreaterThan(10);

    for (const anchor of anchors) {
      const href = anchor.attributes.href ?? '';
      expect(
        /^(#|\/|mailto:|https:\/\/)/.test(href),
        `unexpected href: ${href}`,
      ).toBe(true);
    }
  });

  it('sets rel="noreferrer" on every link that opens a new tab', () => {
    const external = anchors.filter(
      (anchor) => anchor.attributes.target === '_blank',
    );
    expect(external.length).toBeGreaterThan(5);

    for (const anchor of external) {
      expect(
        anchor.attributes.rel ?? '',
        `missing rel="noreferrer": ${anchor.attributes.href}`,
      ).toContain('noreferrer');
    }
  });

  it('gives every new-tab link an accessible name', () => {
    const external = anchors.filter(
      (anchor) => anchor.attributes.target === '_blank',
    );

    for (const anchor of external) {
      const name = anchor.attributes['aria-label'] || toText(anchor.inner);
      expect(name, `link with no accessible name: ${anchor.outer}`).not.toBe(
        '',
      );
    }
  });

  it('warns screen reader users before opening a new tab', () => {
    const external = anchors.filter(
      (anchor) => anchor.attributes.target === '_blank',
    );

    const silent = external
      .map((anchor) => anchor.attributes['aria-label'] || toText(anchor.inner))
      .filter((name) => !NEW_TAB_PHRASE.test(name));

    const unexpected = silent;

    expect(
      unexpected,
      'these links open a new tab without saying so, in visible text, ' +
        `sr-only text, or an aria-label:\n${unexpected.join('\n')}`,
    ).toEqual([]);
  });
});

describe('product cards', () => {
  const EXPECTED_LINK_TEXT = [
    'Visit SiteCMD',
    'Visit Visit Your Team',
    'Visit Was It Vibed',
    'Visit SmartHomeU',
  ];

  it('labels each product link "Visit {Name}"', () => {
    const linkText = projectCards.map((card) => {
      const link = elements(card.inner, 'a').find((anchor) =>
        (anchor.attributes.class ?? '').split(/\s+/).includes('text-link'),
      );
      expect(link, 'a project card has no text link').toBeTruthy();
      // Drop the sr-only suffix, keeping the visible words only.
      return toText(
        link.inner.replace(/<span class="sr-only">[\s\S]*?<\/span>/, ''),
      );
    });

    expect(linkText).toEqual(EXPECTED_LINK_TEXT);
  });

  it('keeps each link name in step with the card heading', () => {
    for (const card of projectCards) {
      const name = toText(elements(card.inner, 'h3')[0].inner);
      const link = elements(card.inner, 'a').find((anchor) =>
        (anchor.attributes.class ?? '').split(/\s+/).includes('text-link'),
      );
      const visible = toText(
        link.inner.replace(/<span class="sr-only">[\s\S]*?<\/span>/, ''),
      );

      expect(visible).toBe(`Visit ${name}`);
    }
  });

  it('sends the media link and the text link to the same product', () => {
    for (const card of projectCards) {
      const cardAnchors = elements(card.inner, 'a');
      const media = cardAnchors.find((anchor) =>
        (anchor.attributes.class ?? '').split(/\s+/).includes('project-media'),
      );
      const text = cardAnchors.find((anchor) =>
        (anchor.attributes.class ?? '').split(/\s+/).includes('text-link'),
      );

      expect(media.attributes.href).toBe(text.attributes.href);
      expect(media.attributes.href).toMatch(/^https:\/\//);
    }
  });
});

describe('contact details', () => {
  const hrefs = anchors.map((anchor) => anchor.attributes.href);

  it('lists the email, LinkedIn, and GitHub', () => {
    expect(hrefs).toContain('mailto:hello@kylepiontek.com');
    expect(hrefs).toContain('https://www.linkedin.com/in/kyle-piontek');
    expect(hrefs).toContain('https://github.com/kpiontek');
  });

  it('matches the sameAs profiles in the index.html JSON-LD', () => {
    const jsonLd = JSON.parse(
      indexHtml.match(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
      )[1],
    );

    // A profile URL changed in one place and not the other is the kind of
    // thing nobody notices until a recruiter clicks a dead link.
    expect(jsonLd.sameAs.sort()).toEqual(
      [
        'https://github.com/kpiontek',
        'https://www.linkedin.com/in/kyle-piontek',
      ].sort(),
    );

    for (const profile of jsonLd.sameAs) {
      expect(
        hrefs,
        `${profile} is in the JSON-LD but not on the page`,
      ).toContain(profile);
    }
  });
});
