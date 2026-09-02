import React from 'react';
import { GraduationCap, Award, BookOpen, CheckCircle2 } from 'lucide-react';
import { profileData } from '../../data/profile';

export function EducationSection() {
  return (
    <section id="education" className="section">
      <div className="site-container">
        <div className="section-header">
          <span className="section-label">Academic Background & Credentials</span>
          <div className="section-title">
            <h2>Education & Certifications</h2>
          </div>
          <p className="section-subtitle">
            Formal computer science coursework and professional technical certifications.
          </p>
        </div>

        <div className="education-grid">
          {/* Education Ledger */}
          <div className="education-column">
            <h3 className="column-heading">
              <GraduationCap size={16} className="text-accent" />
              <span>Education</span>
            </h3>

            <div className="education-cards">
              {profileData.education.map((edu, idx) => (
                <div key={idx} className="education-card card-surface">
                  <div className="edu-card-header">
                    <span className="edu-period mono text-xs">{edu.period}</span>
                    <h4 className="edu-degree">{edu.degree}</h4>
                    <span className="edu-institution">{edu.institution}</span>
                  </div>
                  <p className="edu-details">{edu.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications Ledger */}
          <div className="education-column">
            <h3 className="column-heading">
              <Award size={16} className="text-accent" />
              <span>Certifications</span>
            </h3>

            <div className="certifications-list">
              {profileData.certifications.map((cert, idx) => (
                <div key={idx} className="cert-card card-surface">
                  <div className="cert-info">
                    <span className="cert-category mono text-xs">{cert.category}</span>
                    <h4 className="cert-title">{cert.title}</h4>
                    <span className="cert-issuer text-muted text-xs">{cert.issuer}</span>
                  </div>
                  <CheckCircle2 size={16} className="cert-check-icon" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
