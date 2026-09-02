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
        {/* Left Column: Headline, Bio & CTAs */}
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

          {/* Quick Tech Highlights */}
          <div className="hero-focus-matrix">
            <div className="focus-cell">
              <span className="focus-label">
                <Layers size={13} /> Full-Stack Engineering
              </span>
              <div className="focus-tags">
                {['Java', 'Spring Boot', 'React', 'REST APIs', 'MySQL'].map((tech) => (
                  <button
                    key={tech}
                    onClick={() => handleFilterClick(tech)}
                    className="hero-tech-btn"
                    title={`Filter projects by ${tech}`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>

            <div className="focus-cell">
              <span className="focus-label">
                <Cpu size={13} /> Machine Learning & Audio
              </span>
              <div className="focus-tags">
                {['Python', 'TensorFlow', 'CNN', 'Librosa', 'SciPy', 'Groq API'].map((tech) => (
                  <button
                    key={tech}
                    onClick={() => handleFilterClick(tech)}
                    className="hero-tech-btn"
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
              Explore Projects <ArrowDown size={15} />
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
              <Mail size={15} /> Contact
            </a>
          </div>
        </div>

        {/* Right Column: Interactive Signal & Flow Schematic */}
        <div className="hero-right-column">
          <HeroSignalFlow />
        </div>
      </div>
    </section>
  );
}
