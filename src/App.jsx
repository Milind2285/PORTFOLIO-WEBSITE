import React from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import { useActiveSection } from './hooks/useActiveSection';
import { useScrollReveal } from './hooks/useScrollReveal';
import { Header } from './components/layout/Header';
import { StatusBanner } from './components/layout/StatusBanner';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/hero/HeroSection';
import { ProjectsSection } from './components/projects/ProjectsSection';
import { ProjectInspector } from './components/projects/ProjectInspector';
import { SkillsSection } from './components/skills/SkillsSection';
import { ExperienceSection } from './components/experience/ExperienceSection';
import { EducationSection } from './components/education/EducationSection';
import { ContactSection } from './components/contact/ContactSection';
import { CommandPalette } from './components/command-palette/CommandPalette';
import { TelemetryModal } from './components/easter-egg/TelemetryModal';
import { PixelPet } from './components/pet/PixelPet';

function PortfolioContent() {
  useScrollReveal();
  const activeSection = useActiveSection(
    ['hero', 'projects', 'skills', 'experience', 'education', 'contact'],
    120
  );

  return (
    <div className="portfolio-app">
      <Header activeSection={activeSection} />
      <StatusBanner />
      <main id="main-content">
        <HeroSection />
        <ProjectsSection />
        <SkillsSection />
        <ExperienceSection />
        <EducationSection />
        <ContactSection />
      </main>
      <Footer />

      {/* Minimalist Pixel Pet Companion */}
      <PixelPet activeSection={activeSection} />

      {/* Global Context-Driven Interactive Overlays */}
      <ProjectInspector />
      <CommandPalette />
      <TelemetryModal />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioContent />
    </PortfolioProvider>
  );
}
