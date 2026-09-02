import React from 'react';
import { Sparkles, Terminal, Code2 } from 'lucide-react';
import { skillCategories } from '../../data/skills';
import { SkillCategory } from './SkillCategory';

export function SkillsSection() {
  return (
    <section id="skills" className="section">
      <div className="site-container">
        <div className="section-header">
          <span className="section-label">Technical Competencies</span>
          <div className="section-title">
            <h2>Skills & Technologies</h2>
            <span className="text-xs mono text-muted">
              Select any skill to cross-filter relevant projects
            </span>
          </div>
          <p className="section-subtitle">
            Languages, frameworks, databases, and core computer science fundamentals.
          </p>
        </div>

        <div className="skills-grid">
          {skillCategories.map((category) => (
            <SkillCategory key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
