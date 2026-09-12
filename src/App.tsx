import React from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { MissionVisionSection } from './components/MissionVisionSection';
import { CoreValuesSection } from './components/CoreValuesSection';
import { ServicesSection } from './components/ServicesSection';
import { AnnouncementSection } from './components/AnnouncementSection';
import { EventsSection } from './components/EventsSection';
import { CollaborationSection } from './components/CollaborationSection';
import { BoardMembersSection } from './components/BoardMembersSection';
import { CTASection } from './components/CTASection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

export function App() {
  return (
    <div className="min-h-screen w-full bg-white font-body text-slate-900">
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-foroz-ink focus:shadow-soft">
        
        Skip to content
      </a>

      <Navbar />

      <main>
        <HeroSection />
        <AboutSection />
        <MissionVisionSection />
        <CoreValuesSection />
        <ServicesSection />
        <AnnouncementSection />
        <EventsSection />
        <CollaborationSection />
        <BoardMembersSection />
        <CTASection />
        <ContactSection />
      </main>

      <Footer />
    </div>);

}