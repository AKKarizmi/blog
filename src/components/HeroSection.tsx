import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRightIcon,
  GlobeIcon,
  GraduationCapIcon,
  SparklesIcon,
  TrendingUpIcon } from
'lucide-react';
import { useForozData } from '../context/ForozDataContext';
import { SpecularButton } from './ui/SpecularButton';
import { handleImageError } from '../utils/imageFallback';
import { highlightWords } from '../utils/highlight';

export function HeroSection() {
  const { hero, blogPage, impact, services } = useForozData();
  const reduceMotion = useReducedMotion();

  const heroImage = blogPage.heroImage;
  const metrics = impact.slice(0, 2);

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-white hero-space">
      
      
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-8">
        {/* Left: message */}
        <div className="relative z-10">
          <motion.span
            initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-foroz-blue shadow-soft backdrop-blur">
            
            <SparklesIcon className="h-3.5 w-3.5" />
            {hero.badge}
          </motion.span>

          <motion.h1
            initial={reduceMotion ? undefined : { opacity: 0, y: 22 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 font-heading hero-title text-foroz-ink">
            
            {highlightWords(blogPage.heroTitle)}
          </motion.h1>

          <motion.p
            initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-slate-600">
            
            {blogPage.heroSubtitle}
          </motion.p>

          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            
            <SpecularButton href={blogPage.heroCtaLink || '#services'}>
              {blogPage.heroCtaText || 'Explore Opportunities'}
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </SpecularButton>
            <SpecularButton
              href={hero.secondaryActionHref || '#about'}
              variant="secondary">
              
              {hero.secondaryActionLabel || 'Learn About FOROZ'}
            </SpecularButton>
          </motion.div>

          {/* Quiet proof row, driven by the same impact data as the rest of the site */}
          <motion.dl
            initial={reduceMotion ? undefined : { opacity: 0 }}
            animate={reduceMotion ? undefined : { opacity: 1 }}
            transition={{ duration: 1, delay: 0.42 }}
            className="mt-12 grid max-w-lg grid-cols-2 gap-x-8 gap-y-6 border-t border-slate-200/80 pt-8 sm:grid-cols-3">
            
            {impact.slice(0, 3).map((item) =>
            <div key={item.id}>
                <dt className="sr-only">{item.label}</dt>
                <dd className="font-heading text-2xl font-semibold tracking-tight text-foroz-ink sm:text-3xl">
                  {item.end.toLocaleString()}
                  {item.suffix}
                </dd>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-slate-600">
                  {item.label}
                </p>
              </div>
            )}
          </motion.dl>
        </div>

        {/* Right: layered editorial composition */}
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, scale: 0.96, y: 24 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto w-full max-w-xl lg:max-w-none">
          

          <div className="gradient-border relative overflow-hidden rounded-2xl bg-navy-900 shadow-soft">
            {heroImage ?
            <div className="relative aspect-[4/5] w-full sm:aspect-[5/4]">
                <img
                src={heroImage}
                alt={`${blogPage.siteName} programs in action`}
                onError={handleImageError}
                loading="eager"
                className="h-full w-full object-cover" />
              
                <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/25 to-transparent" />
              
              </div> :

            <div className="relative min-h-[26rem] w-full">
                <div className="relative flex min-h-[26rem] flex-col justify-between gap-8 p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-slate-200 backdrop-blur">
                      <GlobeIcon className="h-3.5 w-3.5 text-foroz-light" />
                      Global Youth Network
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
                      {blogPage.siteName}
                    </span>
                  </div>

                  <div>
                    <p className="font-heading text-3xl font-semibold leading-tight text-white sm:text-4xl">
                      Education
                      <span className="mx-2 text-foroz-light">→</span>
                      Skills
                      <span className="mx-2 text-foroz-light">→</span>
                      <span className="text-gradient-light">Opportunity</span>
                    </p>
                    <p className="mt-4 max-w-sm text-base leading-relaxed text-slate-300/90">
                      A connected pathway of learning, mentorship and real-world
                      experience for students everywhere.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
                      <GraduationCapIcon className="h-5 w-5 text-foroz-light" />
                      <p className="mt-3 font-heading text-xl font-bold text-white">
                        {services.length}
                      </p>
                      <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-400">
                        Program tracks
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
                      <TrendingUpIcon className="h-5 w-5 text-foroz-light" />
                      <p className="mt-3 font-heading text-xl font-bold text-white">
                        {metrics[0] ? `${metrics[0].end.toLocaleString()}${metrics[0].suffix}` : '—'}
                      </p>
                      <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-400">
                        {metrics[0]?.label || 'Community'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>

          {/* Floating metadata cards */}
          <motion.div
            className="absolute -left-3 bottom-10 hidden w-52 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-soft backdrop-blur-xl sm:block">
            
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-foroz-mist text-foroz-blue">
                <GraduationCapIcon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600">
                  {metrics[1]?.label || 'Programs'}
                </p>
                <p className="font-heading text-lg font-bold text-foroz-ink">
                  {metrics[1] ?
                  `${metrics[1].end.toLocaleString()}${metrics[1].suffix}` :
                  `${services.length}`}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute -right-2 top-8 hidden rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-soft backdrop-blur-xl md:block">
            
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600">
              Established
            </p>
            <p className="font-heading text-base font-bold text-foroz-ink">2025</p>
          </motion.div>

        </motion.div>
      </div>

    </section>);

}