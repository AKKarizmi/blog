import { ArrowRightIcon } from 'lucide-react';
import { useForozData } from '../context/ForozDataContext';
import { GhostFibers } from './effects/GhostFibers';
import { GradualBlur } from './effects/GradualBlur';
import { MagicRings } from './effects/MagicRings';
import { Strands } from './effects/Strands';
import { Reveal } from './ui/Reveal';
import { SpecularButton } from './ui/SpecularButton';

export function CTASection() {
  const { cta, blogPage } = useForozData();

  return (
    <section className="relative isolate overflow-hidden bg-navy-900 py-28 sm:py-36">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(75%_65%_at_50%_0%,#1A2350_0%,#0D1430_50%,#080D1C_100%)]" />
      
      <MagicRings tone="light" rings={5} className="-z-10 opacity-80" />
      <GhostFibers tone="light" count={14} opacity={0.5} className="-z-10" />
      <Strands tone="light" count={5} opacity={0.35} className="-z-10" />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -z-10 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.32),transparent_65%)] blur-2xl" />
      

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-200 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-foroz-cyan" />
            Join the community
          </span>

          <h2 className="mt-7 font-heading text-4xl font-extrabold leading-[1.04] tracking-tighter2 text-white sm:text-5xl lg:text-6xl">
            {blogPage.ctaTitle || cta.title}
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-slate-300/90">
            {blogPage.ctaSubtitle || cta.description}
          </p>

          <div className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <SpecularButton href={blogPage.ctaButtonLink || cta.primaryHref}>
              {blogPage.ctaButtonText || cta.primaryLabel}
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </SpecularButton>
            <SpecularButton href={cta.secondaryHref} variant="secondaryDark">
              {cta.secondaryLabel}
            </SpecularButton>
          </div>
        </Reveal>
      </div>

      <GradualBlur position="top" heightClassName="h-20 md:h-28" maxBlur={10} />
      <GradualBlur position="bottom" heightClassName="h-20 md:h-28" maxBlur={10} />
    </section>);

}