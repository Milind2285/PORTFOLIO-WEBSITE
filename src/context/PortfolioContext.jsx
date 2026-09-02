import React, { createContext, useContext, useState, useEffect } from 'react';

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [activeSkillFilter, setActiveSkillFilter] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isBlueprintMode, setIsBlueprintMode] = useState(false);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);

  const toggleSkillFilter = (skillName) => {
    setActiveSkillFilter((prev) => (prev === skillName ? null : skillName));
  };

  const clearSkillFilter = () => {
    setActiveSkillFilter(null);
  };

  const toggleBlueprintMode = () => {
    setIsBlueprintMode((prev) => !prev);
  };

  // Global Keyboard shortcuts:
  // - Cmd/Ctrl + K: Command Palette
  // - B / b (when not typing in an input): Toggle Blueprint Mode
  // - Escape: Close modals/drawers
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (!isInput && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsBlueprintMode((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setSelectedProject(null);
        setIsTelemetryOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        activeSkillFilter,
        setActiveSkillFilter,
        toggleSkillFilter,
        clearSkillFilter,
        selectedProject,
        setSelectedProject,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isBlueprintMode,
        setIsBlueprintMode,
        toggleBlueprintMode,
        isTelemetryOpen,
        setIsTelemetryOpen
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
