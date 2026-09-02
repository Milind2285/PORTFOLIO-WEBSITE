import React from 'react';
import { Layers, Filter, X, Sparkles } from 'lucide-react';
import { projectsData } from '../../data/projects';
import { ProjectCard } from './ProjectCard';
import { usePortfolio } from '../../context/PortfolioContext';

export function ProjectsSection() {
  const { activeSkillFilter, clearSkillFilter } = usePortfolio();

  const filteredProjects = activeSkillFilter
    ? projectsData.filter((project) =>
        project.technologies.some(
          (t) => t.toLowerCase() === activeSkillFilter.toLowerCase()
        )
      )
    : projectsData;

  return (
    <section id="projects" className="section">
      <div className="site-container">
        <div className="section-header">
          <span className="section-label">Engineering Projects</span>
          <div className="section-title">
            <h2>Featured Applications & Systems</h2>
            <span className="text-sm mono text-muted">
              Showing {filteredProjects.length} of {projectsData.length} projects
            </span>
          </div>
          <p className="section-subtitle">
            Interactive software projects across full-stack web development, audio signal analysis, and deep learning. Select any project to inspect its architecture pipeline.
          </p>
        </div>

        {/* Filter State Banner */}
        {activeSkillFilter && (
          <div className="projects-filter-status">
            <div className="filter-status-text">
              <Filter size={14} className="text-accent" />
              <span>
                Filtering projects using: <strong>{activeSkillFilter}</strong>
              </span>
            </div>
            <button
              onClick={clearSkillFilter}
              className="btn btn-secondary btn-sm"
            >
              <X size={13} /> Reset Filter
            </button>
          </div>
        )}

        {/* Project Grid */}
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
