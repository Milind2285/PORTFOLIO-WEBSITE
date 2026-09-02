import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, Users, Award } from 'lucide-react';

export function TimelineItem({ item, isLast }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={`timeline-item ${isLast ? 'is-last' : ''}`}>
      <div className="timeline-spine">
        <div className="timeline-node"></div>
        {!isLast && <div className="timeline-line"></div>}
      </div>

      <div className="timeline-content card-surface">
        <div className="timeline-header">
          <div className="timeline-title-block">
            <span className="timeline-badge mono text-xs">{item.badge}</span>
            <h3 className="timeline-role">{item.role}</h3>
            <span className="timeline-org">{item.organization}</span>
          </div>

          <div className="timeline-period mono text-xs">
            <Calendar size={13} />
            <span>{item.period}</span>
          </div>
        </div>

        <p className="timeline-summary">{item.summary}</p>

        {/* Expandable highlights */}
        {isExpanded && (
          <div className="timeline-details">
            <ul className="timeline-bullets">
              {item.highlights.map((highlight, idx) => (
                <li key={idx} className="timeline-bullet-item">
                  <span className="timeline-bullet-dot"></span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            {item.technologies && (
              <div className="timeline-tags">
                {item.technologies.map((tech) => (
                  <span key={tech} className="tag-badge text-xs">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="timeline-toggle-btn text-xs mono"
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <>
              <span>Collapse details</span>
              <ChevronUp size={14} />
            </>
          ) : (
            <>
              <span>Expand details</span>
              <ChevronDown size={14} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
