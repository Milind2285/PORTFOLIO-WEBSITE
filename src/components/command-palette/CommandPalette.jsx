import React, { useState, useEffect, useRef } from 'react';
import { Search, Navigation, Filter, Mail, Phone, X, ArrowRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../icons/Icons';
import { usePortfolio } from '../../context/PortfolioContext';
import { allFilterableSkills } from '../../data/skills';
import { profileData } from '../../data/profile';
import { useClipboard } from '../../hooks/useClipboard';

export function CommandPalette() {
  const { isCommandPaletteOpen, setIsCommandPaletteOpen, setActiveSkillFilter, clearSkillFilter } = usePortfolio();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const emailClipboard = useClipboard();
  const phoneClipboard = useClipboard();

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  // Ensure selected item is scrolled into view in list
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector('.palette-item.selected');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isCommandPaletteOpen) return null;

  const handleNavigate = (id) => {
    setIsCommandPaletteOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFilterTech = (tech) => {
    setActiveSkillFilter(tech);
    setIsCommandPaletteOpen(false);
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleResetFilter = () => {
    clearSkillFilter();
    setIsCommandPaletteOpen(false);
  };

  // Build command options
  const commands = [
    // Navigation
    { id: 'nav-projects', label: 'Go to Projects', category: 'Navigation', icon: Navigation, action: () => handleNavigate('projects') },
    { id: 'nav-skills', label: 'Go to Skills & Technologies', category: 'Navigation', icon: Navigation, action: () => handleNavigate('skills') },
    { id: 'nav-experience', label: 'Go to Experience & Leadership', category: 'Navigation', icon: Navigation, action: () => handleNavigate('experience') },
    { id: 'nav-education', label: 'Go to Education & Certifications', category: 'Navigation', icon: Navigation, action: () => handleNavigate('education') },
    { id: 'nav-contact', label: 'Go to Contact', category: 'Navigation', icon: Navigation, action: () => handleNavigate('contact') },

    // Filter Tech
    { id: 'filter-reset', label: 'Reset Active Filters', category: 'Filter Projects', icon: Filter, action: handleResetFilter },
    ...allFilterableSkills.map((tech) => ({
      id: `filter-${tech.toLowerCase()}`,
      label: `Filter by ${tech}`,
      category: 'Filter Projects',
      icon: Filter,
      action: () => handleFilterTech(tech)
    })),

    // Contact Actions
    {
      id: 'copy-email',
      label: `Copy Email (${profileData.contact.email})`,
      category: 'Contact',
      icon: Mail,
      action: () => {
        emailClipboard.copy(profileData.contact.email);
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'copy-phone',
      label: `Copy Phone (${profileData.contact.phone})`,
      category: 'Contact',
      icon: Phone,
      action: () => {
        phoneClipboard.copy(profileData.contact.phone);
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'open-github',
      label: 'Open GitHub Profile',
      category: 'Links',
      icon: GithubIcon,
      action: () => {
        window.open(profileData.contact.github, '_blank');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'open-linkedin',
      label: 'Open LinkedIn Profile',
      category: 'Links',
      icon: LinkedinIcon,
      action: () => {
        window.open(profileData.contact.linkedin, '_blank');
        setIsCommandPaletteOpen(false);
      }
    }
  ];

  // Filter commands by search query
  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredCommands.length > 0 ? (prev + 1) % filteredCommands.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredCommands.length > 0 ? (prev - 1 + filteredCommands.length) % filteredCommands.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      setIsCommandPaletteOpen(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={() => setIsCommandPaletteOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
    >
      <div
        className="command-palette-card"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search input header */}
        <div className="palette-input-wrapper">
          <Search size={16} className="palette-search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="palette-search-input"
            placeholder="Type a command, section, or technology..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="palette-close-btn"
            aria-label="Close command palette"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results list */}
        <div className="palette-results-list" ref={listRef} role="listbox">
          {filteredCommands.length === 0 ? (
            <div className="palette-empty-state">
              No matching commands found for "{searchQuery}".
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = cmd.icon;

              return (
                <div
                  key={cmd.id}
                  role="option"
                  aria-selected={isSelected}
                  className={`palette-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => cmd.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div className="palette-item-left">
                    <Icon size={14} className="palette-item-icon" />
                    <span className="palette-item-label">{cmd.label}</span>
                  </div>
                  <div className="palette-item-right">
                    <span className="palette-item-category mono text-xs">{cmd.category}</span>
                    {isSelected && <ArrowRight size={12} className="palette-item-arrow" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="palette-footer">
          <div className="palette-shortcuts">
            <span className="shortcut-item">
              <kbd>↑</kbd><kbd>↓</kbd> Navigate
            </span>
            <span className="shortcut-item">
              <kbd>↵</kbd> Select
            </span>
            <span className="shortcut-item">
              <kbd>esc</kbd> Close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
