import React, { useEffect, useRef } from 'react';
import { X, ExternalLink, Layers, ArrowUpRight, Cpu, Compass } from 'lucide-react';
import { GithubIcon } from '../icons/Icons';
import { ArchitectureFlow } from './ArchitectureFlow';
import { AudioPlayground } from './AudioPlayground';
import { usePortfolio } from '../../context/PortfolioContext';

export function ProjectInspector() {
  const { selectedProject, setSelectedProject, toggleSkillFilter, isBlueprintMode } = usePortfolio();
  const drawerRef = useRef(null);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      if (drawerRef.current) {
        drawerRef.current.focus();
      }
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  if (!selectedProject) return null;

  const isAudioProject = selectedProject.id === 'audio-comparison-tool';

  return (
    <div
      className="modal-overlay"
      onClick={() => setSelectedProject(null)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="inspector-project-title"
    >
      <div
        className="project-inspector-panel"
        ref={drawerRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="inspector-header">
          <div>
            <span className="section-label">{selectedProject.category}</span>
            <h2 id="inspector-project-title" className="inspector-title">
              {selectedProject.title}
            </h2>
          </div>
          <button
            onClick={() => setSelectedProject(null)}
            className="inspector-close-btn"
            aria-label="Close project inspector"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="inspector-body">
          {/* Blueprint Annotation when active */}
          {isBlueprintMode && (
            <div className="blueprint-annotation-box">
              <div className="blueprint-tag-header">
                <Compass size={12} className="text-cyan" />
                <span className="mono text-xs font-semibold">Blueprint Specification Ledger</span>
              </div>
              <div className="blueprint-specs-grid">
                <div className="spec-row">
                  <span className="spec-key mono text-xs">Technologies:</span>
                  <span className="spec-val mono text-xs">{selectedProject.technologies.join(', ')}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-key mono text-xs">Pipeline Execution:</span>
                  <span className="spec-val mono text-xs">
                    {selectedProject.architecture ? selectedProject.architecture.steps.map(s => s.label).join(' → ') : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="inspector-section">
            <h4 className="inspector-section-heading">Overview</h4>
            <p className="inspector-summary">{selectedProject.summary}</p>
          </div>

          {/* Interactive Architecture Flow & Simulation */}
          {selectedProject.architecture && (
            <div className="inspector-section">
              <h4 className="inspector-section-heading">Architecture & Execution Flow</h4>
              <ArchitectureFlow architecture={selectedProject.architecture} />
            </div>
          )}

          {/* Audio Playground for Audio Comparison Tool */}
          {isAudioProject && (
            <div className="inspector-section">
              <h4 className="inspector-section-heading">Acoustic Signal & Feature Explorer</h4>
              <AudioPlayground />
            </div>
          )}

          {/* Technical Details & Highlights */}
          <div className="inspector-section">
            <h4 className="inspector-section-heading">Key Implementation Highlights</h4>
            <ul className="inspector-bullet-list">
              {selectedProject.bullets.map((bullet, idx) => (
                <li key={idx} className="inspector-bullet-item">
                  <span className="bullet-point-marker"></span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          <div className="inspector-section">
            <h4 className="inspector-section-heading">Technologies Used</h4>
            <div className="inspector-tech-tags">
              {selectedProject.technologies.map((tech) => (
                <button
                  key={tech}
                  onClick={() => {
                    toggleSkillFilter(tech);
                    setSelectedProject(null);
                  }}
                  className="tag-badge interactive"
                  title={`Filter projects by ${tech}`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {selectedProject.links && selectedProject.links.length > 0 && (
            <div className="inspector-section">
              <h4 className="inspector-section-heading">Project Links</h4>
              <div className="inspector-links-row">
                {selectedProject.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                  >
                    {link.type === 'github' ? <GithubIcon size={14} /> : <ExternalLink size={14} />}
                    <span>{link.label}</span>
                    <ArrowUpRight size={12} className="text-muted" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
