import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './Portfolio.scss';

import headshotImg from './assets/headshot.webp';
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

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const FINE_POINTER = '(hover: hover) and (pointer: fine)';

const experience = [
  {
    dates: 'May 2025 - Present',
    role: 'Senior Web Developer',
    company: 'Digital Artisans',
    detail:
      'Own full-stack features across the data model, GraphQL API, and React UI of an enterprise Drupal platform. Took over a delayed project after two vendor handoffs, stabilized the codebase, and restored a monthly release schedule.',
  },
  {
    dates: '2026 - Present',
    role: 'Founder & Engineer',
    company: 'Brambleworks',
    detail:
      'Building and operating independent technology products including SiteCMD, SmartHomeU, Visit Your Team, and Was It Vibed, from product direction and interface design through full-stack architecture, release, and ongoing operations.',
  },
  {
    dates: 'Apr 2024 - Apr 2025',
    role: 'Full Stack Web Developer',
    company: 'Optiv Security',
    detail:
      'Served as backup Lead Technical Architect on a Drupal 10 platform. Cut page load times by nearly 50% by optimizing backend code, reducing frontend scripts, and improving caching.',
  },
  {
    dates: 'Jun 2020 - Apr 2024',
    role: 'Software Engineer',
    company: 'Tyler Technologies',
    detail:
      'Built and maintained more than 120 Drupal websites for the State of Vermont, migrated legacy PHP applications to Drupal with zero downtime, mentored developers, and covered for the Director of Development.',
  },
  {
    dates: 'Feb 2019 - Jun 2020',
    role: 'Full Stack Engineer',
    company: 'CashorTrade.org',
    detail:
      'Designed and built the payments and escrow system for a ticket marketplace serving more than 500,000 users, which more than doubled company revenue. Cut API response times by 30%.',
  },
];

function ProductMedia({ href, label, poster, webm, mp4, priority = false }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || window.matchMedia(REDUCED_MOTION).matches) return undefined;

    video.muted = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  return (
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
        preload={priority ? 'auto' : 'metadata'}
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src={webm} type="video/webm" />
        <source src={mp4} type="video/mp4" />
      </video>
    </a>
  );
}

function Portfolio() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef(null);
  const menuButtonRef = useRef(null);

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

  useEffect(() => {
    const hero = heroRef.current;
    if (
      !hero ||
      !window.matchMedia(FINE_POINTER).matches ||
      window.matchMedia(REDUCED_MOTION).matches
    ) {
      return undefined;
    }

    let frame = 0;
    const onMove = (event) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const rect = hero.getBoundingClientRect();
        hero.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        hero.style.setProperty('--my', `${event.clientY - rect.top}px`);
        hero.classList.add('is-lit');
      });
    };
    const onLeave = () => hero.classList.remove('is-lit');

    hero.addEventListener('pointermove', onMove);
    hero.addEventListener('pointerleave', onLeave);

    return () => {
      hero.removeEventListener('pointermove', onMove);
      hero.removeEventListener('pointerleave', onLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="portfolio">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <header className="site-header">
        <div className="shell header-inner">
          <a className="brand" href="#top" onClick={closeMenu}>
            <span className="brand-name">Kyle Piontek</span>
            <span className="brand-role">Senior Full Stack Developer</span>
          </a>

          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#work">Work</a>
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
              Work
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
        <section className="hero" id="top" ref={heroRef}>
          <div className="shell hero-layout">
            <h1>
              Hey,
              <br />
              I&apos;m Kyle.
            </h1>
            <div className="hero-copy">
              <p>
                I&apos;m a Senior Full Stack Developer with 15 years of
                building and fixing software: 120+ state government websites,
                a marketplace with 500,000 users, and four products of my own
                that I run today.
              </p>
              <p>
                Based in Vermont and working remotely.
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
            <div className="section-heading">
              <h2>Selected work</h2>
            </div>

            <div className="project-grid">
              <article className="project-card">
                <ProductMedia
                  href="https://sitecmd.com"
                  label="Visit the SiteCMD website"
                  poster={sitecmdPoster}
                  webm={sitecmdWebm}
                  mp4={sitecmdMp4}
                  priority
                />
                <div className="project-card-copy">
                  <h3>SiteCMD</h3>
                  <p>
                    A local-first desktop app, CLI, and MCP server that audit
                    websites and source code with 420+ checks, prioritize
                    issues by real risk, and hand exact fixes to the tools
                    developers already use.
                  </p>
                  <p>
                    Rust scan engines, a Tauri desktop app with a React
                    interface, and a hosted service on Cloudflare Workers for
                    scheduled scans, deploy checks, and CI gates. Code and
                    findings stay on the user&apos;s machine unless they connect
                    a site.
                  </p>
                  <p className="project-stack">
                    Rust, Tauri, React, TypeScript, SQLite, Cloudflare Workers,
                    Durable Objects
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
                  label="Visit the Visit Your Team website"
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
                    Built around validated data for 124 teams and roughly 1,165
                    static routes, now drawing 5,000+ monthly visitors, mostly
                    from organic search.
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
                    Visit Visit Your Team
                    <span className="sr-only"> opens in a new tab</span>
                  </a>
                </div>
              </article>

              <article className="project-card">
                <ProductMedia
                  href="https://wasitvibed.com"
                  label="Visit the Was It Vibed website"
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
                  label="Visit the SmartHomeU website"
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
                    Built on Drupal 11 with a custom theme and a Node.js
                    price-scraping service that keeps the product database
                    current.
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
            <div className="section-heading">
              <h2>Experience</h2>
              <p>
                Fifteen years, from agency work to state government to
                enterprise platforms, plus my own products since 2026.
              </p>
            </div>

            <ol className="experience-list">
              {experience.map((item) => (
                <li className="experience-item" key={item.company}>
                  <p className="experience-dates">{item.dates}</p>
                  <div className="experience-role">
                    <h3>{item.role}</h3>
                    <p>{item.company}</p>
                  </div>
                  <p className="experience-detail">{item.detail}</p>
                </li>
              ))}
            </ol>

            <a
              className="text-link experience-resume"
              href="/Kyle_Piontek_Resume.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Read the full resume
              <span className="sr-only"> opens in a new tab</span>
            </a>

            <figure className="endorsement">
              <blockquote>
                <p>
                  Kyle was not only extremely skilled in turning our designs
                  into functional, responsive code, but he also made the
                  process smooth and collaborative… His knowledge of WCAG
                  helped ensure our designs weren&apos;t just visually
                  appealing but user-friendly as well. Anyone looking for a
                  thoughtful, skilled, and team-oriented engineer would be
                  lucky to have him on board.
                </p>
              </blockquote>
              <figcaption>
                <span className="endorsement-name">Melina Sanchez</span>,
                Senior Designer at Optiv
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="about section" id="about">
          <div className="shell about-layout">
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
              <h2>About</h2>
              <p className="about-lead">
                I build products end to end, keep difficult platforms online,
                and work AI-native with a hard line on what ships.
              </p>
            </div>

            <div className="about-columns">
              <p>
                Much of my career has been spent modernizing systems that
                cannot simply go offline: government site portfolios,
                revenue-producing platforms, and enterprise CMS programs. I
                know how to improve them without losing what already works.
                Along the way I mentor, review code, and step into technical
                leadership when a project needs it.
              </p>
              <p>
                My own products cover the other side of the work: React
                frontends for Tauri desktop apps with Rust at the core,
                data-heavy Next.js sites, and public Cloudflare services.
                Claude Code and Codex write a lot of my code now; automated
                tests, repository hooks, and my own review decide what merges.
              </p>
            </div>
            <p className="about-stack">
              Day to day: TypeScript, JavaScript, React, Next.js, Node.js, PHP,
              Drupal, GraphQL, MySQL, Rust, Tauri, Cloudflare, Claude Code,
              Codex, and MCP.
            </p>
          </div>

        </section>

        <section className="contact" id="contact">
          <div className="shell contact-layout">
            <div className="contact-copy">
              <h2>Let&apos;s talk.</h2>
              <p>
                If you&apos;re hiring for a senior engineering role or need
                experienced help with a difficult platform, I&apos;d be glad to
                hear what you&apos;re working on.
              </p>
            </div>
            <div className="contact-links">
              <a href="mailto:hello@kylepiontek.com">hello@kylepiontek.com</a>
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
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <p>© {new Date().getFullYear()} Kyle Piontek</p>
          <p>Senior Full Stack Developer based in Vermont</p>
          <a href="#top">Back to top</a>
        </div>
      </footer>
    </div>
  );
}

export default Portfolio;
