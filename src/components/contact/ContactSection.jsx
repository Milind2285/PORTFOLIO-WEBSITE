import React from 'react';
import { Mail, Phone, MapPin, Copy, Check, ArrowUpRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../icons/Icons';
import { profileData } from '../../data/profile';
import { useClipboard } from '../../hooks/useClipboard';

export function ContactSection() {
  const emailClipboard = useClipboard();
  const phoneClipboard = useClipboard();

  return (
    <section id="contact" className="section">
      <div className="site-container">
        <div className="section-header">
          <span className="section-label">Get in Touch</span>
          <div className="section-title">
            <h2>Contact & Links</h2>
          </div>
          <p className="section-subtitle">
            Available for software engineering opportunities, collaborations, and discussions.
          </p>
        </div>

        <div className="contact-grid">
          {/* Direct Channels */}
          <div className="contact-channels card-surface">
            <h3 className="contact-card-title">Direct Contact</h3>

            <div className="contact-entry">
              <div className="contact-entry-info">
                <span className="contact-entry-label mono text-xs">Email</span>
                <a
                  href={`mailto:${profileData.contact.email}`}
                  className="contact-value"
                >
                  {profileData.contact.email}
                </a>
              </div>
              <button
                onClick={() => emailClipboard.copy(profileData.contact.email)}
                className="btn btn-secondary btn-sm"
                title="Copy email to clipboard"
                aria-label="Copy email address"
              >
                {emailClipboard.copied ? (
                  <>
                    <Check size={13} className="text-emerald" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="contact-entry">
              <div className="contact-entry-info">
                <span className="contact-entry-label mono text-xs">Phone</span>
                <a
                  href={`tel:${profileData.contact.phone.replace(/[^0-9+]/g, '')}`}
                  className="contact-value"
                >
                  {profileData.contact.phone}
                </a>
              </div>
              <button
                onClick={() => phoneClipboard.copy(profileData.contact.phone)}
                className="btn btn-secondary btn-sm"
                title="Copy phone number to clipboard"
                aria-label="Copy phone number"
              >
                {phoneClipboard.copied ? (
                  <>
                    <Check size={13} className="text-emerald" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="contact-entry">
              <div className="contact-entry-info">
                <span className="contact-entry-label mono text-xs">Location</span>
                <span className="contact-value-plain">
                  {profileData.location}
                </span>
              </div>
              <MapPin size={16} className="text-muted" />
            </div>
          </div>

          {/* Social Profiles & Repositories */}
          <div className="contact-profiles card-surface">
            <h3 className="contact-card-title">Profiles & Accounts</h3>

            <div className="profile-links-list">
              <a
                href={profileData.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="profile-link-card"
              >
                <div className="profile-link-content">
                  <GithubIcon size={18} />
                  <div>
                    <span className="profile-link-name">GitHub</span>
                    <span className="profile-link-desc text-xs text-muted">
                      Source code & repositories
                    </span>
                  </div>
                </div>
                <ArrowUpRight size={15} />
              </a>

              <a
                href={profileData.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="profile-link-card"
              >
                <div className="profile-link-content">
                  <LinkedinIcon size={18} />
                  <div>
                    <span className="profile-link-name">LinkedIn</span>
                    <span className="profile-link-desc text-xs text-muted">
                      Professional profile & network
                    </span>
                  </div>
                </div>
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
