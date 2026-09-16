import React from 'react';
import { ArrowDown, Mail, Layers, Cpu } from 'lucide-react';
import { profileData } from '../../data/profile';
import { usePortfolio } from '../../context/PortfolioContext';
import { HeroSignalFlow } from './HeroSignalFlow';

export function HeroSection() {
  const { toggleSkillFilter } = usePortfolio();

  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFilterClick = (tech) => {
    toggleSkillFilter(tech);
    handleScroll('projects');
  };

  return (
    <section id="hero" className="hero-section">
      <div className="site-container hero-inner">
        {/* Left Column: Headline, Bio & Highlights */}
        <div className="hero-left-column">
          <div className="hero-badge-row">
            <span className="hero-status-tag">
              <span className="pulse-dot"></span>
              Available for Software Engineering Internships & Roles
            </span>
          </div>

          <div className="hero-content">
            <h1 className="hero-name">{profileData.name}</h1>
            <p className="hero-headline">{profileData.headline}</p>
            <p className="hero-bio">{profileData.about}</p>
          </div>

          {/* Quick Focus Areas - Clean, Hairline Presentation */}
          <div className="hero-focus-areas">
            <div className="focus-row">
              <span className="focus-title mono text-xs">
                <Layers size={12} className="text-accent" /> Full-Stack Engineering:
              </span>
              <div className="focus-tags-inline">
                {['Java', 'Spring Boot', 'React', 'REST APIs', 'MySQL'].map((tech) => (
                  <button
                    key={tech}
                    onClick={() => handleFilterClick(tech)}
                    className="hero-tech-chip"
                    title={`Filter projects by ${tech}`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>

            <div className="focus-row">
              <span className="focus-title mono text-xs">
                <Cpu size={12} className="text-cyan" /> ML & Signal Analysis:
              </span>
              <div className="focus-tags-inline">
                {['Python', 'TensorFlow', 'CNN', 'Librosa', 'SciPy', 'Groq API'].map((tech) => (
                  <button
                    key={tech}
                    onClick={() => handleFilterClick(tech)}
                    className="hero-tech-chip"
                    title={`Filter projects by ${tech}`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="hero-actions">
            <button
              onClick={() => handleScroll('projects')}
              className="btn btn-primary"
            >
              Explore Projects <ArrowDown size={14} />
            </button>

            <button
              onClick={() => handleScroll('skills')}
              className="btn btn-secondary"
            >
              Explore Skills
            </button>

            <a
              href={`mailto:${profileData.contact.email}`}
              className="btn btn-ghost"
            >
              <Mail size={14} /> Contact
            </a>
          </div>
        </div>

        {/* Right Column: Refined Interactive Signal Flow */}
        <div className="hero-right-column">
          <HeroSignalFlow />
        </div>
      </div>
    </section>
  );
}
