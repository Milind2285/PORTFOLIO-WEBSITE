import React, { useState, useEffect } from 'react';
import { X, Cpu, Monitor, Clock, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export function TelemetryModal() {
  const { isTelemetryOpen, setIsTelemetryOpen } = usePortfolio();
  const [telemetry, setTelemetry] = useState({
    viewport: '',
    dpr: 1,
    colorScheme: 'dark',
    reducedMotion: 'no-preference',
    currentTimeIST: ''
  });

  useEffect(() => {
    if (isTelemetryOpen) {
      const updateData = () => {
        const now = new Date();
        const istTime = now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });

        setTelemetry({
          viewport: `${window.innerWidth} × ${window.innerHeight} px`,
          dpr: window.devicePixelRatio || 1,
          colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark Theme' : 'Light Theme',
          reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'Enabled' : 'Disabled',
          currentTimeIST: istTime
        });
      };

      updateData();
      const interval = setInterval(updateData, 1000);
      return () => clearInterval(interval);
    }
  }, [isTelemetryOpen]);

  if (!isTelemetryOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={() => setIsTelemetryOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="telemetry-title"
    >
      <div
        className="telemetry-card card-surface"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="telemetry-header">
          <div className="telemetry-badge-group">
            <Cpu size={15} className="text-accent" />
            <h3 id="telemetry-title" className="telemetry-title">
              Client Runtime Telemetry
            </h3>
          </div>
          <button
            onClick={() => setIsTelemetryOpen(false)}
            className="telemetry-close-btn"
            aria-label="Close telemetry modal"
          >
            <X size={16} />
          </button>
        </div>

        <p className="telemetry-desc text-xs text-muted">
          [Easter Egg Unlocked] Real client runtime telemetry and environment diagnostics.
        </p>

        <div className="telemetry-grid">
          <div className="telemetry-cell">
            <div className="cell-label mono text-xs">
              <Monitor size={12} className="text-cyan" />
              <span>Viewport Resolution</span>
            </div>
            <span className="cell-value mono">{telemetry.viewport}</span>
          </div>

          <div className="telemetry-cell">
            <div className="cell-label mono text-xs">
              <Zap size={12} className="text-accent" />
              <span>Device Pixel Ratio</span>
            </div>
            <span className="cell-value mono">{telemetry.dpr}x</span>
          </div>

          <div className="telemetry-cell">
            <div className="cell-label mono text-xs">
              <Clock size={12} className="text-emerald" />
              <span>Local Time (Dehradun, IST)</span>
            </div>
            <span className="cell-value mono">{telemetry.currentTimeIST} IST</span>
          </div>

          <div className="telemetry-cell">
            <div className="cell-label mono text-xs">
              <ShieldCheck size={12} className="text-cyan" />
              <span>Reduced Motion</span>
            </div>
            <span className="cell-value mono">{telemetry.reducedMotion}</span>
          </div>
        </div>

        <div className="telemetry-footer mono text-xs">
          <span className="footer-status-pill">
            <span className="pulse-dot"></span> System State: Operational
          </span>
          <span className="text-muted">VIT Bhopal CSE · Milind Sharma</span>
        </div>
      </div>
    </div>
  );
}
