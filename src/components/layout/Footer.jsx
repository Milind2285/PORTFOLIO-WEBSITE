import React from 'react';
import { ArrowUp, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../icons/Icons';
import { profileData } from '../../data/profile';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="site-container footer-inner">
        <div className="footer-meta">
          <span className="footer-name">{profileData.name}</span>
          <p className="footer-desc text-xs text-muted">
            {profileData.headline}
          </p>
        </div>

        <div className="footer-actions">
          <div className="footer-links">
            <a
              href={`mailto:${profileData.contact.email}`}
              className="footer-link-icon"
              aria-label="Email"
              title="Email Milind Sharma"
            >
              <Mail size={15} />
            </a>
            <a
              href={profileData.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link-icon"
              aria-label="GitHub Profile"
              title="GitHub Profile"
            >
              <GithubIcon size={15} />
            </a>
            <a
              href={profileData.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link-icon"
              aria-label="LinkedIn Profile"
              title="LinkedIn Profile"
            >
              <LinkedinIcon size={15} />
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className="back-to-top-btn mono text-xs"
            aria-label="Scroll back to top"
          >
            <span>Back to top</span>
            <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
}
