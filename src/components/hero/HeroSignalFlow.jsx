import React, { useState } from 'react';
import { Layers, Activity, Cpu, ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { projectsData } from '../../data/projects';

export function HeroSignalFlow() {
  const { setSelectedProject } = usePortfolio();
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [hoveredStepIdx, setHoveredStepIdx] = useState(null);

  const projects = [
    {
      id: "ai-interview-simulator",
      projectRef: projectsData[0],
      name: "AI Interview Simulator",
      category: "Full-Stack & AI",
      icon: Layers,
      steps: projectsData[0].architecture.steps
    },
    {
      id: "audio-comparison-tool",
      projectRef: projectsData[1],
      name: "Audio Comparison Tool",
      category: "Audio DSP",
      icon: Activity,
      steps: projectsData[1].architecture.steps
    },
    {
      id: "plant-disease-prediction",
      projectRef: projectsData[2],
      name: "Plant Disease Prediction System",
      category: "Computer Vision",
      icon: Cpu,
      steps: projectsData[2].architecture.steps
    }
  ];

  const currentProject = projects[activeProjectIdx];
  const currentSteps = currentProject.steps;
  const displayedStepIndex = hoveredStepIdx ?? activeStepIdx;
  const currentStep = currentSteps[displayedStepIndex] || currentSteps[0];

  const handleSelectProject = (idx) => {
    setActiveProjectIdx(idx);
    setActiveStepIdx(0);
    setHoveredStepIdx(null);
  };

  const handleInspect = () => {
    if (currentProject.projectRef) {
      setSelectedProject(currentProject.projectRef);
    }
  };

  return (
    <div className="hero-signal-panel" aria-label="Interactive Systems Architecture Flow">
      {/* 1. Project Selector Tabs */}
      <div className="signal-project-tabs" role="tablist" aria-label="Select Project Pipeline">
        {projects.map((proj, idx) => {
          const isSelected = idx === activeProjectIdx;
          const Icon = proj.icon;

          return (
            <button
              key={proj.id}
              role="tab"
              aria-selected={isSelected}
              id={`system-tab-${idx}`}
              onClick={() => handleSelectProject(idx)}
              className={`project-tab-btn ${isSelected ? 'active' : ''}`}
            >
              <Icon size={12} className="tab-icon" aria-hidden="true" />
              <span className="tab-label">{proj.name}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Compact, Non-Overlapping Pipeline Flow */}
      <div className="signal-pipeline-flow" role="tablist" aria-label="Pipeline Stages">
        {currentSteps.map((step, idx) => {
          const isSelected = idx === displayedStepIndex;

          return (
            <React.Fragment key={step.label}>
              <button
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  setActiveStepIdx(idx);
                  setHoveredStepIdx(null);
                }}
                onMouseEnter={() => setHoveredStepIdx(idx)}
                onMouseLeave={() => setHoveredStepIdx(null)}
                onFocus={() => setActiveStepIdx(idx)}
                className={`pipeline-node-pill mono text-xs ${isSelected ? 'active-node' : ''}`}
                title={`${step.label}: ${step.role}`}
              >
                <span className="node-num">0{idx + 1}</span>
                <span className="node-text">{step.label}</span>
              </button>

              {idx < currentSteps.length - 1 && (
                <span className="pipeline-flow-arrow" aria-hidden="true">→</span>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* 3. One Active Stage Readout */}
      <div className="signal-active-stage">
        <div className="stage-meta-row">
          <div className="stage-meta-left">
            <span className="stage-counter mono text-xs">
              Stage 0{displayedStepIndex + 1}/{currentSteps.length}
            </span>
            <span className="stage-role-tag mono text-xs">{currentStep.role}</span>
          </div>
          <button
            onClick={handleInspect}
            className="stage-inspect-link mono text-xs"
            title="Open detailed architecture modal"
          >
            <span>Inspect Architecture</span>
            <ArrowUpRight size={12} />
          </button>
        </div>
        <p className="stage-desc-text">{currentStep.desc}</p>
      </div>
    </div>
  );
}
