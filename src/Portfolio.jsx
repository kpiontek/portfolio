import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './Portfolio.scss';

import sitecmdImg from './assets/projects/sitecmd.webp';
import visitYourTeamImg from './assets/projects/visit-your-team.webp';
import wasItVibedImg from './assets/projects/was-it-vibed.webp';

const experience = [
  {
    dates: 'May 2025 - Present',
    role: 'Senior Web Developer',
    company: 'Digital Artisans',
    detail:
      'Leading development on an enterprise headless CMS with Drupal, React, and GraphQL. Took over a troubled implementation, stabilized the platform, and resumed feature delivery without disrupting production.',
  },
  {
    dates: 'Current',
    role: 'Founder & Product Engineer',
    company: 'Brambleworks',
    detail:
      'Building and operating independent technology products including SiteCMD, Visit Your Team, and Was It Vibed, from product direction and interface design through full-stack architecture, release, and ongoing operations.',
  },
  {
    dates: 'Apr 2024 - Apr 2025',
    role: 'Full Stack Web Developer',
    company: 'Optiv Security',
    detail:
      'Served as backup Lead Technical Architect on a Drupal 10 platform. Improved backend and caching performance by nearly 50% while building responsive, reusable components.',
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
    title: 'Product engineering',
    detail:
      'React, Next.js, TypeScript, JavaScript, accessible HTML and CSS, interface systems, and data-heavy applications.',
  },
  {
    title: 'Platforms and APIs',
    detail:
      'PHP, Node.js, GraphQL, REST, MySQL, Redis, Drupal, WordPress, and practical integration architecture.',
  },
  {
    title: 'Desktop and edge',
    detail:
      'React and TypeScript frontends, Rust application logic, Tauri desktop apps, SQLite, Cloudflare Workers, Durable Objects, and explicit privacy boundaries.',
  },
  {
    title: 'Technical leadership',
    detail:
      'Architecture, stabilization, modernization, code review, mentoring, delivery planning, and communication across disciplines.',
  },
];

function ArrowUpRight({ decorative = true }) {
  return (
    <svg
      aria-hidden={decorative}
      className="arrow-icon"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path d="M4 12 12 4M5 4h7v7" />
    </svg>
  );
}

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
    if (mobileMenuOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.setProperty(
        '--scrollbar-compensation',
        `${scrollbarWidth}px`,
      );
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
      document.body.style.removeProperty('--scrollbar-compensation');
    }

    return () => {
      document.body.classList.remove('menu-open');
      document.body.style.removeProperty('--scrollbar-compensation');
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
          </nav>

          <a
            className="header-resume"
            href="/Kyle_Piontek_Resume.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Resume
            <ArrowUpRight />
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
              Resume <ArrowUpRight />
              <span className="sr-only"> opens in a new tab</span>
            </a>
          </div>
        </nav>
      </header>

      <main id="main-content">
        <section className="hero" id="top">
          <div className="shell hero-layout">
            <h1>I build software that holds up.</h1>
            <div className="hero-copy">
              <p>
                I&apos;m Kyle, a Senior Full Stack Developer with more than 14
                years of experience shipping, stabilizing, and modernizing
                software for enterprise platforms, public services, and
                independent products.
              </p>
              <p>
                I work from architecture through interface, with practical
                judgment and care for the people using what I build.
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
                  <ArrowUpRight />
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
              <p>
                Recent independent products alongside the platform work that
                has defined my career.
              </p>
            </div>

            <article className="project-feature">
              <a
                className="project-media project-media-feature"
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

              <div className="project-feature-copy">
                <div>
                  <h3>SiteCMD</h3>
                  <p className="project-role">
                    Independent product, full-stack engineering
                  </p>
                </div>
                <p className="project-summary">
                  A local-first desktop app, CLI, and MCP server that audit
                  websites and source code, prioritize issues by real risk, and
                  hand exact fixes to the tools developers already use.
                </p>
                <ul className="project-contributions">
                  <li>
                    Built the Rust scan engines, Tauri desktop application,
                    React interface, CLI, and MCP server as one connected
                    system.
                  </li>
                  <li>
                    Designed the privacy boundary so source code, credentials,
                    and findings remain on the user&apos;s machine unless they
                    deliberately connect a service.
                  </li>
                  <li>
                    Created release and verification guardrails for a
                    cross-platform product spanning desktop, web, and
                    developer tooling.
                  </li>
                </ul>
                <p className="project-stack">
                  Rust, Tauri, React, TypeScript, SQLite, Node.js, Cloudflare
                </p>
                <div className="project-links">
                  <a
                    className="text-link"
                    href="https://sitecmd.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visit SiteCMD <ArrowUpRight />
                    <span className="sr-only"> opens in a new tab</span>
                  </a>
                </div>
              </div>
            </article>

            <div className="supporting-projects">
              <article className="supporting-project">
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
                <div className="supporting-project-copy">
                  <h3>Visit Your Team</h3>
                  <p className="project-role">
                    Independent product, product design and engineering
                  </p>
                  <p>
                    A game-day planning guide for every NFL, NBA, NHL, and MLB
                    venue, with real prices, insider tips, comparison tools,
                    rankings, and a trip cost calculator.
                  </p>
                  <p>
                    Built around validated data for 124 teams and roughly 1,165
                    static routes, with shared venue integrity rules and
                    editorial tooling.
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
                    Visit the site <ArrowUpRight />
                    <span className="sr-only"> opens in a new tab</span>
                  </a>
                </div>
              </article>

              <article className="supporting-project">
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
                <div className="supporting-project-copy">
                  <h3>Was It Vibed</h3>
                  <p className="project-role">
                    Independent experiment, product and engineering
                  </p>
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
                    Run a scan <ArrowUpRight />
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
                Senior contribution across independent products, enterprise
                delivery, public infrastructure, and high-traffic platforms.
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
              Read the full resume <ArrowUpRight />
              <span className="sr-only"> opens in a new tab</span>
            </a>
          </div>
        </section>

        <section className="about section" id="about">
          <div className="shell about-layout">
            <div className="about-portrait">
              <img
                src="/headshot.jpg"
                alt="Kyle Piontek"
                width="246"
                height="258"
              />
            </div>

            <div className="about-copy">
              <h2>About</h2>
              <p className="about-lead">
                I build dependable products, modernize complex platforms, and
                help teams make sound technical decisions.
              </p>
              <p>
                Much of my career has been spent modernizing systems that
                cannot simply go offline: government site portfolios,
                revenue-producing platforms, and enterprise CMS programs. I
                know how to improve them without losing what already works.
              </p>
              <p>
                I also build products end to end. Recent work spans React
                frontends for Tauri desktop applications with Rust at the core,
                data-heavy Next.js sites, public Cloudflare services, and the
                operational work required to ship them. I mentor, review,
                communicate tradeoffs, and step into technical leadership when
                a project needs it.
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
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="shell contact-layout">
            <h2>Let&apos;s talk.</h2>
            <div className="contact-copy">
              <p>
                If you&apos;re hiring for a senior engineering role or need
                experienced help with a difficult platform, I&apos;d be glad to
                hear what you&apos;re working on.
              </p>
              <div className="contact-links">
                <a href="mailto:hello@kylepiontek.com">
                  hello@kylepiontek.com <ArrowUpRight />
                </a>
                <a
                  href="https://www.linkedin.com/in/kyle-piontek"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn <ArrowUpRight />
                  <span className="sr-only"> opens in a new tab</span>
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
