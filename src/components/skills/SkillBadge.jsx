import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export function SkillBadge({ skill }) {
  const { activeSkillFilter, toggleSkillFilter } = usePortfolio();
  const isActive = activeSkillFilter?.toLowerCase() === skill.toLowerCase();

  const handleClick = () => {
    const isActivating = !isActive;
    toggleSkillFilter(skill);
    if (isActivating) {
      const el = document.getElementById('projects');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`tag-badge interactive ${isActive ? 'active' : ''}`}
      aria-pressed={isActive}
      title={`Click to filter projects by ${skill}`}
    >
      <span>{skill}</span>
    </button>
  );
}
