import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowUpRightIcon,
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  MapPinIcon } from
'lucide-react';
import { useForozData } from '../context/ForozDataContext';
import type { EventData } from '../context/ForozDataContext';
import { Modal } from './ui/Modal';
import { Reveal } from './ui/Reveal';
import { SectionHeading } from './ui/SectionHeading';
import { SpecularButton } from './ui/SpecularButton';
import { handleImageError } from '../utils/imageFallback';
import { formatDate, formatDateParts, truncate } from '../utils/format';

export function EventsSection() {
  const { events, loading } = useForozData();
  const [active, setActive] = useState<EventData | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  const scrollBy = (direction: 1 | -1) => {
    const node = scrollerRef.current;
    if (!node) {
      return;
    }

    node.scrollBy({
      left: direction * Math.min(node.clientWidth * 0.8, 460),
      behavior: reduceMotion ? 'auto' : 'smooth'
    });
  };

  return (
    <section id="events" className="relative overflow-hidden bg-foroz-bg py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="left"
          eyebrow="Upcoming Events"
          title={
          <>
              Workshops, sessions and moments to{' '}
              <span className="text-gradient">show up</span> for
            </>
          }
          description="Join live sessions, workshops and community gatherings designed to move you from learning to doing."
          action={
          <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 lg:flex">
                <button
                type="button"
                onClick={() => scrollBy(-1)}
                aria-label="Previous events"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:text-foroz-ink">
                
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button
                type="button"
                onClick={() => scrollBy(1)}
                aria-label="Next events"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:text-foroz-ink">
                
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
              <SpecularButton href="/events" variant="secondary">
                View All Events
              </SpecularButton>
            </div>
          } />
        

        <div className="mt-16">
          {loading && events.length === 0 ?
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) =>
            <div
              key={`event-skeleton-${index}`}
              className="h-80 animate-pulse rounded-3xl border border-slate-200/70 bg-white" />

            )}
            </div> :
          events.length === 0 ?
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-slate-600">
              No upcoming events at the moment.
            </div> :

          <div
            ref={scrollerRef}
            className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
            
              {events.map((event, index) => {
              const { day, month, year } = formatDateParts(event.date);

              return (
                <Reveal
                  key={event.id}
                  delay={Math.min(index, 3) * 0.07}
                  y={24}
                  className="w-[86%] shrink-0 snap-start sm:w-[48%] lg:w-[32%]">
                  
                    <motion.article
                    whileHover={reduceMotion ? undefined : { y: -8 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white transition-shadow duration-500 hover:shadow-lift">
                    
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-foroz-mist">
                        {event.image ?
                      <img
                        src={event.image}
                        alt={event.title}
                        onError={handleImageError}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[900ms] ease-premium group-hover:scale-[1.05]" /> :


                      <div className="flex h-full w-full items-center justify-center">
                            <CalendarDaysIcon className="h-9 w-9 text-foroz-blue/60" />
                          </div>
                      }

                        {/* Distinctive date block */}
                        {day &&
                      <div className="absolute left-5 top-5 overflow-hidden rounded-2xl border border-white/20 bg-navy-900/85 px-3.5 py-2.5 text-center backdrop-blur">
                            <p className="font-heading text-xl font-extrabold leading-none text-white">
                              {day}
                            </p>
                            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-foroz-cyan">
                              {month}
                            </p>
                          </div>
                      }

                        <span className="absolute right-5 top-5 rounded-full border border-white/25 bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-foroz-indigo backdrop-blur">
                          Event
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col p-6 sm:p-7">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
                          {year &&
                        <span className="inline-flex items-center gap-1.5">
                              <CalendarDaysIcon className="h-3.5 w-3.5" />
                              {formatDate(event.date)}
                            </span>
                        }
                          {event.termination_date &&
                        <span className="inline-flex items-center gap-1.5">
                              <ClockIcon className="h-3.5 w-3.5" />
                              until {formatDate(event.termination_date)}
                            </span>
                        }
                        </div>

                        <h3 className="mt-4 font-heading text-lg font-bold leading-snug tracking-tight text-foroz-ink">
                          {event.title}
                        </h3>

                        {event.short_description &&
                      <p className="mt-2 inline-flex items-start gap-1.5 text-sm text-slate-500">
                            <MapPinIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                            {event.short_description}
                          </p>
                      }

                        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                          {truncate(event.description, 130)}
                        </p>

                        <div className="mt-7">
                          <SpecularButton
                          variant="secondary"
                          size="md"
                          onClick={() => setActive(event)}>
                          
                            View Details
                            <ArrowUpRightIcon className="h-4 w-4" />
                          </SpecularButton>
                        </div>
                      </div>
                    </motion.article>
                  </Reveal>);

            })}
            </div>
          }
        </div>
      </div>

      <Modal
        open={Boolean(active)}
        onClose={() => setActive(null)}
        eyebrow={active?.date ? formatDate(active.date) : 'Event'}
        title={active?.title || ''}
        footer={
        <SpecularButton
          href={active?.registration_link || '/events'}
          size="md"
          target={active?.registration_link ? '_blank' : undefined}
          rel={active?.registration_link ? 'noreferrer' : undefined}>
          
            Register Now
            <ArrowUpRightIcon className="h-4 w-4" />
          </SpecularButton>
        }>
        
        {active?.image &&
        <img
          src={active.image}
          alt={active.title}
          onError={handleImageError}
          className="mb-6 aspect-[16/9] w-full rounded-2xl object-cover" />

        }

        <div className="mb-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-slate-500">
          {active?.date &&
          <span className="inline-flex items-center gap-1.5">
              <CalendarDaysIcon className="h-4 w-4" />
              {formatDate(active.date)}
            </span>
          }
          {active?.termination_date &&
          <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="h-4 w-4" />
              Ends {formatDate(active.termination_date)}
            </span>
          }
          {active?.short_description &&
          <span className="inline-flex items-center gap-1.5">
              <MapPinIcon className="h-4 w-4" />
              {active.short_description}
            </span>
          }
        </div>

        <p className="whitespace-pre-line text-base leading-relaxed text-slate-600">
          {active?.description}
        </p>
      </Modal>
    </section>);

}