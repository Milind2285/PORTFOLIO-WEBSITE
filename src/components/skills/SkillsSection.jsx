import React, { useState } from 'react';
import { Layers, Activity, Cpu } from 'lucide-react';
import { skillCategories } from '../../data/skills';
import { usePortfolio } from '../../context/PortfolioContext';
import { SkillCategory } from './SkillCategory';

export function SkillsSection() {
  const [activeProjectHighlight, setActiveProjectHighlight] = useState(null);
  const [activeSkillHover, setActiveSkillHover] = useState(null);

  const projectAnchors = [
    {
      id: "ai-interview-simulator",
      name: "AI Interview Simulator",
      domain: "Full-Stack & AI",
      icon: Layers,
      skills: ["Java", "Spring Boot", "React", "REST APIs", "Groq API"]
    },
    {
      id: "audio-comparison-tool",
      name: "Audio Comparison Tool",
      domain: "Audio DSP",
      icon: Activity,
      skills: ["Python", "Librosa", "SciPy"]
    },
    {
      id: "plant-disease-prediction",
      name: "Plant Disease Prediction System",
      domain: "Computer Vision",
      icon: Cpu,
      skills: ["Python", "TensorFlow", "CNN"]
    }
  ];

  // Projects connected to hovered skill
  const connectedProjects = activeSkillHover
    ? projectAnchors.filter((p) =>
        p.skills.some((s) => s.toLowerCase() === activeSkillHover.toLowerCase())
      )
    : [];

  // Active highlighted project object
  const highlightedProjectObj = activeProjectHighlight
    ? projectAnchors.find((p) => p.id === activeProjectHighlight)
    : null;

  return (
    <section id="skills" className="section skills-section">
      <div className="site-container">
        <div className="section-header reveal-item">
          <span className="section-label">Technical Competencies</span>
          <div className="section-title">
            <h2>Skills & Project Relationships</h2>
            <span className="text-xs mono text-muted">
              Select any skill to cross-filter relevant projects
            </span>
          </div>
          <p className="section-subtitle">
            Direct mapping of languages, frameworks, and core engineering fundamentals to verified project implementations.
          </p>
        </div>

        {/* Relationship Connection Visual Bar */}
        <div className="skills-relationship-bar reveal-item reveal-stagger-1">
          <div className="relationship-anchors-row" role="tablist" aria-label="Project Anchors">
            <span className="relationship-label mono text-xs">
              <span className="signal-flow-pip" aria-hidden="true"></span>
              Verified Projects:
            </span>

            {projectAnchors.map((proj) => {
              const Icon = proj.icon;
              const isSelected = activeProjectHighlight === proj.id;
              const isLinkedToHoveredSkill = connectedProjects.some((p) => p.id === proj.id);

              return (
                <button
                  key={proj.id}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveProjectHighlight(isSelected ? null : proj.id)}
                  onMouseEnter={() => setActiveProjectHighlight(proj.id)}
                  onMouseLeave={() => setActiveProjectHighlight(null)}
                  className={`project-anchor-btn ${isSelected ? 'anchor-active' : ''} ${isLinkedToHoveredSkill ? 'anchor-linked' : ''}`}
                >
                  <Icon size={12} className="anchor-icon" />
                  <span className="anchor-name">{proj.name}</span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Relationship Tracer Note */}
          <div className="relationship-trace-line mono text-xs">
            {activeSkillHover ? (
              <div className="trace-msg">
                <span className="trace-skill-name text-accent font-semibold">{activeSkillHover}</span>
                <span className="trace-connector">──────▶</span>
                {connectedProjects.length > 0 ? (
                  <span className="trace-targets">
                    {connectedProjects.map((p, i) => (
                      <span key={p.id} className="trace-target-badge">
                        {p.name}{i < connectedProjects.length - 1 ? ' · ' : ''}
                      </span>
                    ))}
                  </span>
                ) : (
                  <span className="trace-foundation">Computer Science & Core System Foundation</span>
                )}
              </div>
            ) : highlightedProjectObj ? (
              <div className="trace-msg">
                <span className="trace-project-name text-accent font-semibold">{highlightedProjectObj.name}</span>
                <span className="trace-connector">──────▶</span>
                <span className="text-secondary">Highlighted core stack below</span>
              </div>
            ) : (
              <div className="trace-msg text-muted">
                <span>Hover a skill or project to trace architecture connections · Click to filter</span>
              </div>
            )}
          </div>
        </div>

        {/* Clean, Non-Boxy Skills Matrix with Open Breathing Room */}
        <div className="skills-matrix-layout reveal-item reveal-stagger-2">
          {skillCategories.map((category) => (
            <SkillCategory
              key={category.id}
              category={category}
              activeProjectHighlight={activeProjectHighlight}
              projectAnchors={projectAnchors}
              onSkillHover={setActiveSkillHover}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
