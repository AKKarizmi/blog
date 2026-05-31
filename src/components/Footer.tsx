import {
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  Globe,
  type LucideIcon,
} from 'lucide-react';
import { useForozData } from '../context/ForozDataContext';

const socialIcons: Record<string, LucideIcon> = {
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  facebook: Facebook,
  whatsapp: MessageCircle,
  youtube: Youtube,
  website: Globe,
};

const socialHoverClasses: Record<string, string> = {
  linkedin: 'hover:bg-blue-600',
  twitter: 'hover:bg-blue-400',
  instagram: 'hover:bg-pink-600',
  facebook: 'hover:bg-blue-700',
  whatsapp: 'hover:bg-green-600',
  youtube: 'hover:bg-red-600',
  website: 'hover:bg-slate-600',
};

export function Footer() {
  const { footer } = useForozData();

  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="lg:col-span-1">
            <a href="#home" className="flex items-center gap-2 mb-6">
              <img src="/static/Logos/Footer-Logo.svg" alt="FOROZ Logo" width={100} />
            </a>
            <p className="text-sm leading-relaxed mb-6">{footer.description}</p>
            <div className="flex gap-4 flex-wrap">
              {Object.entries(footer.socialLinks).map(([platform, url]) => {
                const Icon = socialIcons[platform.toLowerCase()] || Globe;
                const hoverClass =
                  socialHoverClasses[platform.toLowerCase()] || 'hover:bg-slate-600';

                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center ${hoverClass} hover:text-white transition-colors`}
                    aria-label={platform}>
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          <FooterLinkColumn title="Quick Links" links={footer.quickLinks} />
          <FooterLinkColumn title="Resources" links={footer.resourceLinks} />
          <FooterLinkColumn title="Legal" links={footer.legalLinks} />
        </div>

        <div className="pt-8 border-t border-slate-800 text-sm text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {footer.copyright}</p>
          <p>{footer.madeWith}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div>
      <h4 className="text-white font-semibold mb-6">{title}</h4>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <a href={link.href} className="hover:text-blue-400 transition-colors">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
