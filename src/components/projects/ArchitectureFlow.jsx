import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Info, Play, Pause, RotateCcw } from 'lucide-react';

export function ArchitectureFlow({ architecture }) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const simulationTimerRef = useRef(null);

  if (!architecture || !architecture.steps) return null;

  const steps = architecture.steps;
  const activeStep = steps[activeStepIndex] || steps[0];

  // Simulation execution loop
  useEffect(() => {
    if (isSimulating) {
      simulationTimerRef.current = setInterval(() => {
        setActiveStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsSimulating(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
    } else {
      clearInterval(simulationTimerRef.current);
    }

    return () => clearInterval(simulationTimerRef.current);
  }, [isSimulating, steps.length]);

  const handleStartSimulation = () => {
    if (activeStepIndex >= steps.length - 1) {
      setActiveStepIndex(0);
    }
    setIsSimulating(true);
  };

  const handlePauseSimulation = () => {
    setIsSimulating(false);
  };

  const handleReset = () => {
    setIsSimulating(false);
    setActiveStepIndex(0);
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (idx + 1) % steps.length;
      setActiveStepIndex(next);
      document.getElementById(`flow-node-${next}`)?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (idx - 1 + steps.length) % steps.length;
      setActiveStepIndex(prev);
      document.getElementById(`flow-node-${prev}`)?.focus();
    }
  };

  return (
    <div className="architecture-flow-container">
      <div className="architecture-flow-header">
        <div className="flow-title-wrap">
          <span className="arch-flow-title">{architecture.title}</span>
          <span className="arch-flow-hint text-xs mono">Visual simulation of project flow</span>
        </div>

        {/* Simulation Controls */}
        <div className="simulation-actions">
          {isSimulating ? (
            <button
              onClick={handlePauseSimulation}
              className="btn btn-secondary btn-sm sim-btn"
              title="Pause flow simulation"
              aria-label="Pause flow simulation"
            >
              <Pause size={12} />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={handleStartSimulation}
              className="btn btn-primary btn-sm sim-btn"
              title="Simulate sequential data flow"
              aria-label="Simulate sequential data flow"
            >
              <Play size={12} />
              <span>{activeStepIndex >= steps.length - 1 ? 'Replay Flow' : 'Simulate Flow'}</span>
            </button>
          )}

          <button
            onClick={handleReset}
            className="btn btn-ghost btn-sm sim-icon-btn"
            title="Reset to step 1"
            aria-label="Reset simulation"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* Interactive Step Pipeline */}
      <div className="flow-pipeline" role="tablist" aria-label="Architecture Pipeline Steps">
        {steps.map((step, idx) => {
          const isSelected = idx === activeStepIndex;
          const isTraversed = idx < activeStepIndex;
          const isLast = idx === steps.length - 1;

          return (
            <React.Fragment key={step.label}>
              <button
                id={`flow-node-${idx}`}
                role="tab"
                aria-selected={isSelected}
                aria-controls="active-step-panel"
                tabIndex={isSelected ? 0 : -1}
                onClick={() => {
                  setIsSimulating(false);
                  setActiveStepIndex(idx);
                }}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={`flow-node ${isSelected ? 'active' : ''} ${isTraversed ? 'traversed' : ''} ${isSimulating && isSelected ? 'simulating-node' : ''}`}
              >
                <span className="node-number">{idx + 1}</span>
                <span className="node-label">{step.label}</span>
              </button>

              {!isLast && (
                <div
                  className={`flow-connector ${idx === activeStepIndex - 1 ? 'connector-active' : ''}`}
                  aria-hidden="true"
                >
                  <ArrowRight size={14} />
                  {isSimulating && idx === activeStepIndex - 1 && (
                    <span className="pulse-signal-dot"></span>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Active Step Details Panel */}
      <div id="active-step-panel" className="active-step-details" role="tabpanel" aria-labelledby={`flow-node-${activeStepIndex}`}>
        <div className="step-role-badge">
          <Info size={13} className="text-accent" />
          <span className="mono">Stage {activeStepIndex + 1} of {steps.length}: {activeStep.role}</span>
        </div>
        <p className="step-desc">{activeStep.desc}</p>
      </div>
    </div>
  );
}
