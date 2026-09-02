import React, { useState } from 'react';
import { ArrowUpRight, ExternalLink, Cpu, GitBranch, Layers, Activity, Compass, ArrowRight } from 'lucide-react';
import { GithubIcon } from '../icons/Icons';
import { usePortfolio } from '../../context/PortfolioContext';
import { AudioPlayground } from './AudioPlayground';

export function ProjectCard({ project }) {
  const { activeSkillFilter, toggleSkillFilter, setSelectedProject, isBlueprintMode } = usePortfolio();
  const [showAudioPlayground, setShowAudioPlayground] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isMatched = activeSkillFilter
    ? project.technologies.some(
        (t) => t.toLowerCase() === activeSkillFilter.toLowerCase()
      )
    : false;

  const isAudioProject = project.id === 'audio-comparison-tool';
  const steps = project.architecture?.steps || [];

  return (
    <article
      className={`project-card card-surface ${isMatched ? 'filter-matched' : ''} ${isBlueprintMode ? 'blueprint-card' : ''} ${isHovered ? 'card-hovered-active' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      <div className="project-card-header">
        <div className="project-meta">
          <span className="project-category mono text-xs">{project.category}</span>
          <h3 className="project-title">{project.title}</h3>
        </div>

        <button
          onClick={() => setSelectedProject(project)}
          className="inspect-action-btn"
          aria-label={`Inspect architecture and details for ${project.title}`}
          title="Inspect Architecture & Execution Flow"
        >
          <span className="text-xs mono">Inspect</span>
          <ArrowUpRight size={15} />
        </button>
      </div>

      {/* Living Architecture Signal Ticker Preview */}
      {steps.length > 0 && (
        <div className="living-pipeline-ticker" aria-label="Architecture Signal Stream Preview">
          <div className="ticker-label-bar">
            <span className="ticker-label mono text-xs">
              <span className="live-stream-dot"></span> Pipeline Flow
            </span>
            <span className="ticker-hint mono text-xs text-muted">Hover to trace</span>
          </div>

          <div className="ticker-nodes-strip">
            {steps.map((s, idx) => (
              <React.Fragment key={s.label}>
                <span
                  className="ticker-node-chip mono text-xs"
                  title={`${s.label}: ${s.role}`}
                >
                  {s.label}
                </span>
                {idx < steps.length - 1 && (
                  <ArrowRight size={10} className="ticker-arrow text-muted" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <p className="project-summary">{project.summary}</p>

      {/* Blueprint Mode Technical Annotation Overlay (Strictly Factual) */}
      {isBlueprintMode && (
        <div className="blueprint-annotation-box">
          <div className="blueprint-tag-header">
            <Compass size={12} className="text-cyan" />
            <span className="mono text-xs font-semibold">Blueprint Specification</span>
          </div>
          <div className="blueprint-specs-grid">
            <div className="spec-row">
              <span className="spec-key mono text-xs">Runtime / Stack:</span>
              <span className="spec-val mono text-xs">{project.technologies.join(' · ')}</span>
            </div>
            <div className="spec-row">
              <span className="spec-key mono text-xs">Pipeline Stages:</span>
              <span className="spec-val mono text-xs">
                {steps.map(s => s.label).join(' → ')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Highlights */}
      <ul className="project-highlights">
        {project.bullets.map((bullet, idx) => (
          <li key={idx} className="project-highlight-item">
            <span className="highlight-bullet"></span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      {/* Audio Playground Feature for Audio Comparison Tool */}
      {isAudioProject && (
        <div className="card-playground-section">
          <button
            onClick={() => setShowAudioPlayground(!showAudioPlayground)}
            className="btn btn-secondary btn-sm audio-playground-toggle"
            aria-expanded={showAudioPlayground}
          >
            <Activity size={13} className="text-accent" />
            <span>{showAudioPlayground ? 'Hide Acoustic Explorer' : 'Open Acoustic Feature Explorer'}</span>
          </button>

          {showAudioPlayground && (
            <div className="inline-playground-wrap">
              <AudioPlayground />
            </div>
          )}
        </div>
      )}

      {/* Technology Tags */}
      <div className="project-tech-matrix">
        {project.technologies.map((tech) => {
          const isActive =
            activeSkillFilter &&
            tech.toLowerCase() === activeSkillFilter.toLowerCase();

          return (
            <button
              key={tech}
              onClick={() => toggleSkillFilter(tech)}
              className={`tag-badge interactive ${isActive ? 'active' : ''}`}
              title={`Filter by ${tech}`}
            >
              {tech}
            </button>
          );
        })}
      </div>

      {/* Direct Links Footer */}
      <div className="project-card-footer">
        <div className="project-links">
          {project.links && project.links.length > 0 && project.links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link-item text-xs"
            >
              {link.type === 'github' ? <GithubIcon size={13} /> : <ExternalLink size={13} />}
              <span>{link.label}</span>
            </a>
          ))}
        </div>

        <button
          onClick={() => setSelectedProject(project)}
          className="btn btn-ghost btn-sm inspect-text-btn"
        >
          View Pipeline Flow →
        </button>
      </div>
    </article>
  );
}
