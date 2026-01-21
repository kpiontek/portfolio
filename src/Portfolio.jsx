import { useState, useEffect, useRef } from 'react';

// Optimized project images (800px wide, webp format)
import smarthomeuImg from './assets/projects/smarthomeu.png?w=800&format=webp';
import optivImg from './assets/projects/optiv.png?w=800&format=webp';
import cashortradeImg from './assets/projects/cashortrade.png?w=800&format=webp';

const Portfolio = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const sectionsRef = useRef({});

  useEffect(() => {
    // Active section observer
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

    // Scroll animation observer
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
    { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS'] },
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

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0b',
      color: '#e8e8e8',
      fontFamily: "'Source Sans 3', -apple-system, sans-serif",
      overflowX: 'hidden'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Source+Sans+3:wght@300;400;500;600&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* Screen reader only - visually hidden but accessible */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        
        ::selection {
          background: #3b82f6;
          color: white;
        }
        
        .fade-up {
          opacity: 0;
          transform: translateY(30px);
          animation: fadeUp 0.8s ease forwards;
        }
        
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
        .delay-5 { animation-delay: 0.5s; }
        
        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #3b82f6 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 6s ease infinite;
        }
        
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15);
        }
        
        .skill-tag {
          transition: all 0.2s ease;
        }
        
        .skill-tag:hover {
          background: #3b82f6;
          color: white;
          transform: scale(1.05);
        }
        
        .nav-link {
          position: relative;
          transition: color 0.2s ease;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 1px;
          background: #3b82f6;
          transition: width 0.3s ease;
        }
        
        .nav-link:hover::after {
          width: 100%;
        }

        .scroll-fade {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .scroll-fade.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .grid-bg {
          background-image:
            linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        @media (prefers-reduced-motion: reduce) {
          .fade-up,
          .scroll-fade,
          .hover-lift,
          .skill-tag,
          .nav-link,
          .nav-link::after,
          .gradient-text {
            animation: none !important;
            transition: none !important;
          }

          .scroll-fade {
            opacity: 1;
            transform: none;
          }

          .fade-up {
            opacity: 1;
            transform: none;
          }
        }

        /* Focus styles for keyboard navigation */
        a:focus-visible,
        button:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        @media (max-width: 768px) {
          nav {
            padding: 16px 24px !important;
          }

          .nav-links {
            display: none !important;
          }

          .hamburger-btn {
            display: flex !important;
          }

          .mobile-menu {
            display: flex !important;
          }

          .hero-section {
            padding: 100px 24px 60px !important;
          }

          .hero-buttons {
            flex-direction: column !important;
            align-items: flex-start !important;
          }

          .hero-buttons a {
            width: 100%;
            text-align: center;
          }

          section {
            padding-left: 24px !important;
            padding-right: 24px !important;
          }

          .project-card {
            grid-template-columns: 1fr !important;
          }

          .project-card > div:first-child {
            min-height: 200px;
          }

          footer {
            padding: 24px !important;
            flex-direction: column !important;
            gap: 12px !important;
            text-align: center;
          }
        }
      `}</style>

      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only"
        style={{
          position: 'absolute',
          top: '-40px',
          left: 0,
          background: '#3b82f6',
          color: 'white',
          padding: '8px 16px',
          zIndex: 1000
        }}
        onFocus={(e) => e.target.style.top = '0'}
        onBlur={(e) => e.target.style.top = '-40px'}
      >
        Skip to main content
      </a>

      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '24px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
        background: 'linear-gradient(to bottom, rgba(10,10,11,0.95) 0%, rgba(10,10,11,0) 100%)',
        backdropFilter: 'blur(8px)'
      }}>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
          style={{
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            padding: 0,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <img
            src="/kp-logo.png"
            alt="Kyle Piontek"
            style={{
              height: '32px',
              width: 'auto'
            }}
          />
        </button>

        {/* Desktop Nav */}
        <div className="nav-links" style={{
          display: 'flex',
          gap: '40px',
          fontFamily: "'Space Mono', monospace",
          fontSize: '13px',
          letterSpacing: '0.5px'
        }}>
          {['About', 'Work', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="nav-link"
              style={{
                color: activeSection === item.toLowerCase() ? '#3b82f6' : '#888',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
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
            style={{ color: '#999', textDecoration: 'none' }}
          >
            Resume<span className="sr-only"> (opens in new tab)</span>
          </a>
        </div>

        {/* Hamburger Button */}
        <button
          className="hamburger-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            flexDirection: 'column',
            gap: '5px'
          }}
        >
          <span style={{
            display: 'block',
            width: '24px',
            height: '2px',
            background: '#e8e8e8',
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
          }} />
          <span style={{
            display: 'block',
            width: '24px',
            height: '2px',
            background: '#e8e8e8',
            transition: 'opacity 0.3s ease',
            opacity: mobileMenuOpen ? 0 : 1
          }} />
          <span style={{
            display: 'block',
            width: '24px',
            height: '2px',
            background: '#e8e8e8',
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
          }} />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <nav
        id="mobile-menu"
        className="mobile-menu"
        role="navigation"
        aria-label="Mobile navigation"
        aria-hidden={!mobileMenuOpen}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(10, 10, 11, 0.98)',
          zIndex: 99,
          display: 'none',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '32px',
          opacity: mobileMenuOpen ? 1 : 0,
          pointerEvents: mobileMenuOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease'
        }}
      >
        {['About', 'Work', 'Contact'].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '24px',
              color: activeSection === item.toLowerCase() ? '#3b82f6' : '#e8e8e8',
              textDecoration: 'none',
              letterSpacing: '2px',
              transition: 'color 0.2s ease'
            }}
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
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '24px',
            color: '#e8e8e8',
            textDecoration: 'none',
            letterSpacing: '2px'
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          Resume<span className="sr-only"> (opens in new tab)</span>
        </a>
      </nav>

      <main id="main-content">
      {/* Hero Section */}
      <section className="grid-bg hero-section" style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '120px 48px 80px',
        position: 'relative'
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)'
        }} />
        
        <div style={{ maxWidth: '900px', position: 'relative' }}>
          <div className="fade-up" style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '13px',
            color: '#3b82f6',
            marginBottom: '24px',
            letterSpacing: '2px'
          }}>
            FULL-STACK DEVELOPER
          </div>
          
          <h1 className="fade-up delay-1" style={{
            fontSize: 'clamp(48px, 8vw, 80px)',
            fontWeight: 300,
            lineHeight: 1.1,
            marginBottom: '32px',
            letterSpacing: '-2px'
          }}>
            Building <span className="gradient-text" style={{ fontWeight: 500 }}>robust</span> web
            <br />experiences for over 14 years
          </h1>
          
          <p className="fade-up delay-2" style={{
            fontSize: '20px',
            color: '#999',
            maxWidth: '600px',
            lineHeight: 1.7,
            fontWeight: 300
          }}>
            Specializing in Drupal, headless architectures, and modern React frontends.
            Passionate about building technology that actually works for the people using it.
          </p>
          
          <div className="fade-up delay-3 hero-buttons" style={{
            marginTop: '48px',
            display: 'flex',
            gap: '16px',
            alignItems: 'center'
          }}>
            <a 
              href="#contact" 
              style={{
                padding: '16px 32px',
                background: '#3b82f6',
                color: 'white',
                textDecoration: 'none',
                fontFamily: "'Space Mono', monospace",
                fontSize: '13px',
                letterSpacing: '1px',
                transition: 'all 0.3s ease'
              }}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              GET IN TOUCH
            </a>
            <a
              href="#work"
              style={{
                padding: '16px 32px',
                border: '1px solid #333',
                color: '#999',
                textDecoration: 'none',
                fontFamily: "'Space Mono', monospace",
                fontSize: '13px',
                letterSpacing: '1px',
                transition: 'all 0.3s ease'
              }}
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
      <section id="about" style={{
        padding: '120px 48px',
        borderTop: '1px solid #1a1a1a'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '80px',
            alignItems: 'start'
          }}>
            <div className="scroll-fade">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                marginBottom: '32px'
              }}>
                <img
                  src="/headshot.jpg"
                  alt="Kyle Piontek"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #222'
                  }}
                />
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '12px',
                  color: '#3b82f6',
                  letterSpacing: '2px'
                }}>
                  01 — ABOUT
                </div>
              </div>
              <h2 style={{
                fontSize: '36px',
                fontWeight: 300,
                marginBottom: '32px',
                lineHeight: 1.3
              }}>
                Code that works,<br />
                <span style={{ color: '#888' }}>architecture that scales</span>
              </h2>
              <p style={{
                color: '#999',
                lineHeight: 1.8,
                marginBottom: '24px'
              }}>
                I've spent over 14 years building web applications that solve real problems. 
                From managing portfolios of 120+ websites to engineering platforms serving 500,000+ users, 
                I focus on creating maintainable, performant solutions at scale.
              </p>
              <p style={{
                color: '#999',
                lineHeight: 1.8,
                marginBottom: '24px'
              }}>
                Much of my work involves modernizing legacy systems, migrating aging PHP applications 
                to modern Drupal architectures while keeping the lights on. I've also grown into 
                leadership roles: mentoring junior developers, conducting code reviews, and stepping 
                up as backup for technical leads and directors when needed.
              </p>
              <p style={{
                color: '#999',
                lineHeight: 1.8
              }}>
                I care about bridging the gap between complex technology 
                and the people who use it. Good software isn't just well-architected, it's built 
                with empathy for end users who don't speak in APIs and frameworks.
              </p>
            </div>

            <div className="scroll-fade">
              <div style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '12px',
                color: '#888',
                marginBottom: '32px',
                letterSpacing: '2px'
              }}>
                TOOLKIT
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {skills.map((skillGroup, idx) => (
                  <div key={skillGroup.category}>
                    <div style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '11px',
                      color: '#3b82f6',
                      marginBottom: '12px',
                      letterSpacing: '1px'
                    }}>
                      {skillGroup.category}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {skillGroup.items.map((skill) => (
                        <span
                          key={skill}
                          className="skill-tag"
                          style={{
                            padding: '8px 16px',
                            background: '#141414',
                            border: '1px solid #222',
                            fontSize: '13px',
                            color: '#999',
                            cursor: 'default'
                          }}
                        >
                          {skill}
                        </span>
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
      <section id="work" style={{
        padding: '120px 48px',
        borderTop: '1px solid #1a1a1a',
        background: '#080808'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '12px',
            color: '#3b82f6',
            marginBottom: '24px',
            letterSpacing: '2px'
          }}>
            02 — SELECTED WORK
          </div>
          <h2 style={{
            fontSize: '36px',
            fontWeight: 300,
            marginBottom: '64px'
          }}>
            Projects & Contributions
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {projects.map((project, idx) => (
              <div
                key={project.title}
                className="hover-lift scroll-fade project-card"
                style={{
                  background: '#0d0d0d',
                  border: '1px solid #1a1a1a',
                  overflow: 'hidden',
                  display: 'grid',
                  gridTemplateColumns: '280px 1fr',
                  alignItems: 'stretch'
                }}
              >
                {/* Project Image */}
                <div style={{
                  background: '#141414',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={`${project.title} screenshot`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'top'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      minHeight: '200px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #141414 0%, #1a1a1a 100%)',
                      color: '#666'
                    }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                      <span style={{
                        marginTop: '12px',
                        fontFamily: "'Space Mono', monospace",
                        fontSize: '10px',
                        letterSpacing: '1px',
                        color: '#777'
                      }}>
                        CONFIDENTIAL
                      </span>
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div style={{ padding: '32px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px'
                  }}>
                    <span style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '11px',
                      color: '#888',
                      padding: '4px 8px',
                      border: '1px solid #333',
                      letterSpacing: '1px'
                    }}>
                      {project.status}
                    </span>
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: '12px',
                        color: '#999',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'color 0.2s ease'
                      }}>
                        VIEW PROJECT<span className="sr-only"> (opens in new tab)</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="M7 17L17 7M17 7H7M17 7V17" />
                        </svg>
                      </a>
                    )}
                  </div>
                  <h3 style={{
                    fontSize: '28px',
                    fontWeight: 400,
                    marginBottom: '16px'
                  }}>
                    {project.title}
                  </h3>
                  <p style={{
                    color: '#999',
                    lineHeight: 1.7,
                    marginBottom: '24px'
                  }}>
                    {project.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {project.tech.map((tech) => (
                      <span key={tech} style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: '11px',
                        color: '#3b82f6',
                        letterSpacing: '0.5px'
                      }}>
                        {tech}
                        {project.tech.indexOf(tech) < project.tech.length - 1 &&
                          <span style={{ color: '#666', margin: '0 8px' }}>·</span>
                        }
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{
            marginTop: '64px',
            padding: '32px',
            background: '#0a0a0a',
            border: '1px dashed #222',
            textAlign: 'center'
          }}>
            <p style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '18px',
              color: '#e8e8e8',
              marginBottom: '8px'
            }}>
              And many more...
            </p>
            <p style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '14px',
              color: '#999'
            }}>
              Additional work includes enterprise client projects under NDA.
              <br />
              Happy to discuss experience in more detail.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{
        padding: '120px 48px',
        borderTop: '1px solid #1a1a1a'
      }}>
        <div className="scroll-fade" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '12px',
            color: '#3b82f6',
            marginBottom: '24px',
            letterSpacing: '2px'
          }}>
            03 — CONTACT
          </div>
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 300,
            marginBottom: '24px',
            lineHeight: 1.3
          }}>
            Let's build something<br />
            <span className="gradient-text" style={{ fontWeight: 400 }}>together</span>
          </h2>
          <p style={{
            color: '#999',
            fontSize: '18px',
            marginBottom: '48px',
            lineHeight: 1.7
          }}>
            Open to new opportunities and conversations about making technology work better for real people.
          </p>
          
          <a
            href="mailto:hello@kylepiontek.com"
            style={{
              display: 'inline-block',
              padding: '20px 48px',
              background: 'transparent',
              border: '1px solid #3b82f6',
              color: '#3b82f6',
              textDecoration: 'none',
              fontFamily: "'Space Mono', monospace",
              fontSize: '14px',
              letterSpacing: '2px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#3b82f6';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#3b82f6';
            }}
            onFocus={(e) => {
              e.target.style.background = '#3b82f6';
              e.target.style.color = 'white';
            }}
            onBlur={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#3b82f6';
            }}
          >
            HELLO@KYLEPIONTEK.COM
          </a>
          
          <div style={{
            marginTop: '64px',
            display: 'flex',
            justifyContent: 'center',
            gap: '32px'
          }}>
            <a
              href="https://www.linkedin.com/in/kyle-piontek/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile (opens in new tab)"
              style={{
                color: '#999',
                transition: 'color 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#3b82f6'}
              onMouseOut={(e) => e.currentTarget.style.color = '#999'}
              onFocus={(e) => e.currentTarget.style.color = '#3b82f6'}
              onBlur={(e) => e.currentTarget.style.color = '#999'}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '32px 48px',
        borderTop: '1px solid #141414',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '11px',
          color: '#777',
          letterSpacing: '1px'
        }}>
          © 2026 Kyle Piontek
        </div>
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '11px',
          color: '#666',
          letterSpacing: '1px'
        }}>
          Built with React
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
