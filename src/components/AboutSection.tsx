import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  BookOpenIcon,
  CompassIcon,
  GlobeIcon,
  GraduationCapIcon,
  HeartIcon,
  LightbulbIcon,
  TargetIcon,
  UsersIcon } from
'lucide-react';
import type { ComponentType } from 'react';
import { useForozData } from '../context/ForozDataContext';
import { Strands } from './effects/Strands';
import { Modal } from './ui/Modal';
import { Reveal } from './ui/Reveal';
import { SpecularButton } from './ui/SpecularButton';
import { splitParagraphs } from '../utils/format';

const featureIcons: Record<string, ComponentType<{className?: string;}>> = {
  book: BookOpenIcon,
  bookopen: BookOpenIcon,
  book_open: BookOpenIcon,
  globe: GlobeIcon,
  target: TargetIcon,
  users: UsersIcon,
  graduation: GraduationCapIcon,
  compass: CompassIcon,
  lightbulb: LightbulbIcon,
  heart: HeartIcon
};

export function AboutSection() {
  const { about, blogPage } = useForozData();
  const [storyOpen, setStoryOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const summaryParagraphs =
  splitParagraphs(blogPage.aboutSectionSummarize).length > 0 ?
  splitParagraphs(blogPage.aboutSectionSummarize) :
  about.paragraphs;

  const storyParagraphs =
  splitParagraphs(blogPage.aboutSection).length > 0 ?
  splitParagraphs(blogPage.aboutSection) :
  ['About Long Description Content'];

  return (
    <section
      id="about"
      className="relative overflow-hidden border-y border-slate-100 bg-white py-24 sm:py-28">
      
      <Strands tone="dark" count={3} opacity={0.22} className="-z-0" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:gap-20 lg:px-8">
        {/* Editorial column */}
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-foroz-bg px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-foroz-indigo">
              <span className="h-1.5 w-1.5 rounded-full bg-foroz-blue" />
              {about.title}
            </span>

            <h2 className="mt-6 font-heading text-3xl font-extrabold leading-[1.08] tracking-tighter2 text-foroz-ink sm:text-4xl lg:text-[2.9rem]">
              An organization built so ambition never runs out of{' '}
              <span className="text-gradient">access</span>.
            </h2>
          </Reveal>

          <div className="mt-8 space-y-5">
            {summaryParagraphs.map((paragraph, index) =>
            <Reveal key={`about-p-${index}`} delay={0.06 * index}>
                <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                  {paragraph}
                </p>
              </Reveal>
            )}
          </div>

          <Reveal delay={0.18} className="mt-10">
            <SpecularButton variant="secondary" onClick={() => setStoryOpen(true)}>
              {about.buttonLabel}
            </SpecularButton>
          </Reveal>
        </div>

        {/* Impact / pillar cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {about.featureCards.map((card, index) => {
            const normalized = String(card.icon || '').
            toLowerCase().
            replace(/[^a-z0-9]/g, '');
            const Icon = featureIcons[normalized] || BookOpenIcon;

            return (
              <Reveal key={card.id} delay={0.08 * index} y={20}>
                <motion.div
                  whileHover={reduceMotion ? undefined : { y: -6 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative h-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 transition-shadow duration-300 hover:shadow-lift">
                  
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foroz-blue/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  
                  <span
                    aria-hidden="true"
                    className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(49,85,255,0.16),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  

                  <span
                    className={`relative inline-flex h-11 w-11 items-center justify-center rounded-xl ${card.bg} ${card.color} transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105`}>
                    
                    <Icon className="h-5 w-5" />
                  </span>

                  <h3 className="relative mt-5 font-heading text-lg font-bold tracking-tight text-foroz-ink">
                    {card.title}
                  </h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-slate-600">
                    {card.description}
                  </p>
                </motion.div>
              </Reveal>);

          })}
        </div>
      </div>

      <Modal
        open={storyOpen}
        onClose={() => setStoryOpen(false)}
        eyebrow={about.title}
        title="Our history">
        
        <div className="space-y-5">
          {storyParagraphs.map((paragraph, index) =>
          <p
            key={`story-${index}`}
            className="text-base leading-relaxed text-slate-600">
            
              {paragraph}
            </p>
          )}
        </div>
      </Modal>
    </section>);

}