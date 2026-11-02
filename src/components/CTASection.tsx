import { ArrowRightIcon } from 'lucide-react';
import { useForozData } from '../context/ForozDataContext';
import { Reveal } from './ui/Reveal';
import { SpecularButton } from './ui/SpecularButton';

export function CTASection() {
  const { cta, blogPage } = useForozData();

  return (
    <section className="relative isolate overflow-hidden bg-navy-900 section-space">
      

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-slate-200 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-foroz-light" />
            Join the community
          </span>

          <h2 className="mt-7 font-heading section-title text-white">
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

    </section>);

}