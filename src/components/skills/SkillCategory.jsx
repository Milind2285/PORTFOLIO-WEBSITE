import React from 'react';
import { SkillBadge } from './SkillBadge';

export function SkillCategory({ category, activeProjectHighlight, projectAnchors, onSkillHover }) {
  return (
    <div className="skill-category-group">
      <div className="category-label-row">
        <span className="category-bullet" aria-hidden="true"></span>
        <h3 className="category-heading mono">{category.name}</h3>
      </div>

      <div className="category-badges-flow">
        {category.skills.map((skill) => (
          <SkillBadge
            key={skill}
            skill={skill}
            activeProjectHighlight={activeProjectHighlight}
            projectAnchors={projectAnchors}
            onSkillHover={onSkillHover}
          />
        ))}
      </div>
    </div>
  );
}
