import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRightIcon, MenuIcon, XIcon } from 'lucide-react';
import { useForozData } from '../context/ForozDataContext';
import { SpecularButton } from './ui/SpecularButton';

const navLinks = [
{ label: 'About', href: '#about' },
{ label: 'Programs', href: '#services' },
{ label: 'Opportunities', href: '#announcements' },
{ label: 'Events', href: '#events' },
{ label: 'Collaborations', href: '#collaborations' },
{ label: 'Team', href: '#team' },
{ label: 'Contact', href: '#contact' }];


export function Navbar() {
  const { blogPage } = useForozData();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const logo = blogPage.logo || 'https://media.foroz.me/Logo-H.svg';

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <motion.nav
        aria-label="Primary"
        initial={false}
        animate={{
          backgroundColor: scrolled ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.5)',
          boxShadow: scrolled ?
          '0 18px 48px -28px rgba(8,13,28,0.35)' :
          '0 0 0 rgba(0,0,0,0)',
          borderColor: scrolled ? 'rgba(226,232,240,0.9)' : 'rgba(255,255,255,0.5)'
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl border px-4 py-2.5 backdrop-blur-xl sm:px-5">
        
        <a
          href="#home"
          className="flex shrink-0 items-center gap-2"
          aria-label={`${blogPage.siteName} — home`}>
          
          <img
            src={logo}
            alt={blogPage.siteName}
            className="h-8 w-auto sm:h-9"
            loading="eager" />
          
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) =>
          <li key={link.href}>
              <a
              href={link.href}
              className="group relative rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-foroz-ink">
              
                <span className="relative">
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-foroz-blue to-foroz-violet transition-all duration-300 group-hover:w-full" />
                </span>
              </a>
            </li>
          )}
        </ul>

        <div className="flex items-center gap-2">
          <SpecularButton
            href="https://dashboard.foroz.me/"
            size="md"
            className="hidden sm:inline-flex">
            
            Login
            <ArrowUpRightIcon className="h-4 w-4" />
          </SpecularButton>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/80 text-slate-700 transition-colors hover:bg-white lg:hidden">
            
            {mobileOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen &&
        <motion.div
          id="mobile-navigation"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-soft backdrop-blur-xl lg:hidden">
          
            <ul className="flex flex-col">
              {navLinks.map((link) =>
            <li key={`mobile-${link.href}`}>
                  <a
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-foroz-mist hover:text-foroz-ink">
                
                    {link.label}
                    <ArrowUpRightIcon className="h-4 w-4 text-slate-400" />
                  </a>
                </li>
            )}
            </ul>

            <div className="mt-3 grid grid-cols-1 gap-2 border-t border-slate-100 pt-3">
              <SpecularButton
              href="#contact"
              variant="secondary"
              onClick={() => setMobileOpen(false)}>
              
                Join Us
              </SpecularButton>
              <SpecularButton href="https://dashboard.foroz.me/">
                Login
                <ArrowUpRightIcon className="h-4 w-4" />
              </SpecularButton>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </header>);

}