import { motion } from 'framer-motion';
import {
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Globe,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useForozData } from '../context/ForozDataContext';
import type { BoardMemberData } from '../context/ForozDataContext';
import { FALLBACK_IMAGE, handleImageError } from '../utils/imageFallback';

const platformIcons: Record<string, LucideIcon> = {
  linkedin: Linkedin,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  website: Globe,
};

export function BoardMembersSection() {
  const { boardMembers } = useForozData();
  const [selectedItem, setSelectedItem] = useState<BoardMemberData | null>(null);
  const hasMembers = boardMembers.length > 0;

  return (
    <section id="team" className="py-24 bg-foroz-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Our <span className="text-gradient">Team</span>
          </h2>
          <p className="font-body text-lg text-slate-600">
            Meet the dedicated experts and board members driving our mission
            forward.
          </p>
        </div>

        {!hasMembers ? (
          <div className="text-center py-12">
            <p className="text-slate-500">Team members coming soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {boardMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-soft transition-all duration-300 group flex flex-col items-center text-center">
                <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={member.image || FALLBACK_IMAGE}
                    alt={member.title}
                    onError={handleImageError}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-foroz-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <h3 className="font-heading text-xl font-bold text-slate-900 mb-1">
                  {member.title}
                </h3>
                {member.role && (
                  <p className="font-body text-sm font-medium text-foroz-blue mb-4">
                    {member.role}
                  </p>
                )}
                
                {/* Limited Height Bio with bottom fade effect */}
                {member.short_description && (
                  <div className="relative mb-4 w-full">
                    <div className={(member.short_description || '').length > 100 ? 'max-h-20 overflow-hidden' : ''}>
                      <p className="font-body text-sm text-slate-600">
                        {member.short_description}
                      </p>
                      {(member.short_description || '').length > 100 && (
                        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-white/0 pointer-events-none" />
                      )}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setSelectedItem(member)}
                  className="text-foroz-blue font-medium text-xs hover:underline transition-all block mb-6 self-center">
                  View Full Bio
                </button>

                <div className="flex items-center justify-center gap-3 mt-auto">
                  {Object.entries(member.socials).map(([platform, url]) => {
                    const Icon = platformIcons[platform.toLowerCase()];
                    if (!Icon) {
                      return null;
                    }

                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-foroz-blue hover:text-white transition-colors"
                        aria-label={`${platform} profile`}>
                        <Icon size={16} />
                      </a>
                    );
                  })}

                  {Object.keys(member.socials).length === 0 && (
                    <span className="text-slate-300 text-xs">No links</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Profile Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col border border-slate-100 animate-scale-up">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src={selectedItem.image || FALLBACK_IMAGE}
                    alt={selectedItem.title}
                    onError={handleImageError}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-bold text-slate-900 leading-tight">
                    {selectedItem.title}
                  </h3>
                  <p className="font-body text-sm font-semibold text-foroz-blue">
                    {selectedItem.role}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors flex items-center justify-center font-bold text-lg"
              >
                ✕
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <p className="font-body text-slate-600 leading-relaxed text-base whitespace-pre-line">
                {selectedItem.short_description}
              </p>
            </div>
            
            {/* Modal Footer (Social Links) */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-center gap-3">
              {Object.entries(selectedItem.socials).map(([platform, url]) => {
                const Icon = platformIcons[platform.toLowerCase()];
                if (!Icon) {
                  return null;
                }

                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-foroz-blue hover:text-white transition-colors"
                    aria-label={`${platform} profile`}>
                    <Icon size={18} />
                  </a>
                );
              })}
              {Object.keys(selectedItem.socials).length === 0 && (
                <span className="text-slate-400 text-sm">No social profiles linked</span>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

