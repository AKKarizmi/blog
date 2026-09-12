import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRightIcon, Building2Icon, LinkIcon } from 'lucide-react';
import { useForozData } from '../context/ForozDataContext';
import type { CollaborationData } from '../context/ForozDataContext';
import { GhostFibers } from './effects/GhostFibers';
import { Strands } from './effects/Strands';
import { Modal } from './ui/Modal';
import { Reveal } from './ui/Reveal';
import { SectionHeading } from './ui/SectionHeading';
import { SpecularButton } from './ui/SpecularButton';
import { handleImageError } from '../utils/imageFallback';
import { formatDate, truncate } from '../utils/format';

export function CollaborationSection() {
  const { collaborations, loading } = useForozData();
  const [active, setActive] = useState<CollaborationData | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="collaborations"
      className="relative overflow-hidden border-y border-slate-100 bg-white py-24 sm:py-28">
      
      {/* Network motif tying the partner grid together */}
      <Strands tone="dark" count={4} opacity={0.2} />
      <GhostFibers tone="dark" count={8} opacity={0.3} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Collaborations"
          title={
          <>
              Built together with institutions that believe in{' '}
              <span className="text-gradient">youth</span>
            </>
          }
          description="Universities, companies and community organizations partnering with FOROZ to widen access to learning and opportunity." />
        

        <div className="mt-16">
          {loading && collaborations.length === 0 ?
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) =>
            <div
              key={`collab-skeleton-${index}`}
              className="h-72 animate-pulse rounded-3xl border border-slate-200/70 bg-foroz-bg" />

            )}
            </div> :
          collaborations.length === 0 ?
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-slate-600">
              No collaborations are available right now.
            </div> :

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {collaborations.map((collaboration, index) =>
            <Reveal key={collaboration.id} delay={index * 0.07} y={24}>
                  <motion.article
                whileHover={reduceMotion ? undefined : { y: -8 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white transition-shadow duration-500 hover:shadow-lift">
                
                    <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foroz-blue/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                

                    {/* Logo plate — kept generous so partner marks stay legible */}
                    <div className="flex h-40 items-center justify-center border-b border-slate-100 bg-foroz-bg p-8">
                      {collaboration.image ?
                  <img
                    src={collaboration.image}
                    alt={`${collaboration.title} logo`}
                    onError={handleImageError}
                    loading="lazy"
                    className="max-h-20 w-auto max-w-[70%] object-contain transition-transform duration-500 group-hover:scale-[1.06]" /> :


                  <Building2Icon className="h-10 w-10 text-foroz-blue/60" />
                  }
                    </div>

                    <div className="flex flex-1 flex-col p-7">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="font-heading text-lg font-bold tracking-tight text-foroz-ink">
                          {collaboration.title}
                        </h3>
                        {collaboration.date &&
                    <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                            {formatDate(collaboration.date, 'yyyy')}
                          </span>
                    }
                      </div>

                      {collaboration.short_description &&
                  <p className="mt-2 text-sm font-medium text-foroz-indigo">
                          {collaboration.short_description}
                        </p>
                  }

                      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                        {truncate(collaboration.description, 140)}
                      </p>

                      <button
                    type="button"
                    onClick={() => setActive(collaboration)}
                    className="mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-foroz-blue transition-colors hover:text-foroz-violet">
                    
                        Read More
                        <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </button>
                    </div>
                  </motion.article>
                </Reveal>
            )}
            </div>
          }
        </div>
      </div>

      <Modal
        open={Boolean(active)}
        onClose={() => setActive(null)}
        eyebrow={active?.short_description || 'Collaboration'}
        title={active?.title || ''}
        footer={
        <SpecularButton
          href={active?.link || '#contact'}
          size="md"
          target={active?.link ? '_blank' : undefined}
          rel={active?.link ? 'noreferrer' : undefined}>
          
            Learn More
            <LinkIcon className="h-4 w-4" />
          </SpecularButton>
        }>
        
        {active?.image &&
        <div className="mb-6 flex items-center justify-center rounded-2xl bg-foroz-bg p-8">
            <img
            src={active.image}
            alt={`${active.title} logo`}
            onError={handleImageError}
            className="max-h-28 w-auto object-contain" />
          
          </div>
        }
        {active?.date &&
        <p className="mb-4 text-sm font-semibold text-slate-500">
            {formatDate(active.date)}
          </p>
        }
        <p className="whitespace-pre-line text-base leading-relaxed text-slate-600">
          {active?.description}
        </p>
      </Modal>
    </section>);

}