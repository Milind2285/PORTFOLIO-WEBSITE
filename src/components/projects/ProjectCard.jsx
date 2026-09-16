import React, { useState } from 'react';
import { ArrowUpRight, ExternalLink, Activity, Compass, ArrowRight, GitBranch } from 'lucide-react';
import { GithubIcon } from '../icons/Icons';
import { usePortfolio } from '../../context/PortfolioContext';
import { AudioPlayground } from './AudioPlayground';

export function ProjectCard({ project }) {
  const { activeSkillFilter, toggleSkillFilter, setSelectedProject, isBlueprintMode } = usePortfolio();
  const [showAudioPlayground, setShowAudioPlayground] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredStageIdx, setHoveredStageIdx] = useState(null);

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
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredStageIdx(null);
      }}
      onFocus={() => setIsHovered(true)}
      onBlur={() => {
        setIsHovered(false);
        setHoveredStageIdx(null);
      }}
      tabIndex={0}
      aria-label={`${project.title} - ${project.category}`}
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
          <ArrowUpRight size={14} />
        </button>
      </div>

      <p className="project-summary">{project.summary}</p>

      {/* Progressive Architecture Discovery Flow on Hover/Focus */}
      {steps.length > 0 && (
        <div className={`card-discovery-flow ${isHovered ? 'revealed' : ''}`}>
          <div className="flow-discovery-header">
            <span className="flow-label mono text-xs">
              <span className="flow-signal-pip"></span> Architecture Pipeline
            </span>
            {hoveredStageIdx !== null && (
              <span className="flow-stage-role mono text-xs">
                {steps[hoveredStageIdx].role}
              </span>
            )}
          </div>

          <div className="flow-discovery-nodes">
            {steps.map((s, idx) => {
              const isHoveredStage = idx === hoveredStageIdx;

              return (
                <React.Fragment key={s.label}>
                  <span
                    className={`discovery-node-pill mono text-xs ${isHoveredStage ? 'active-node' : ''}`}
                    onMouseEnter={() => setHoveredStageIdx(idx)}
                    onMouseLeave={() => setHoveredStageIdx(null)}
                    title={`${s.label}: ${s.role}`}
                  >
                    {s.label}
                  </span>
                  {idx < steps.length - 1 && (
                    <span className="discovery-arrow" aria-hidden="true">→</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

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
                {steps.map((s) => s.label).join(' → ')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Verified Highlights */}
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
          Inspect Architecture →
        </button>
      </div>
    </article>
  );
}
