import { useState, useEffect, useRef } from 'react';
import './Portfolio.scss';

// Optimized project images (800px wide, webp format)
import smarthomeuImg from './assets/projects/smarthomeu.png?w=800&format=webp';
import optivImg from './assets/projects/optiv.png?w=800&format=webp';
import cashortradeImg from './assets/projects/cashortrade.png?w=800&format=webp';

const Portfolio = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id || 'hero');
        }
      });
    }, {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    });

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => sectionObserver.observe(section));

    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    });

    const animatedElements = document.querySelectorAll('.scroll-fade');
    animatedElements.forEach((el) => animationObserver.observe(el));

    return () => {
      sectionObserver.disconnect();
      animationObserver.disconnect();
    };
  }, []);

  const skills = [
    { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Sass/SCSS', 'Tailwind CSS'] },
    { category: 'Backend', items: ['PHP', 'Node.js', 'MySQL', 'Redis', 'GraphQL', 'REST APIs'] },
    { category: 'CMS & Platform', items: ['Drupal', 'Headless CMS', 'Acquia', 'WordPress'] },
    { category: 'Infrastructure', items: ['Git', 'Docker', 'CI/CD', 'Varnish', 'Solr', 'WCAG/Accessibility'] },
  ];

  const projects = [
    {
      title: 'Smart Home U',
      description: 'Educational platform helping everyday users navigate smart home technology with clear, jargon-free guidance.',
      tech: ['Drupal', 'PHP', 'SEO', 'Content Strategy'],
      link: 'https://smarthomeu.com',
      status: 'Personal Project',
      image: smarthomeuImg
    },
    {
      title: 'Enterprise Headless CMS',
      description: 'Architected and delivered headless Drupal implementations with Next.js frontends for healthcare organizations.',
      tech: ['Drupal', 'Next.js', 'React', 'GraphQL', 'Acquia'],
      link: null,
      status: 'Client Work',
      image: null
    },
    {
      title: 'Optiv.com',
      description: 'Corporate marketing site for a leading cybersecurity solutions provider. Improved backend performance and caching, reducing load times by nearly 50%.',
      tech: ['Drupal 10', 'PHP', 'Acquia'],
      link: 'https://www.optiv.com',
      status: 'Client Work',
      image: optivImg
    },
    {
      title: 'CashorTrade.org',
      description: 'High-traffic ticket exchange platform serving 500,000+ users. Optimized database queries and API performance, reducing response times by 30%.',
      tech: ['PHP', 'MySQL', 'JavaScript', 'REST APIs'],
      link: 'https://www.cashortrade.org',
      status: 'Client Work',
      image: cashortradeImg
    }
  ];

  const navItems = ['About', 'Work', 'Contact'];

  return (
    <div className="page-wrapper">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Navigation */}
      <nav className="nav-header">
        <button
          className="logo-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
        >
          <img src="/kp-logo.png" alt="Kyle Piontek" className="logo-img" />
        </button>

        <div className="nav-links">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className={`nav-link ${activeSection === item.toLowerCase() ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {item}
            </a>
          ))}
          <a
            href="/Kyle_Piontek_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            Resume<span className="sr-only"> (opens in new tab)</span>
          </a>
        </div>

        <button
          className="hamburger-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <span
            className="hamburger-line"
            style={{ transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}
          />
          <span
            className="hamburger-line"
            style={{ opacity: mobileMenuOpen ? 0 : 1 }}
          />
          <span
            className="hamburger-line"
            style={{ transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      <nav
        id="mobile-menu"
        className={`mobile-menu ${mobileMenuOpen ? 'open' : 'closed'}`}
        role="navigation"
        aria-label="Mobile navigation"
        aria-hidden={!mobileMenuOpen}
      >
        {navItems.map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className={`mobile-menu-link ${activeSection === item.toLowerCase() ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setMobileMenuOpen(false);
              document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {item}
          </a>
        ))}
        <a
          href="/Kyle_Piontek_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-menu-link"
          onClick={() => setMobileMenuOpen(false)}
        >
          Resume<span className="sr-only"> (opens in new tab)</span>
        </a>
      </nav>

      <main id="main-content">
        {/* Hero Section */}
        <section className="hero-section grid-bg">
          <div className="hero-decoration" aria-hidden="true" />
          <div className="container-hero">
            <div className="hero-label fade-up">SENIOR FULL-STACK WEB DEVELOPER</div>
            <h1 className="hero-title fade-up delay-1">
              Building <span className="gradient-text">robust</span> web
              <br />experiences for over 14 years
            </h1>
            <p className="hero-description fade-up delay-2">
              From legacy PHP to modern React, I've continuously adapted to new technologies
              throughout my career. Passionate about building solutions that work for real people.
            </p>
            <div className="hero-buttons fade-up delay-3">
              <a
                href="#contact"
                className="btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                GET IN TOUCH
              </a>
              <a
                href="#work"
                className="btn-secondary"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                VIEW WORK
              </a>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="section">
          <div className="container">
            <div className="about-grid">
              <div className="scroll-fade">
                <div className="about-header">
                  <img src="/headshot.jpg" alt="Kyle Piontek" className="headshot" />
                  <div className="section-label">// ABOUT ME</div>
                </div>
                <h2 className="section-title">
                  Code that works,<br />
                  <span className="text-muted-dark">architecture that scales</span>
                </h2>
                <p className="about-text">
                  I've spent over 14 years building web applications that solve real problems.
                  From managing portfolios of 120+ websites to engineering platforms serving 500,000+ users,
                  I focus on creating maintainable, performant solutions at scale.
                </p>
                <p className="about-text">
                  The web changes fast, and I've made it a point to evolve with it. I've picked up
                  new languages, frameworks, and paradigms whenever the job demanded it - whether that
                  meant diving into headless architectures, learning GraphQL, or adopting TypeScript.
                  Much of my work involves modernizing legacy systems and migrating aging applications
                  to modern stacks while keeping the lights on.
                </p>
                <p className="about-text">
                  I've also grown into leadership roles: mentoring junior developers, conducting code
                  reviews, and stepping up as backup for technical leads and directors when needed.
                  I care about bridging the gap between complex technology and the people who use it.
                </p>
              </div>

              <div className="scroll-fade">
                <div className="toolkit-label">TOOLKIT</div>
                <div className="skills-container">
                  {skills.map((skillGroup) => (
                    <div key={skillGroup.category}>
                      <div className="skill-category">{skillGroup.category}</div>
                      <div className="skill-list">
                        {skillGroup.items.map((skill) => (
                          <span key={skill} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Work Section */}
        <section id="work" className="section section-work">
          <div className="container">
            <div className="section-label">// SELECTED WORK</div>
            <h2 className="section-title" style={{ marginBottom: '64px' }}>
              Projects & Contributions
            </h2>

            <div className="projects-container">
              {projects.map((project) => (
                <div key={project.title} className="project-card hover-lift scroll-fade">
                  <div className="project-image-container">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={`${project.title} screenshot`}
                        className="project-image"
                      />
                    ) : (
                      <div className="project-placeholder">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                        <span className="project-placeholder-text">CONFIDENTIAL</span>
                      </div>
                    )}
                  </div>

                  <div className="project-info">
                    <div className="project-header">
                      <span className="project-status">{project.status}</span>
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                          VIEW PROJECT<span className="sr-only"> (opens in new tab)</span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path d="M7 17L17 7M17 7H7M17 7V17" />
                          </svg>
                        </a>
                      )}
                    </div>
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                    <div className="project-tech">
                      {project.tech.map((tech, idx) => (
                        <span key={tech} className="tech-item">
                          {tech}
                          {idx < project.tech.length - 1 && <span className="tech-separator">·</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="more-projects">
              <p className="more-projects-title">And many more...</p>
              <p className="more-projects-text">
                Additional work includes client projects under NDA.
                <br />
                Happy to discuss experience in more detail.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="section">
          <div className="container-narrow scroll-fade contact-content">
            <div className="section-label">// CONTACT KYLE</div>
            <h2 className="section-title-large">
              Let's build something<br />
              <span className="gradient-text">together</span>
            </h2>
            <p className="contact-description">
              Open to new opportunities and conversations about making technology work better for real people.
            </p>

            <a href="mailto:hello@kylepiontek.com" className="email-btn">
              HELLO@KYLEPIONTEK.COM
            </a>

            <div className="social-links">
              <a
                href="https://www.linkedin.com/in/kyle-piontek/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="LinkedIn profile (opens in new tab)"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-text footer-copyright">© {new Date().getFullYear()} Kyle Piontek</div>
        <div className="footer-text footer-credit">No divs were harmed in the making of this website</div>
      </footer>
    </div>
  );
};

export default Portfolio;
