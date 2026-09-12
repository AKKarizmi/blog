import {
  FacebookIcon,
  GlobeIcon,
  HeartIcon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon,
  MessageCircleIcon,
  PhoneIcon,
  TwitterIcon,
  YoutubeIcon } from
'lucide-react';
import type { ComponentType } from 'react';
import { useForozData } from '../context/ForozDataContext';
import { GhostFibers } from './effects/GhostFibers';
import { Strands } from './effects/Strands';

const socialIcons: Record<string, ComponentType<{className?: string;}>> = {
  linkedin: LinkedinIcon,
  twitter: TwitterIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  whatsapp: MessageCircleIcon,
  youtube: YoutubeIcon
};

export function Footer() {
  const { footer, blogPage } = useForozData();

  const socials = Object.entries(blogPage.socialLinks || {}).filter(([, url]) =>
  Boolean(url)
  );

  const columns = [
  { title: 'Quick Links', links: footer.quickLinks },
  { title: 'Resources', links: footer.resourceLinks },
  { title: 'Legal', links: footer.legalLinks }];


  const email = blogPage.contactEmail || '';
  const phone = blogPage.contactPhone || '';

  return (
    <footer className="relative isolate overflow-hidden bg-navy-950 text-slate-300">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_15%_0%,#101A3C_0%,#080D1C_55%,#060A16_100%)]" />
      
      <GhostFibers tone="light" count={9} opacity={0.3} className="-z-10" />
      <Strands tone="light" count={3} opacity={0.22} className="-z-10" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <img
              src="https://media.foroz.me/White%20Logo.svg"
              alt={blogPage.siteName}
              className="h-10 w-auto"
              loading="lazy" />
            
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-slate-400">
              {blogPage.footerDescription || footer.description}
            </p>

            {socials.length > 0 &&
            <ul className="mt-7 flex flex-wrap gap-2">
                {socials.map(([platform, url]) => {
                const Icon = socialIcons[platform] || GlobeIcon;

                return (
                  <li key={`footer-${platform}`}>
                      <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={platform}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:text-white">
                      
                        <Icon className="h-4 w-4" />
                      </a>
                    </li>);

              })}
              </ul>
            }
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((column) =>
            <nav key={column.title} aria-label={column.title}>
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                  {column.title}
                </h2>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) =>
                <li key={`${column.title}-${link.label}`}>
                      <a
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white">
                    
                        {link.label}
                      </a>
                    </li>
                )}
                </ul>
              </nav>
            )}

            <div>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                Contact
              </h2>
              <ul className="mt-5 space-y-3">
                {email &&
                <li>
                    <a
                    href={`mailto:${email}`}
                    className="inline-flex items-start gap-2 text-sm text-slate-400 transition-colors hover:text-white">
                    
                      <MailIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span className="break-all">{email}</span>
                    </a>
                  </li>
                }
                {phone &&
                <li>
                    <a
                    href={`tel:${phone}`}
                    className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white">
                    
                      <PhoneIcon className="h-3.5 w-3.5 shrink-0" />
                      {phone}
                    </a>
                  </li>
                }
                <li>
                  <a
                    href="#contact"
                    className="text-sm text-slate-400 transition-colors hover:text-white">
                    
                    Get in touch
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-500">
            © {blogPage.copyrightText || footer.copyright}
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs text-slate-500">
            <HeartIcon className="h-3.5 w-3.5 text-foroz-purple" />
            {footer.madeWith}
          </p>
        </div>
      </div>
    </footer>);

}