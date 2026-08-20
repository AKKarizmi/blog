import { motion } from 'framer-motion';
import { CalendarIcon, ArrowRightIcon } from 'lucide-react';
import { useState } from 'react';
import { useForozData } from '../context/ForozDataContext';
import type { AnnouncementData } from '../context/ForozDataContext';
import type { SyntheticEvent } from 'react';

export function AnnouncementSection() {
  const { announcements } = useForozData();
  const [selectedItem, setSelectedItem] = useState<AnnouncementData | null>(null);
  const hasAnnouncements = announcements.length > 0;

  const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = '/static/fallback.webp';
  };

  const handleLearnMore = (link?: string) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section id="announcements" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Our <span className="text-gradient">Announcements</span>
          </h2>
        </div>

        {!hasAnnouncements ? (
          <div className="text-center py-12">
            <p className="text-slate-500">
              No Announcements at the moment. Please check back later for updates on our latest announcements!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {announcements.map((announcement, index) => (
              <motion.article
                key={announcement.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-soft transition-all duration-300 group flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={announcement.image || '/static/fallback.webp'}
                    alt={announcement.title}
                    onError={handleImageError}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {announcement.date && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                      <CalendarIcon size={14} className="text-foroz-blue" />
                      <span className="text-xs font-bold text-slate-900">
                        {announcement.date}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  {announcement.short_description && (
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
                      <span>{announcement.short_description}</span>
                    </div>
                  )}
                  <h3 className="font-heading text-xl font-bold text-slate-900 mb-3 group-hover:text-foroz-blue transition-colors">
                    {announcement.title}
                  </h3>
                  
                  {/* Limited Height Description with bottom fade effect */}
                  <div className="relative mb-6">
                    <div className={(announcement.description || '').length > 120 ? 'max-h-24 overflow-hidden' : ''}>
                      <p className="font-body text-slate-600 text-sm leading-relaxed">
                        {announcement.description}
                      </p>
                      {(announcement.description || '').length > 120 && (
                        <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white to-white/0 pointer-events-none" />
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedItem(announcement)}
                    className="text-foroz-blue font-medium text-sm flex items-center gap-2 hover:gap-3 transition-all mt-auto self-start">
                    Read More <ArrowRightIcon size={16} />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-100 animate-scale-up">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-heading text-2xl font-bold text-slate-900 leading-tight">
                {selectedItem.title}
              </h3>
              <button 
                onClick={() => setSelectedItem(null)}
                className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors flex items-center justify-center font-bold text-lg"
              >
                ✕
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {selectedItem.image && (
                <div className="relative h-64 rounded-2xl overflow-hidden">
                  <img 
                    src={selectedItem.image} 
                    alt={selectedItem.title}
                    onError={handleImageError}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                {selectedItem.date && (
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full">
                    <CalendarIcon size={14} className="text-foroz-blue" />
                    <span className="font-semibold text-slate-700">{selectedItem.date}</span>
                  </div>
                )}
                {selectedItem.short_description && (
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full">
                    <span className="font-medium text-slate-700">{selectedItem.short_description}</span>
                  </div>
                )}
              </div>
              
              <p className="font-body text-slate-600 leading-relaxed text-base whitespace-pre-line">
                {selectedItem.description}
              </p>
            </div>
            
            {/* Modal Footer */}
            {selectedItem.link && (
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                <button
                  onClick={() => handleLearnMore(selectedItem.link)}
                  className="bg-foroz-blue hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-colors flex items-center gap-2"
                >
                  Learn More <ArrowRightIcon size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

