import React from 'react';
import { Users, Briefcase } from 'lucide-react';
import { experienceData } from '../../data/experience';
import { TimelineItem } from './TimelineItem';

export function ExperienceSection() {
  return (
    <section id="experience" className="section">
      <div className="site-container">
        <div className="section-header">
          <span className="section-label">Leadership & Involvement</span>
          <div className="section-title">
            <h2>Experience & Leadership</h2>
          </div>
          <p className="section-subtitle">
            Technical club co-founding, workshop coordination, hackathons, and conference operations.
          </p>
        </div>

        <div className="timeline-container">
          {experienceData.map((item, index) => (
            <TimelineItem
              key={item.id}
              item={item}
              isLast={index === experienceData.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
