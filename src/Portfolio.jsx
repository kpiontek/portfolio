import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './Portfolio.scss';

import headshotImg from './assets/headshot.webp';
import sitecmdImg from './assets/projects/sitecmd.webp';
import smartHomeUImg from './assets/projects/smarthomeu.webp';
import visitYourTeamImg from './assets/projects/visit-your-team.webp';
import wasItVibedImg from './assets/projects/was-it-vibed.webp';

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
    role: 'Founder & Product Engineer',
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
      'Helped deliver and maintain more than 120 Drupal websites for the State of Vermont, modernized legacy PHP systems, mentored developers, and served as backup Director of Development.',
  },
  {
    dates: 'Feb 2019 - Jun 2020',
    role: 'Full Stack Engineer',
    company: 'CashorTrade.org',
    detail:
      'Built for a ticket marketplace serving more than 500,000 members. Cut API response time by 30% and helped deliver payment and escrow work that more than doubled company revenue.',
  },
];

const capabilities = [
  {
    title: 'Ship new products',
    detail:
      'Four independent products in production, designed, built, and operated end to end: SiteCMD, SmartHomeU, Visit Your Team, and Was It Vibed.',
  },
  {
    title: 'Rescue difficult platforms',
    detail:
      'Troubled codebases taken over and stabilized, legacy websites and apps modernized without downtime, and monthly release schedules restored for teams under pressure.',
  },
  {
    title: 'Make it fast and accessible',
    detail:
      'Page loads cut by nearly half, API responses by 30%, and WCAG accessibility treated as part of done, not an audit finding to fix later.',
  },
  {
    title: 'Lead the technical work',
    detail:
      'Architecture, code review, mentoring, and release planning. Trusted as the standing backup for lead architects and a director of development.',
  },
];

function Portfolio() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        <section className="hero" id="top">
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
                Based in Vermont, working remotely, and open to senior and
                staff engineering roles.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#work">
                  View selected work
                </a>
                <a
                  className="text-link"
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
              <p>Four products I designed, built, and run myself.</p>
            </div>

            <div className="project-grid">
              <article className="project-card">
                <a
                  className="project-media"
                  href="https://sitecmd.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Visit the SiteCMD website"
                >
                  <img
                    src={sitecmdImg}
                    alt="SiteCMD homepage introducing the local-first website and code scanner"
                    width="1400"
                    height="780"
                    fetchpriority="high"
                  />
                </a>
                <div className="project-card-copy">
                  <h3>SiteCMD</h3>
                  <p>
                    A local-first desktop app, CLI, and MCP server that audit
                    websites and source code with 420+ checks, prioritize
                    issues by real risk, and hand exact fixes to the tools
                    developers already use.
                  </p>
                  <p>
                    Built as one connected system, from the Rust scan engines
                    to the Tauri desktop app and React interface, with a
                    privacy boundary that keeps code and findings on the
                    user&apos;s machine.
                  </p>
                  <p className="project-stack">
                    Rust, Tauri, React, TypeScript, SQLite, Node.js, Cloudflare
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
                <a
                  className="project-media"
                  href="https://visityourteam.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Visit the Visit Your Team website"
                >
                  <img
                    src={visitYourTeamImg}
                    alt="Visit Your Team homepage with venue planning tools"
                    width="1425"
                    height="890"
                    loading="lazy"
                  />
                </a>
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
                <a
                  className="project-media"
                  href="https://wasitvibed.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Visit the Was It Vibed website"
                >
                  <img
                    src={wasItVibedImg}
                    alt="Was It Vibed homepage with scanner form and illustrative evidence report"
                    width="1400"
                    height="780"
                    loading="lazy"
                  />
                </a>
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
                <a
                  className="project-media"
                  href="https://smarthomeu.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Visit the SmartHomeU website"
                >
                  <img
                    src={smartHomeUImg}
                    alt="SmartHomeU homepage with smart home courses, guides, and reviews"
                    width="1440"
                    height="900"
                    loading="lazy"
                  />
                </a>
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
              </p>
              <p>
                I also build products end to end. Claude Code and Codex write
                a lot of my code now; automated tests, repository hooks, and my
                own review decide what merges. Recent work spans React
                frontends for Tauri desktop applications with Rust at the core,
                data-heavy Next.js sites, public Cloudflare services, and the
                operational work required to ship them. I mentor, review, and
                step into technical leadership when a project needs it.
              </p>
            </div>
          </div>

          <div className="shell capabilities">
            {capabilities.map((capability) => (
              <div className="capability" key={capability.title}>
                <h3>{capability.title}</h3>
                <p>{capability.detail}</p>
              </div>
            ))}
            <p className="capabilities-stack">
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
              <a
                href="https://www.linkedin.com/in/kyle-piontek"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
                <span className="sr-only"> opens in a new tab</span>
              </a>
              <a
                href="https://github.com/brambleworks"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
                <span className="sr-only"> opens in a new tab</span>
              </a>
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
