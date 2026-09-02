import React, { useState } from 'react';
import { Play, ArrowRight, Layers, Activity, Cpu, Sparkles } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { projectsData } from '../../data/projects';

export function HeroSignalFlow() {
  const { setSelectedProject, setActiveSkillFilter } = usePortfolio();
  const [activeChannel, setActiveChannel] = useState(0);

  const channels = [
    {
      id: "ai-interview",
      projectRef: projectsData[0],
      domain: "Full-Stack AI Engine",
      icon: Layers,
      color: "var(--accent-primary)",
      nodes: ["React UI", "Spring Boot", "REST APIs", "Groq LLM", "Evaluation"]
    },
    {
      id: "audio-dsp",
      projectRef: projectsData[1],
      domain: "Audio DSP Pipeline",
      icon: Activity,
      color: "var(--accent-cyan)",
      nodes: ["Audio Input", "Librosa", "MFCC Extraction", "Similarity"]
    },
    {
      id: "vision-cnn",
      projectRef: projectsData[2],
      domain: "Vision CNN Classifier",
      icon: Cpu,
      color: "var(--accent-emerald)",
      nodes: ["Leaf Image", "Preprocessing", "Augmentation", "CNN Model", "Diagnosis"]
    }
  ];

  const currentChannel = channels[activeChannel];

  const handleInspectProject = (project) => {
    if (project) {
      setSelectedProject(project);
    }
  };

  return (
    <div className="hero-signal-schematic" aria-label="Interactive Systems Signal Flow">
      <div className="schematic-header">
        <div className="schematic-title-group">
          <span className="signal-live-beacon"></span>
          <span className="mono text-xs font-semibold">Systems Architecture Flow</span>
        </div>
        <span className="text-xs mono text-muted">Hover or select system track</span>
      </div>

      {/* 3 Interactive System Tracks */}
      <div className="channel-track-selector" role="tablist">
        {channels.map((ch, idx) => {
          const isSelected = idx === activeChannel;
          const Icon = ch.icon;

          return (
            <button
              key={ch.id}
              role="tab"
              aria-selected={isSelected}
              onClick={() => setActiveChannel(idx)}
              onMouseEnter={() => setActiveChannel(idx)}
              className={`channel-pill ${isSelected ? 'active' : ''}`}
            >
              <Icon size={12} className="channel-icon" />
              <span>{ch.domain}</span>
            </button>
          );
        })}
      </div>

      {/* Live Signal Bus & Pipeline Nodes */}
      <div className="schematic-viewport">
        <div className="signal-bus-rail">
          <div className="rail-glow-line"></div>
          <div className="signal-packet-pulse"></div>
        </div>

        <div className="signal-nodes-row">
          {currentChannel.nodes.map((node, nIdx) => {
            const isLast = nIdx === currentChannel.nodes.length - 1;

            return (
              <React.Fragment key={node}>
                <div className="schematic-node">
                  <span className="node-stage-index mono text-xs">0{nIdx + 1}</span>
                  <span className="node-stage-label mono">{node}</span>
                </div>

                {!isLast && (
                  <div className="node-bridge" aria-hidden="true">
                    <span className="bridge-wire"></span>
                    <ArrowRight size={12} className="bridge-arrow" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Quick Action Footer */}
      <div className="schematic-footer">
        <div className="schematic-project-meta">
          <span className="meta-label text-xs mono text-muted">Associated Project:</span>
          <span className="meta-name font-semibold text-xs">{currentChannel.projectRef.title}</span>
        </div>

        <button
          onClick={() => handleInspectProject(currentChannel.projectRef)}
          className="btn btn-secondary btn-sm mono text-xs schematic-action-btn"
        >
          <span>Inspect Architecture</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}
