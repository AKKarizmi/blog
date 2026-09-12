import { motion, useReducedMotion } from 'framer-motion';
import { CompassIcon, EyeIcon } from 'lucide-react';
import { useForozData } from '../context/ForozDataContext';
import { GhostFibers } from './effects/GhostFibers';
import { GradualBlur } from './effects/GradualBlur';
import { Reveal } from './ui/Reveal';

export function MissionVisionSection() {
  const { missionVision, blogPage } = useForozData();
  const reduceMotion = useReducedMotion();

  const cards = [
  {
    index: '01',
    title: missionVision.visionTitle,
    body: blogPage.visionText || missionVision.visionDescription,
    Icon: EyeIcon,
    accent: 'from-foroz-cyan/70 via-foroz-blue/50 to-transparent',
    glow: 'rgba(56,189,248,0.22)'
  },
  {
    index: '02',
    title: missionVision.missionTitle,
    body: blogPage.missionText || missionVision.missionDescription,
    Icon: CompassIcon,
    accent: 'from-foroz-violet/70 via-foroz-indigo/50 to-transparent',
    glow: 'rgba(124,58,237,0.22)'
  }];


  return (
    <section className="relative isolate overflow-hidden bg-navy-900 py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(90%_70%_at_20%_0%,#131C42_0%,#0D1430_45%,#080D1C_100%)]" />
      
      <GhostFibers tone="light" count={12} opacity={0.4} className="-z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-foroz-cyan" />
            Purpose
          </span>
          <h2 className="mt-6 font-heading text-3xl font-extrabold leading-[1.08] tracking-tighter2 text-white sm:text-4xl lg:text-[2.9rem]">
            Why FOROZ exists, and where we are{' '}
            <span className="text-gradient-light">going</span>.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {cards.map((card, index) =>
          <Reveal key={card.title} delay={0.1 * index} y={30}>
              <motion.article
              whileHover={reduceMotion ? undefined : { y: -8 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="group relative h-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-8 backdrop-blur-sm sm:p-10">
              
                <span
                aria-hidden="true"
                className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${card.accent}`} />
              
                <span
                aria-hidden="true"
                className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full opacity-60 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle, ${card.glow}, transparent 70%)`
                }} />
              

                <div className="relative flex items-start justify-between gap-6">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.06] text-foroz-cyan">
                    <card.Icon className="h-5 w-5" />
                  </span>
                  <span
                  aria-hidden="true"
                  className="font-heading text-6xl font-extrabold leading-none tracking-tighter2 text-white/[0.07] sm:text-7xl">
                  
                    {card.index}
                  </span>
                </div>

                <h3 className="relative mt-8 font-heading text-2xl font-bold tracking-tight text-white sm:text-[1.7rem]">
                  {card.title}
                </h3>
                <p className="relative mt-4 text-base leading-relaxed text-slate-300/90">
                  {card.body}
                </p>

                <div
                aria-hidden="true"
                className="relative mt-8 h-px w-full bg-gradient-to-r from-white/15 via-white/5 to-transparent" />
              
              </motion.article>
            </Reveal>
          )}
        </div>
      </div>

      <GradualBlur position="bottom" heightClassName="h-16 md:h-24" maxBlur={8} />
    </section>);

}