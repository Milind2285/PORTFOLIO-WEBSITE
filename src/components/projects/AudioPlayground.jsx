import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Activity, BarChart2, Radio, Info } from 'lucide-react';

export function AudioPlayground() {
  const [signalType, setSignalType] = useState('harmonic'); // 'sine' | 'harmonic' | 'sweep'
  const [frequency, setFrequency] = useState(440); // 100 to 1000 Hz
  const [viewMode, setViewMode] = useState('waveform'); // 'waveform' | 'spectral' | 'mfcc'
  const canvasRef = useRef(null);

  // Real-time canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const render = () => {
      time += 0.04;
      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas with deep slate background
      ctx.fillStyle = '#0a0c10';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const centerY = height / 2;
      const freqFactor = (frequency / 250);

      if (viewMode === 'waveform') {
        // --- 1. TIME DOMAIN WAVEFORM ---
        ctx.beginPath();
        ctx.strokeStyle = '#f59e0b'; // Signal Ochre
        ctx.lineWidth = 2;

        for (let x = 0; x < width; x++) {
          const t = (x / width) * 4 * Math.PI * freqFactor + time;
          let yVal = 0;

          if (signalType === 'sine') {
            yVal = Math.sin(t);
          } else if (signalType === 'harmonic') {
            yVal = 0.6 * Math.sin(t) + 0.3 * Math.sin(2 * t + 0.5) + 0.15 * Math.sin(3 * t + 1.2);
          } else if (signalType === 'sweep') {
            const sweepMod = (x / width) * 2;
            yVal = Math.sin(t * (1 + sweepMod));
          }

          const y = centerY + yVal * (height * 0.38);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

        // Center baseline
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.2)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
        ctx.setLineDash([]);

      } else if (viewMode === 'spectral') {
        // --- 2. SPECTRAL FREQUENCY DECOMPOSITION ---
        const numBands = 32;
        const barWidth = (width - 40) / numBands;

        for (let i = 0; i < numBands; i++) {
          const bandFreq = (i + 1) * 35;
          let magnitude = 0;

          if (signalType === 'sine') {
            const dist = Math.abs(bandFreq - frequency);
            magnitude = Math.max(0, 1 - dist / 120);
          } else if (signalType === 'harmonic') {
            const d1 = Math.abs(bandFreq - frequency);
            const d2 = Math.abs(bandFreq - frequency * 2);
            const d3 = Math.abs(bandFreq - frequency * 3);
            magnitude = Math.max(0, 0.8 * Math.max(0, 1 - d1 / 100) + 0.5 * Math.max(0, 1 - d2 / 100) + 0.3 * Math.max(0, 1 - d3 / 100));
          } else if (signalType === 'sweep') {
            const sweepCenter = frequency * (0.8 + 0.4 * Math.sin(time));
            const dist = Math.abs(bandFreq - sweepCenter);
            magnitude = Math.max(0, 0.9 * (1 - dist / 250));
          }

          // Dynamic fluctuation
          const jitter = 0.05 * Math.sin(time * 3 + i);
          const barHeight = Math.min(height - 20, Math.max(4, (magnitude + jitter) * (height - 30)));
          const x = 20 + i * barWidth;
          const y = height - 10 - barHeight;

          // Gradient bar
          const grad = ctx.createLinearGradient(0, y, 0, height);
          grad.addColorStop(0, '#38bdf8');
          grad.addColorStop(1, '#0284c7');

          ctx.fillStyle = grad;
          ctx.fillRect(x, y, barWidth - 3, barHeight);
        }

      } else if (viewMode === 'mfcc') {
        // --- 3. MFCC (MEL-FREQUENCY CEPSTRAL COEFFICIENTS) VECTOR MATRIX ---
        const numCoeffs = 13; // Standard 13 MFCC coefficients
        const barWidth = (width - 40) / numCoeffs;

        for (let i = 0; i < numCoeffs; i++) {
          // Mel filterbank mathematical approximation
          let coeff = 0;
          if (signalType === 'sine') {
            coeff = Math.cos((i * Math.PI * frequency) / 1000) * 0.7;
          } else if (signalType === 'harmonic') {
            coeff = (Math.cos((i * Math.PI * frequency) / 1000) * 0.5 + Math.sin(i * 0.8) * 0.4);
          } else if (signalType === 'sweep') {
            coeff = Math.cos((i * (frequency + 200 * Math.sin(time))) / 600) * 0.8;
          }

          const barHeight = Math.abs(coeff) * (height * 0.42);
          const x = 20 + i * barWidth;
          const isPositive = coeff >= 0;
          const y = isPositive ? centerY - barHeight : centerY;

          ctx.fillStyle = isPositive ? '#f59e0b' : '#38bdf8';
          ctx.fillRect(x, y, barWidth - 4, barHeight || 3);

          // Coeff index label
          ctx.fillStyle = '#64748b';
          ctx.font = '9px monospace';
          ctx.fillText(`c${i}`, x + 2, height - 4);
        }

        // Center 0-line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.beginPath();
        ctx.moveTo(15, centerY);
        ctx.lineTo(width - 15, centerY);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [signalType, frequency, viewMode]);

  return (
    <div className="audio-playground-box">
      <div className="playground-header">
        <div className="playground-badge-title">
          <Activity size={14} className="text-accent" />
          <span className="mono text-xs font-semibold">Interactive Acoustic Explorer</span>
        </div>
        <span className="playground-disclaimer text-xs mono">
          *Visualization Inspired by Signal Processing Concepts
        </span>
      </div>

      {/* Preset Controls */}
      <div className="playground-controls-row">
        <div className="signal-selector-group">
          <span className="control-label mono text-xs">Signal Preset:</span>
          <div className="btn-group">
            {[
              { id: 'sine', label: 'Pure Sine' },
              { id: 'harmonic', label: 'Harmonic Composite' },
              { id: 'sweep', label: 'Frequency Sweep' }
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setSignalType(s.id)}
                className={`btn btn-sm ${signalType === s.id ? 'btn-primary' : 'btn-secondary'}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="view-mode-group">
          <span className="control-label mono text-xs">Transform Representation:</span>
          <div className="btn-group">
            {[
              { id: 'waveform', label: 'Time Waveform' },
              { id: 'spectral', label: 'Spectral Bands' },
              { id: 'mfcc', label: 'MFCC Vector (13 Coeffs)' }
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setViewMode(v.id)}
                className={`btn btn-sm ${viewMode === v.id ? 'btn-primary' : 'btn-secondary'}`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Frequency Slider */}
      <div className="frequency-slider-row">
        <label htmlFor="freq-slider" className="slider-label mono text-xs">
          Frequency Parameter: <strong>{frequency} Hz</strong>
        </label>
        <input
          id="freq-slider"
          type="range"
          min="120"
          max="880"
          step="10"
          value={frequency}
          onChange={(e) => setFrequency(Number(e.target.value))}
          className="interactive-slider"
          aria-label="Frequency parameter modulation"
        />
      </div>

      {/* Real-time Oscilloscope / Feature Canvas */}
      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={560}
          height={160}
          className="audio-canvas"
        />
        <div className="canvas-overlay-tag mono text-xs">
          {viewMode === 'waveform' && 'x(t) Signal Waveform'}
          {viewMode === 'spectral' && 'Magnitude Spectrum |X(f)|'}
          {viewMode === 'mfcc' && 'MFCC Mel-Scale Coefficients [c0...c12]'}
        </div>
      </div>
    </div>
  );
}
