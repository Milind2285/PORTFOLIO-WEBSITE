import React from 'react';
import { MapPin, GraduationCap, Filter, X, Compass } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export function StatusBanner() {
  const { activeSkillFilter, clearSkillFilter, isBlueprintMode, toggleBlueprintMode } = usePortfolio();

  return (
    <div className="status-banner">
      <div className="site-container status-banner-inner">
        <div className="status-item">
          <MapPin size={13} className="status-icon" />
          <span>Dehradun, Uttarakhand, India</span>
        </div>

        <div className="status-item">
          <GraduationCap size={13} className="status-icon" />
          <span>B.Tech CSE · VIT Bhopal (2023–2027)</span>
        </div>

        <div className="status-pills-wrap">
          {isBlueprintMode && (
            <div className="blueprint-status-pill">
              <Compass size={12} />
              <span>Blueprint Mode Active</span>
              <button
                onClick={toggleBlueprintMode}
                className="clear-filter-btn"
                title="Exit blueprint mode"
                aria-label="Exit blueprint mode"
              >
                <X size={12} />
              </button>
            </div>
          )}

          {activeSkillFilter && (
            <div className="active-filter-pill">
              <Filter size={12} />
              <span>Filtering by: <strong>{activeSkillFilter}</strong></span>
              <button
                onClick={clearSkillFilter}
                className="clear-filter-btn"
                title="Clear active skill filter"
                aria-label="Clear active skill filter"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
