import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './Portfolio.scss';

import headshotImg from './assets/headshot.webp';
import heroContours from './assets/hero-contours.svg?raw';
import sitecmdPoster from './assets/projects/sitecmd-poster.webp';
import sitecmdWebm from './assets/projects/sitecmd.webm';
import sitecmdMp4 from './assets/projects/sitecmd.mp4';
import smartHomeUPoster from './assets/projects/smarthomeu-poster.webp';
import smartHomeUWebm from './assets/projects/smarthomeu.webm';
import smartHomeUMp4 from './assets/projects/smarthomeu.mp4';
import visitYourTeamPoster from './assets/projects/visit-your-team-poster.webp';
import visitYourTeamWebm from './assets/projects/visit-your-team.webm';
import visitYourTeamMp4 from './assets/projects/visit-your-team.mp4';
import wasItVibedPoster from './assets/projects/was-it-vibed-poster.webp';
import wasItVibedWebm from './assets/projects/was-it-vibed.webm';
import wasItVibedMp4 from './assets/projects/was-it-vibed.mp4';

const experience = [
  {
    dates: 'May 2025 - Present',
    role: 'Senior Web Developer',
    company: 'Digital Artisans',
  },
  {
    dates: 'Apr 2024 - Apr 2025',
    role: 'Full Stack Web Developer',
    company: 'Optiv Security',
  },
  {
    dates: 'Jun 2020 - Apr 2024',
    role: 'Software Engineer',
    company: 'Tyler Technologies',
  },
  {
    dates: 'Feb 2019 - Jun 2020',
    role: 'Full Stack Engineer',
    company: 'CashorTrade.org',
  },
  {
    dates: 'Feb 2017 - Feb 2019',
    role: 'Front-End Engineer',
    company: 'Bluehouse Group',
  },
  {
    dates: 'Jun 2014 - Jun 2016',
    role: 'Full Stack Engineer (Contract)',
    company: 'Blue Coda',
  },
  {
    dates: 'Jun 2013 - Jun 2014',
    role: 'Web Developer (Contract)',
    company: 'Hark Digital',
  },
  {
    dates: 'Oct 2011 - Jun 2013',
    role: 'Web Developer',
    company: 'Red Barn Media Group',
  },
];

// The recordings stay on their posters until a visitor presses play, so
// nothing on the page moves on its own. preload="none" also keeps the
// megabytes of video off the wire for anyone who never watches.
function ProductMedia({ href, name, label, poster, webm, mp4 }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.muted = true;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  return (
    <div className="project-media-wrap">
      <a
        className="project-media"
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={label}
      >
        <video
          ref={videoRef}
          className="project-video"
          poster={poster}
          width="1200"
          height="750"
          muted
          playsInline
          loop
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src={webm} type="video/webm" />
          <source src={mp4} type="video/mp4" />
        </video>
      </a>
      <button
        type="button"
        className="media-toggle"
        onClick={toggle}
        aria-label={`${playing ? 'Pause' : 'Play'} the ${name} preview`}
      >
        {playing ? (
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <rect x="3" y="2" width="3.5" height="12" fill="currentColor" />
            <rect x="9.5" y="2" width="3.5" height="12" fill="currentColor" />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M4 2.2v11.6L13.5 8z" fill="currentColor" />
          </svg>
        )}
      </button>
    </div>
  );
}

function Portfolio() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Hide the header while scrolling down and bring it back on any scroll up.
  // It never hides near the top, while the mobile menu is open, or while
  // keyboard focus is inside it.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return undefined;

    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const nearTop = y <= header.offsetHeight;
      if (nearTop) {
        header.classList.remove('is-hidden');
      } else if (Math.abs(y - lastY) > 6) {
        const hide =
          y > lastY &&
          !header.contains(document.activeElement) &&
          !document.body.classList.contains('menu-open');
        header.classList.toggle('is-hidden', hide);
      }
      lastY = y;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const onFocusIn = () => header.classList.remove('is-hidden');

    window.addEventListener('scroll', onScroll, { passive: true });
    header.addEventListener('focusin', onFocusIn);

    return () => {
      window.removeEventListener('scroll', onScroll);
      header.removeEventListener('focusin', onFocusIn);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [mobileMenuOpen]);

  useLayoutEffect(() => {
    const obscured = [
      document.getElementById('main-content'),
      document.querySelector('.site-footer'),
    ];

    if (mobileMenuOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.setProperty(
        '--scrollbar-compensation',
        `${scrollbarWidth}px`,
      );
      document.body.classList.add('menu-open');
      obscured.forEach((el) => el && (el.inert = true));
    } else {
      document.body.classList.remove('menu-open');
      document.body.style.removeProperty('--scrollbar-compensation');
      obscured.forEach((el) => el && (el.inert = false));
    }

    return () => {
      document.body.classList.remove('menu-open');
      document.body.style.removeProperty('--scrollbar-compensation');
      obscured.forEach((el) => el && (el.inert = false));
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const desktopMedia = window.matchMedia('(min-width: 821px)');
    const closeAtDesktop = (event) => {
      if (event.matches) {
        setMobileMenuOpen(false);
      }
    };

    desktopMedia.addEventListener('change', closeAtDesktop);

    return () => {
      desktopMedia.removeEventListener('change', closeAtDesktop);
    };
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  // In-page links scroll to their section without putting #id in the address
  // bar, and move focus there so keyboard and screen reader users land in the
  // same place. Without JavaScript they still work as plain anchors.
  useEffect(() => {
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const link = event.target.closest('a[href^="#"]');
      const target = link && document.getElementById(link.hash.slice(1));
      if (!target) return;

      event.preventDefault();
      if (!target.hasAttribute('tabindex')) target.tabIndex = -1;
      target.focus({ preventScroll: true });
      target.scrollIntoView({ block: 'start' });
    };

    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <div className="portfolio">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <header className="site-header" ref={headerRef}>
        <div className="shell header-inner">
          <a className="brand" href="#top" onClick={closeMenu}>
            <span className="brand-name">Kyle Piontek</span>
            <span className="brand-role">Senior Full Stack Engineer</span>
          </a>

          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#work">Projects</a>
            <a href="#experience">Experience</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>

          <a
            className="header-resume"
            href="/Kyle_Piontek_Resume.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Resume
            <span className="sr-only"> opens in a new tab</span>
          </a>

          <button
            ref={menuButtonRef}
            className={`menu-button ${mobileMenuOpen ? 'is-open' : ''}`}
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
          >
            <span />
            <span />
          </button>
        </div>

        <nav
          className={`mobile-nav ${mobileMenuOpen ? 'is-open' : ''}`}
          id="mobile-navigation"
          aria-hidden={!mobileMenuOpen}
          aria-label="Mobile navigation"
        >
          <div className="shell mobile-nav-inner">
            <a href="#work" onClick={closeMenu}>
              Projects
            </a>
            <a href="#experience" onClick={closeMenu}>
              Experience
            </a>
            <a href="#about" onClick={closeMenu}>
              About
            </a>
            <a href="#contact" onClick={closeMenu}>
              Contact
            </a>
            <a
              href="/Kyle_Piontek_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              onClick={closeMenu}
            >
              Resume
              <span className="sr-only"> opens in a new tab</span>
            </a>
          </div>
        </nav>
      </header>

      <main id="main-content">
        <section className="hero" id="top">
          <div
            className="hero-map"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: heroContours }}
          />
          <div className="shell">
            <div className="hero-layout">
              <h1>Hello</h1>
              <p className="hero-intro">
                I'm Kyle, a self-taught Senior Full Stack Engineer. I've spent
                15 years building for everyone from state government to
                startups, and building projects of my own in my spare time.
              </p>
              <p className="hero-location">
                Based in Montpelier, Vermont, and working remotely.
              </p>
              <div className="hero-actions">
                <a
                  className="button button-primary"
                  href="/Kyle_Piontek_Resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  Download resume
                  <span className="sr-only"> opens in a new tab</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="work section" id="work">
          <div className="shell">
            <h2 className="section-heading">Personal Projects</h2>

            <div className="project-grid">
              <article className="project-card">
                <ProductMedia
                  href="https://sitecmd.com"
                  name="SiteCMD"
                  label="Visit the SiteCMD website, opens in a new tab"
                  poster={sitecmdPoster}
                  webm={sitecmdWebm}
                  mp4={sitecmdMp4}
                />
                <div className="project-card-copy">
                  <h3>SiteCMD</h3>
                  <p>
                    A website scanner that audits live sites and source code
                    with 420+ deterministic checks and hands exact fixes to the
                    AI editor a developer already uses. It shipped as an
                    open-source Rust and React desktop app with a CLI and MCP
                    server.
                  </p>
                  <p>
                    Now moving to a Cloudflare Workers web app that tracks a
                    site&apos;s scans, uptime, analytics, and search in one
                    report.
                  </p>
                  <p className="project-stack">
                    Rust, React, TypeScript, Cloudflare Workers, Durable
                    Objects, Tauri
                  </p>
                  <a
                    className="text-link"
                    href="https://sitecmd.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visit SiteCMD
                    <span className="sr-only"> opens in a new tab</span>
                  </a>
                </div>
              </article>

              <article className="project-card">
                <ProductMedia
                  href="https://visityourteam.com"
                  name="Visit Your Team"
                  label="Visit the Visit Your Team website, opens in a new tab"
                  poster={visitYourTeamPoster}
                  webm={visitYourTeamWebm}
                  mp4={visitYourTeamMp4}
                />
                <div className="project-card-copy">
                  <h3>Visit Your Team</h3>
                  <p>
                    A game-day planning guide for every NFL, NBA, NHL, and MLB
                    venue, with real prices, insider tips, comparison tools,
                    rankings, and a trip cost calculator.
                  </p>
                  <p>
                    Built around validated data for 124 teams and about 1,165
                    statically generated pages, now drawing 5,000+ monthly
                    visitors, mostly from organic search.
                  </p>
                  <p className="project-stack">
                    Next.js, React, TypeScript, Supabase, Cloudflare
                  </p>
                  <a
                    className="text-link"
                    href="https://visityourteam.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visit Your Team
                    <span className="sr-only"> opens in a new tab</span>
                  </a>
                </div>
              </article>

              <article className="project-card">
                <ProductMedia
                  href="https://wasitvibed.com"
                  name="Was It Vibed"
                  label="Visit the Was It Vibed website, opens in a new tab"
                  poster={wasItVibedPoster}
                  webm={wasItVibedWebm}
                  mp4={wasItVibedMp4}
                />
                <div className="project-card-copy">
                  <h3>Was It Vibed</h3>
                  <p>
                    A public scanner that estimates whether a website was
                    vibe-coded using explainable pattern matching across CSS,
                    HTML, copy, design, and metadata.
                  </p>
                  <p>
                    Built as a hardened Cloudflare service with URL safety,
                    Turnstile, distributed rate limits, cached shareable
                    results, and no AI judgment in the scoring loop.
                  </p>
                  <p className="project-stack">
                    Cloudflare Workers, TypeScript, Durable Objects, D1, Vitest
                  </p>
                  <a
                    className="text-link"
                    href="https://wasitvibed.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visit Was It Vibed
                    <span className="sr-only"> opens in a new tab</span>
                  </a>
                </div>
              </article>

              <article className="project-card">
                <ProductMedia
                  href="https://smarthomeu.com"
                  name="SmartHomeU"
                  label="Visit the SmartHomeU website, opens in a new tab"
                  poster={smartHomeUPoster}
                  webm={smartHomeUWebm}
                  mp4={smartHomeUMp4}
                />
                <div className="project-card-copy">
                  <h3>SmartHomeU</h3>
                  <p>
                    A smart home education site with 22 free courses and 112
                    lessons, product reviews, comparison tools, and a product
                    database with live retail pricing.
                  </p>
                  <p>
                    Built on Drupal 11 with a Node.js price-scraping service
                    that keeps the product database current.
                  </p>
                  <p className="project-stack">
                    Drupal 11, PHP, MySQL, Node.js, Puppeteer
                  </p>
                  <a
                    className="text-link"
                    href="https://smarthomeu.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visit SmartHomeU
                    <span className="sr-only"> opens in a new tab</span>
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="experience section" id="experience">
          <div className="shell">
            <h2 className="section-heading">Experience</h2>

            <div className="experience-layout">
              <div className="experience-intro">
                <p>
                  Fifteen years, from agency work to state government to
                  enterprise platforms, plus my own products since 2026.
                </p>
                <a
                  className="text-link"
                  href="/Kyle_Piontek_Resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  Read the full resume
                  <span className="sr-only"> opens in a new tab</span>
                </a>
              </div>

              <ol className="experience-list">
                {experience.map((item) => (
                  <li className="experience-item" key={item.company}>
                    <p className="experience-dates">{item.dates}</p>
                    <h3 className="experience-role">{item.role}</h3>
                    <p className="experience-company">{item.company}</p>
                  </li>
                ))}
              </ol>
            </div>

            <figure className="endorsement">
              <blockquote>
                <p>
                  Kyle was not only extremely skilled in turning our designs
                  into functional, responsive code, but he also made the process
                  smooth and collaborative… His knowledge of WCAG helped ensure
                  our designs weren&apos;t just visually appealing but
                  user-friendly as well. Anyone looking for a thoughtful,
                  skilled, and team-oriented engineer would be lucky to have him
                  on board.
                </p>
              </blockquote>
              <figcaption>
                <span className="endorsement-name">Melina Sanchez</span>, Senior
                Designer at Optiv
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="about section" id="about">
          <div className="shell">
            <h2 className="section-heading">About Me</h2>

            <div className="about-layout">
              <div className="about-portrait">
                <img
                  src={headshotImg}
                  alt="Kyle Piontek"
                  width="640"
                  height="640"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="about-copy">
                <p className="about-lead">
                  When I got my first laptop, I took it apart and put it back
                  together just to see how it worked. I&apos;ve been teaching
                  myself how things work ever since.
                </p>
                <p>
                  I started programming at 12, left college to start working,
                  and have spent the last 15 years as a developer. I&apos;ve
                  worked for everyone from Fortune 500 companies to a small
                  startup, where I built the payment and escrow system that
                  turned the platform from a passion project into a real
                  business. I also spent four years building and maintaining
                  120+ websites for the State of Vermont, and today I work
                  mainly on the GraphQL API and React UI of an enterprise
                  platform.
                </p>
                <p>
                  I&apos;ve been building with AI for over a year, and it&apos;s
                  let me build my own products that I never would have had time
                  for before. Claude Code and Codex help me move faster, but
                  tests, git hooks, and my own review decide what ships. What I
                  care about most hasn&apos;t changed: usability, performance,
                  and accessibility, because even the best software is only as
                  valuable as the people who can actually use it.
                </p>
              </div>

              <div className="skills">
                <h3>Key skills</h3>
                <dl>
                  <div>
                    <dt>Languages</dt>
                    <dd>TypeScript, JavaScript, PHP, Rust, SQL</dd>
                  </div>
                  <div>
                    <dt>Frontend</dt>
                    <dd>React, Next.js, Astro, Sass, WCAG accessibility</dd>
                  </div>
                  <div>
                    <dt>Backend &amp; APIs</dt>
                    <dd>Node.js, GraphQL, REST, Stripe</dd>
                  </div>
                  <div>
                    <dt>Data &amp; CMS</dt>
                    <dd>MySQL, PostgreSQL, Supabase, Drupal</dd>
                  </div>
                  <div>
                    <dt>Infrastructure &amp; Tooling</dt>
                    <dd>
                      Cloudflare, Linux, Docker, GitHub Actions, Playwright
                    </dd>
                  </div>
                  <div>
                    <dt>AI Engineering</dt>
                    <dd>Claude Code, Codex, MCP servers, TDD</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="shell">
            <h2 className="section-heading">Contact</h2>
            <p className="contact-note">
              Whether you&apos;re hiring or need help with a project, let&apos;s
              have a chat.
            </p>
            <a className="contact-email" href="mailto:hello@kylepiontek.com">
              hello@kylepiontek.com
            </a>
            <div className="contact-social">
              <a
                className="contact-icon"
                href="https://www.linkedin.com/in/kyle-piontek"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn, opens in a new tab"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path
                    fill="currentColor"
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                  />
                </svg>
              </a>
              <a
                className="contact-icon"
                href="https://github.com/kpiontek"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub, opens in a new tab"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path
                    fill="currentColor"
                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                  />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <p>© {new Date().getFullYear()} Kyle Piontek</p>
          <div className="footer-links">
            <a
              href="https://github.com/kpiontek/portfolio"
              target="_blank"
              rel="noreferrer"
            >
              View source
              <span className="sr-only"> opens in a new tab</span>
            </a>
            <a href="#top">Back to top</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Portfolio;
