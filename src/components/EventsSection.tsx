import { motion } from 'framer-motion';
import { CalendarIcon, MapPinIcon, ArrowRightIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchJson, extractArray, resolveAssetUrl } from '../services/api';
import type { SyntheticEvent } from 'react';

interface EventData {
  id: string | number;
  title: string;
  short_description: string;
  description: string;
  image: string;
  date: string;
  link?: string;
  registration_link?: string;
}

const formatEventDate = (isoDate: string): string => {
  if (!isoDate) {
    return 'Date TBD';
  }

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export function EventsSection() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedItem, setSelectedItem] = useState<EventData | null>(null);
  const hasEvents = events.length > 0;

  useEffect(() => {
    fetchJson<unknown>('/events/')
      .then((payload) => {
        const items = extractArray<any>(payload);
        const mapped = items.map((item, index) => ({
          id: item.id || index,
          title: item.title || 'Upcoming Event',
          short_description: item.short_description || item.summary || '',
          description: item.description || '',
          image: resolveAssetUrl(item.image),
          date: item.date || item.publishDate || '',
          link: item.registration_link || item.link || undefined,
          registration_link: item.registration_link || item.link || undefined,
        }));
        setEvents(mapped);
      })
      .catch((err) => console.error('Failed to fetch events:', err));
  }, []);

  const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = '/static/fallback.webp';
  };

  const handleRegister = (link?: string) => {
    const url = link || '/events';
    if (url.startsWith('http')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = url;
    }
  };

  return (
    <section id="events" className="py-24 bg-foroz-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Upcoming <span className="text-gradient">Events</span>
          </h2>
          <p className="font-body text-lg text-slate-600">
            Join our workshops, training sessions, and webinars to accelerate
            your growth.
          </p>
        </div>

        {!hasEvents ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No upcoming events at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {events.map((event, index) => (
              <motion.article
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-soft transition-all duration-300 group flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image || '/static/fallback.webp'}
                    alt={event.title}
                    onError={handleImageError}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                    <CalendarIcon size={14} className="text-foroz-blue" />
                    <span className="text-xs font-bold text-slate-900">
                      {formatEventDate(event.date)}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  {event.short_description && (
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
                      <MapPinIcon size={16} />
                      <span>{event.short_description}</span>
                    </div>
                  )}
                  <h3 className="font-heading text-xl font-bold text-slate-900 mb-3 group-hover:text-foroz-blue transition-colors">
                    {event.title}
                  </h3>
                  
                  {/* Limited Height Description with bottom fade effect */}
                  <div className="relative mb-6">
                    <div className={(event.description || '').length > 120 ? 'max-h-24 overflow-hidden' : ''}>
                      <p className="font-body text-slate-600 text-sm leading-relaxed">
                        {event.description}
                      </p>
                      {(event.description || '').length > 120 && (
                        <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white to-white/0 pointer-events-none" />
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedItem(event)}
                    className="text-foroz-blue font-medium text-sm flex items-center gap-2 hover:gap-3 transition-all mt-auto self-start">
                    View Details <ArrowRightIcon size={16} />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => handleRegister()}
            className="bg-white text-slate-700 border border-slate-200 px-8 py-3.5 rounded-full font-body text-base font-medium hover:border-foroz-blue hover:text-foroz-blue transition-all duration-300 inline-flex items-center gap-2">
            View All Events
          </button>
        </div>
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
                    <span className="font-semibold text-slate-700">{formatEventDate(selectedItem.date)}</span>
                  </div>
                )}
                {selectedItem.short_description && (
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full">
                    <MapPinIcon size={14} className="text-foroz-blue" />
                    <span className="font-medium text-slate-700">{selectedItem.short_description}</span>
                  </div>
                )}
              </div>
              
              <p className="font-body text-slate-600 leading-relaxed text-base whitespace-pre-line">
                {selectedItem.description}
              </p>
            </div>
            
            {/* Modal Footer */}
            {selectedItem.registration_link && (
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                <button
                  onClick={() => handleRegister(selectedItem.registration_link)}
                  className="bg-foroz-blue hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-colors flex items-center gap-2"
                >
                  Register Now <ArrowRightIcon size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

