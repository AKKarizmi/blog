import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { MissionVisionSection } from './components/MissionVisionSection';
import { CoreValuesSection } from './components/CoreValuesSection';
import { ServicesSection } from './components/ServicesSection';
import { EventsSection } from './components/EventsSection';
import { AnnouncementSection } from './components/AnnoucementSection';
import { BoardMembersSection } from './components/BoardMembersSection';
import { CTASection } from './components/CTASection';
import { CollaborationSection } from './components/CollaborationSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  return (
    <Router>
      <AuthProvider>
        <MainRoutes />
      </AuthProvider>
    </Router>
  );
}

const MainRoutes = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = ['/login', '/signup'].includes(location.pathname);

  // Render auth/admin routes separately without navbar/footer
  if (isAdminRoute || isAuthRoute) {
    return <AppRoutes />;
  }

  // Public homepage with scrolling sections - shows navbar and footer
  return (
    <>
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-blue-200 selection:text-blue-900">
        <Navbar />

        <main className="flex-grow">
          <HeroSection />
          <AboutSection />
          <MissionVisionSection />
          <CoreValuesSection />
          <ServicesSection />
          {/* <ImpactSection /> */}
          <AnnouncementSection />
          <EventsSection />
          <CollaborationSection />
          <BoardMembersSection />
          <CTASection />
          <ContactSection />
        </main>

        <Footer />
      </div>
      
      {/* AppRoutes for handling any remaining route logic */}
      <AppRoutes />
    </>
  );
};
