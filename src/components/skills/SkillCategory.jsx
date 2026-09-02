import React from 'react';
import { SkillBadge } from './SkillBadge';

export function SkillCategory({ category }) {
  return (
    <div className="skill-category-card card-surface">
      <h3 className="skill-category-name">{category.name}</h3>
      <div className="skill-badges-wrap">
        {category.skills.map((skill) => (
          <SkillBadge key={skill} skill={skill} />
        ))}
      </div>
    </div>
  );
}
