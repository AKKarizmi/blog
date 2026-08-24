import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForozData } from '../context/ForozDataContext';
const navLinks = [
  {
    name: 'Home',
    href: '#home'
  },
  {
    name: 'About',
    href: '#about'
  },
  {
    name: 'Services',
    href: '#services'
  },
  {
    name: 'Events',
    href: '#events'
  },
  {
    name: 'Board Members',
    href: '#team'
  },
  {
    name: 'Contact',
    href: '#contact'
  }];

export function Navbar() {
  const { blogPage } = useForozData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2 z-50">
            <img 
              src={blogPage.logo || 'https://foroz.me/static/Logos/Nav-Logo.svg'} 
              alt={blogPage.siteName || 'FOROZ Logo'} 
              width={100} 
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) =>
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">

                    {link.name}
                  </a>
                </li>
              )}
            </ul>
            <a
              href="https://dashboard.foroz.me/login"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">

              Login
            </a>
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden z-50 p-2 text-slate-600"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu">

            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen &&
          <motion.div
            initial={{
              opacity: 0,
              y: -20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: -20
            }}
            className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-slate-100 md:hidden">

            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) =>
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-slate-700 hover:text-blue-600 py-2 border-b border-slate-50">

                  {link.name}
                </a>
              )}
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="mt-4 text-center px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-md">

                Join Us
              </a>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </header>);

}
