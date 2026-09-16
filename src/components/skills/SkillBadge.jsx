import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export function SkillBadge({ skill, activeProjectHighlight, projectAnchors, onSkillHover }) {
  const { activeSkillFilter, toggleSkillFilter } = usePortfolio();
  const isActive = activeSkillFilter?.toLowerCase() === skill.toLowerCase();

  // Check if this skill is in the currently highlighted project anchor
  const isLinkedToHighlightedProject = activeProjectHighlight
    ? projectAnchors
        ?.find((p) => p.id === activeProjectHighlight)
        ?.skills.some((s) => s.toLowerCase() === skill.toLowerCase())
    : false;

  // Check if this skill is linked to ANY project in the portfolio
  const linkedProjectsCount = projectAnchors?.filter((p) =>
    p.skills.some((s) => s.toLowerCase() === skill.toLowerCase())
  ).length || 0;

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
      onMouseEnter={() => onSkillHover && onSkillHover(skill)}
      onMouseLeave={() => onSkillHover && onSkillHover(null)}
      onFocus={() => onSkillHover && onSkillHover(skill)}
      onBlur={() => onSkillHover && onSkillHover(null)}
      className={`tag-badge interactive skill-matrix-pill ${isActive ? 'active' : ''} ${isLinkedToHighlightedProject ? 'skill-anchor-highlight' : ''} ${activeProjectHighlight && !isLinkedToHighlightedProject ? 'skill-anchor-dimmed' : ''}`}
      aria-pressed={isActive}
      title={
        linkedProjectsCount > 0
          ? `${skill} (Implemented in ${linkedProjectsCount} verified project${linkedProjectsCount > 1 ? 's' : ''}) — Click to filter`
          : `${skill} (Core Engineering Competency) — Click to filter`
      }
    >
      {linkedProjectsCount > 0 && (
        <span className="skill-connection-pip" aria-hidden="true"></span>
      )}
      <span>{skill}</span>
    </button>
  );
}
