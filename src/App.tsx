import { AdmissionForm, CredentialVerifier } from './features/EducationPublic';
import { Routes, Route, useLocation, useNavigationType, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { ProgramsPage, CoursePage } from './pages/ProgramsPage';
import { AppLink } from './components/ui/AppLink';
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

function Homepage() {
  return (
    <div className="min-h-screen w-full bg-white font-body text-slate-900">
      <AppLink
        href="/#home"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-foroz-ink focus:shadow-soft">
        
        Skip to content
      </AppLink>



      <main tabIndex={-1}>
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


    </div>);

}

function NavigationScroll() {
  const { pathname, hash, key } = useLocation();
  const navigation = useNavigationType();
  const positions = useRef(new Map<string, number>());
  useEffect(() => {
    const previous = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    return () => { history.scrollRestoration = previous; };
  }, []);
  useEffect(() => {
    let observer: MutationObserver | undefined;
    const frame = requestAnimationFrame(() => {
      if (navigation === 'POP' && positions.current.has(key)) {
        window.scrollTo({ top: positions.current.get(key), behavior: 'instant' as ScrollBehavior });
      } else if (hash) {
        let id = hash.slice(1);
        try { id = decodeURIComponent(id); } catch { /* Use literal malformed hash. */ }
        const scrollToAnchor = () => {
          const target = document.getElementById(id);
          if (!target) return;
          target.scrollIntoView({ behavior: 'auto' });
          observer?.disconnect();
        };
        if (!document.getElementById(id)) {
          observer = new MutationObserver(scrollToAnchor);
          observer.observe(document.body, { childList: true, subtree: true });
        }
        scrollToAnchor();
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        document.querySelector<HTMLElement>('main')?.focus({ preventScroll: true });
      }
    });
    const saved = positions.current;
    return () => { cancelAnimationFrame(frame); observer?.disconnect(); saved.set(key, window.scrollY); };
  }, [pathname, hash, key, navigation]);
  return null;
}

function AdmissionPage(){const value=Number(new URLSearchParams(useLocation().search).get('class'));return <main className="px-4 pb-16 pt-32"><AdmissionForm initialClass={value||undefined}/></main>;}
function VerifyPage(){const {code}=useParams();const navigate=useNavigate();return <main className="px-4 pb-16 pt-32"><CredentialVerifier code={code} onVerify={value=>navigate('/verify-credential/'+encodeURIComponent(value))}/></main>;}
export function App() {
  return <><NavigationScroll /><Navbar /><Routes>
    <Route path="/" element={<Homepage />} />
    <Route path="/apply" element={<AdmissionPage/>}/><Route path="/verify-credential" element={<VerifyPage/>}/><Route path="/verify-credential/:code" element={<VerifyPage/>}/>
    <Route path="/programs" element={<ProgramsPage />} />
    <Route path="/courses/:id" element={<CoursePage />} />
    <Route path="/events" element={<main tabIndex={-1} className="pt-28"><h1 className="mx-auto max-w-7xl px-6 text-3xl font-bold">Events & Workshops</h1><EventsSection /></main>} />
    <Route path="*" element={<main tabIndex={-1} className="mx-auto max-w-7xl px-6 py-32"><h1 className="text-3xl font-bold">Page not found</h1><AppLink href="/">Return home</AppLink></main>} />
  </Routes><Footer /></>;
}
