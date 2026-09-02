import React, { useState, useRef } from 'react';
import { Terminal, Command, Menu, X, Compass, Layers } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export function Header({ activeSection }) {
  const { setIsCommandPaletteOpen, isBlueprintMode, toggleBlueprintMode, setIsTelemetryOpen } = usePortfolio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const clickCounterRef = useRef({ count: 0, lastTime: 0 });

  const navItems = [
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Easter egg: Triple click on brand marker within 1.2 seconds unlocks Telemetry
  const handleBrandClick = (e) => {
    const now = Date.now();
    if (now - clickCounterRef.current.lastTime < 600) {
      clickCounterRef.current.count += 1;
    } else {
      clickCounterRef.current.count = 1;
    }
    clickCounterRef.current.lastTime = now;

    if (clickCounterRef.current.count === 3) {
      e.preventDefault();
      setIsTelemetryOpen(true);
      clickCounterRef.current.count = 0;
    }
  };

  return (
    <header className="site-header">
      <div className="site-container header-inner">
        <a
          href="#hero"
          className="brand-logo"
          onClick={handleBrandClick}
          aria-label="Milind Sharma Home (Triple-click for telemetry)"
          title="Milind Sharma"
        >
          <span className="brand-marker">MS</span>
          <span className="brand-name">Milind Sharma</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <ul className="nav-list">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Action area: Blueprint Mode, Command Palette & Mobile Menu */}
        <div className="header-actions">
          {/* Blueprint Mode Toggle */}
          <button
            onClick={toggleBlueprintMode}
            className={`blueprint-toggle-btn ${isBlueprintMode ? 'blueprint-on' : ''}`}
            aria-pressed={isBlueprintMode}
            title="Toggle Technical Blueprint Mode (Press 'B')"
          >
            <Compass size={13} className="blueprint-icon" />
            <span className="blueprint-text mono text-xs">
              {isBlueprintMode ? 'Blueprint ON' : 'Blueprint'}
            </span>
          </button>

          {/* Command Palette Trigger */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="command-palette-trigger"
            aria-label="Open Command Palette"
            title="Command Palette (Ctrl/Cmd + K)"
          >
            <Command size={14} className="cmd-icon" />
            <span className="cmd-text">Commands</span>
            <kbd className="cmd-kbd">⌘K</kbd>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-toggle"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-panel">
          <nav aria-label="Mobile Navigation">
            <ul className="mobile-nav-list">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`mobile-nav-link ${activeSection === item.id ? 'active' : ''}`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
