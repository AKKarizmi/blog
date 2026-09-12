import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  BookOpenIcon,
  BriefcaseIcon,
  CompassIcon,
  GraduationCapIcon,
  LaptopIcon,
  WrenchIcon } from
'lucide-react';
import type { ComponentType, CSSProperties } from 'react';
import { fetchJson } from '../services/api';
import { Reveal } from './ui/Reveal';
import { SectionHeading } from './ui/SectionHeading';
import { SpecularButton } from './ui/SpecularButton';

type ServiceIconProps = {
  className?: string;
  style?: CSSProperties;
};

const serviceIcons: Record<string, ComponentType<ServiceIconProps>> = {
  bookopen: BookOpenIcon,
  book_open: BookOpenIcon,
  book: BookOpenIcon,
  laptop: LaptopIcon,
  education: LaptopIcon,
  graduation: GraduationCapIcon,
  mentorship: GraduationCapIcon,
  briefcase: BriefcaseIcon,
  internship: BriefcaseIcon,
  compass: CompassIcon,
  leadership: CompassIcon,
  wrench: WrenchIcon,
  workshop: WrenchIcon
};

type ServiceCategory = {
  id: string | number;
  title: string;
  description: string;
  icon_text: string;
  color: string;
};

type CategoriesResponse = {
  categories?: ServiceCategory[];
};

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.trim().replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return undefined;
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

export function ServicesSection() {
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let isActive = true;

    const loadServices = async () => {
      setLoading(true);
      setError(null);

      try {
        const payload = await fetchJson<CategoriesResponse>('/v1/courses/categories/');
        if (!isActive) {
          return;
        }

        setServices(Array.isArray(payload?.categories) ? payload.categories : []);
      } catch (err) {
        if (!isActive) {
          return;
        }

        setServices([]);
        setError(err instanceof Error ? err.message : 'Unable to load programs.');
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadServices();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section id="services" className="relative overflow-hidden bg-foroz-bg py-24 sm:py-28">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300/70 to-transparent" />
      

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="left"
          eyebrow="Programs & Opportunities"
          title={
          <>
              What we offer, from first lesson to first{' '}
              <span className="text-gradient">opportunity</span>
            </>
          }
          description="Comprehensive programs designed to equip youth with the knowledge, skills, and opportunities needed to thrive in today's world."
          action={
          <SpecularButton href="/programs" variant="secondary">
              View All Programs
              <ArrowUpRightIcon className="h-4 w-4" />
            </SpecularButton>
          } />
        

        <div className="mt-16">
          {loading ?
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) =>
            <div
              key={`service-skeleton-${index}`}
              className="animate-pulse rounded-3xl border border-slate-200/70 bg-white p-8">
              
                  <div className="mb-6 h-14 w-14 rounded-2xl bg-slate-200/70" />
                  <div className="mb-4 h-6 w-3/4 rounded bg-slate-200/70" />
                  <div className="space-y-3">
                    <div className="h-3.5 rounded bg-slate-200/60" />
                    <div className="h-3.5 w-11/12 rounded bg-slate-200/60" />
                    <div className="h-3.5 w-5/6 rounded bg-slate-200/60" />
                  </div>
                </div>
            )}
            </div> :
          error ?
          <div
            role="alert"
            className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-700">
            
              {error}
            </div> :
          services.length > 0 ?
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => {
              const normalizedIcon = service.icon_text.
              toLowerCase().
              replace(/[^a-z0-9]/g, '');
              const Icon = serviceIcons[normalizedIcon] || BookOpenIcon;
              const accentColor = service.color || '#3155FF';
              const tint = hexToRgba(accentColor, 0.09);
              const isFeatured = index === 0;

              return (
                <Reveal
                  key={service.id}
                  delay={index * 0.07}
                  y={24}
                  className={isFeatured ? 'md:col-span-2 lg:col-span-1' : ''}>
                  
                    <motion.article
                    whileHover={reduceMotion ? undefined : { y: -8 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 transition-shadow duration-500 hover:shadow-lift">
                    
                      <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-1"
                      style={{
                        background: `linear-gradient(90deg, ${accentColor}, rgba(124,58,237,0.55))`
                      }} />
                    
                      <span
                      aria-hidden="true"
                      className="absolute -bottom-20 -right-16 h-52 w-52 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background: `radial-gradient(circle, ${
                        hexToRgba(accentColor, 0.14) || 'rgba(49,85,255,0.12)'}, transparent 70%)`

                      }} />
                    

                      <div className="relative flex items-center justify-between">
                        <span
                        className="inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:-translate-y-1"
                        style={{ backgroundColor: tint || 'rgb(248 250 252)' }}>
                        
                          <Icon className="h-7 w-7" style={{ color: accentColor }} />
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Program
                        </span>
                      </div>

                      <h3 className="relative mt-7 font-heading text-xl font-bold tracking-tight text-foroz-ink">
                        {service.title}
                      </h3>
                      <p className="relative mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                        {service.description}
                      </p>

                      <div className="relative mt-8 flex items-center text-sm font-semibold text-foroz-blue opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 translate-y-2">
                        Learn more
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </div>
                    </motion.article>
                  </Reveal>);

            })}
            </div> :

          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-slate-600">
              No programs are available right now.
            </div>
          }
        </div>
      </div>
    </section>);

}