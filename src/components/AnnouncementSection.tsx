import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRightIcon, CalendarDaysIcon, MegaphoneIcon, UserIcon } from 'lucide-react';
import { useForozData } from '../context/ForozDataContext';
import type { AnnouncementData } from '../context/ForozDataContext';
import { Modal } from './ui/Modal';
import { Reveal } from './ui/Reveal';
import { SectionHeading } from './ui/SectionHeading';
import { SpecularButton } from './ui/SpecularButton';
import { handleImageError } from '../utils/imageFallback';
import { formatDate, truncate } from '../utils/format';

export function AnnouncementSection() {
  const { announcements, loading } = useForozData();
  const [active, setActive] = useState<AnnouncementData | null>(null);
  const reduceMotion = useReducedMotion();

  const [featured, ...rest] = announcements;
  const secondary = rest.slice(0, 4);

  return (
    <section
      id="announcements"
      className="relative overflow-hidden border-y border-slate-100 bg-white py-24 sm:py-28">
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="left"
          eyebrow="Announcements"
          title={
          <>
              Latest from the FOROZ <span className="text-gradient">newsroom</span>
            </>
          }
          description="Opportunities, openings and updates from across the organization — published as they happen." />
        

        <div className="mt-16">
          {loading && announcements.length === 0 ?
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="h-[26rem] animate-pulse rounded-3xl border border-slate-200/70 bg-foroz-bg" />
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) =>
              <div
                key={`announcement-skeleton-${index}`}
                className="h-28 animate-pulse rounded-2xl border border-slate-200/70 bg-foroz-bg" />

              )}
              </div>
            </div> :
          announcements.length === 0 ?
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-slate-600">
              No announcements are available right now.
            </div> :

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              {/* Featured announcement */}
              <Reveal y={28}>
                <motion.article
                whileHover={reduceMotion ? undefined : { y: -6 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-navy-900 shadow-[0_30px_90px_-45px_rgba(8,13,28,0.7)]">
                
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    {featured.image ?
                  <img
                    src={featured.image}
                    alt={featured.title}
                    onError={handleImageError}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-premium group-hover:scale-[1.04]" /> :


                  <div className="flex h-full w-full items-center justify-center bg-navy-800">
                        <MegaphoneIcon className="h-10 w-10 text-foroz-cyan/70" />
                      </div>
                  }
                    <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/30 to-transparent" />
                  
                    <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-navy-900/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
                      Featured
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-7 sm:p-9">
                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400">
                      {featured.date &&
                    <span className="inline-flex items-center gap-1.5">
                          <CalendarDaysIcon className="h-3.5 w-3.5" />
                          {formatDate(featured.date)}
                        </span>
                    }
                      {featured.posted_by &&
                    <span className="inline-flex items-center gap-1.5">
                          <UserIcon className="h-3.5 w-3.5" />
                          {featured.posted_by}
                        </span>
                    }
                    </div>

                    <h3 className="mt-4 font-heading text-2xl font-bold leading-snug tracking-tight text-white sm:text-3xl">
                      {featured.title}
                    </h3>
                    <p className="mt-4 flex-1 text-base leading-relaxed text-slate-300/90">
                      {truncate(featured.description || featured.short_description || '', 240)}
                    </p>

                    <div className="mt-8">
                      <SpecularButton
                      variant="secondaryDark"
                      size="md"
                      onClick={() => setActive(featured)}>
                      
                        Read More
                        <ArrowUpRightIcon className="h-4 w-4" />
                      </SpecularButton>
                    </div>
                  </div>
                </motion.article>
              </Reveal>

              {/* Secondary announcements */}
              <ul className="flex flex-col gap-4">
                {secondary.map((announcement, index) =>
              <Reveal
                key={announcement.id}
                as="li"
                delay={0.08 * index}
                y={20}
                className="h-full">
                
                    <motion.button
                  type="button"
                  onClick={() => setActive(announcement)}
                  whileHover={reduceMotion ? undefined : { x: 4 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="group flex w-full items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 text-left transition-shadow duration-300 hover:shadow-soft sm:p-5">
                  
                      <span className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-foroz-mist sm:h-24 sm:w-28">
                        {announcement.image ?
                    <img
                      src={announcement.image}
                      alt={announcement.title}
                      onError={handleImageError}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /> :


                    <span className="flex h-full w-full items-center justify-center">
                            <MegaphoneIcon className="h-5 w-5 text-foroz-blue/70" />
                          </span>
                    }
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                          {announcement.date && <span>{formatDate(announcement.date)}</span>}
                          {announcement.posted_by &&
                      <span className="text-foroz-indigo">{announcement.posted_by}</span>
                      }
                        </span>
                        <span className="mt-2 block font-heading text-base font-bold leading-snug text-foroz-ink">
                          {announcement.title}
                        </span>
                        <span className="mt-1.5 block text-sm leading-relaxed text-slate-600">
                          {truncate(
                        announcement.description || announcement.short_description || '',
                        96
                      )}
                        </span>
                        <span className="mt-2.5 inline-flex items-center gap-1.5 text-sm font-semibold text-foroz-blue">
                          Read more
                          <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </span>
                    </motion.button>
                  </Reveal>
              )}
              </ul>
            </div>
          }
        </div>
      </div>

      <Modal
        open={Boolean(active)}
        onClose={() => setActive(null)}
        eyebrow={active?.date ? formatDate(active.date) : 'Announcement'}
        title={active?.title || ''}
        footer={
        active?.link ?
        <SpecularButton href={active.link} size="md" target="_blank" rel="noreferrer">
              Open link
              <ArrowUpRightIcon className="h-4 w-4" />
            </SpecularButton> :
        undefined
        }>
        
        {active?.image &&
        <img
          src={active.image}
          alt={active.title}
          onError={handleImageError}
          className="mb-6 aspect-[16/9] w-full rounded-2xl object-cover" />

        }
        {active?.posted_by &&
        <p className="mb-4 text-sm font-semibold text-foroz-indigo">
            Posted by {active.posted_by}
          </p>
        }
        <p className="whitespace-pre-line text-base leading-relaxed text-slate-600">
          {active?.description || active?.short_description}
        </p>
      </Modal>
    </section>);

}