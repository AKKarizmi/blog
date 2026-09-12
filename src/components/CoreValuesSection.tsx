import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  AwardIcon,
  BookOpenIcon,
  HandshakeIcon,
  HeartIcon,
  LeafIcon,
  LightbulbIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  UsersIcon } from
'lucide-react';
import type { ComponentType, CSSProperties } from 'react';
import { fetchJson } from '../services/api';
import { SectionHeading } from './ui/SectionHeading';
import { Reveal } from './ui/Reveal';

type ValueIconProps = {
  className?: string;
  style?: CSSProperties;
};

const valueIcons: Record<string, ComponentType<ValueIconProps>> = {
  heart: HeartIcon,
  star: StarIcon,
  shield: ShieldCheckIcon,
  shieldcheck: ShieldCheckIcon,
  users: UsersIcon,
  lightbulb: LightbulbIcon,
  handshake: HandshakeIcon,
  leaf: LeafIcon,
  sparkles: SparklesIcon,
  bookopen: BookOpenIcon,
  book_open: BookOpenIcon,
  award: AwardIcon
};

type CoreValueCategory = {
  id: string | number;
  title: string;
  description: string;
  icon: string;
  color: string;
  order?: number;
};

type CoreValuesResponse = {
  core_values?: CoreValueCategory[];
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

export function CoreValuesSection() {
  const [coreValues, setCoreValues] = useState<CoreValueCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let isActive = true;

    const loadCoreValues = async () => {
      setLoading(true);
      setError(null);

      try {
        const payload = await fetchJson<CoreValuesResponse>('/d1/get_core_values/');
        if (!isActive) {
          return;
        }

        const values = Array.isArray(payload?.core_values) ? payload.core_values : [];
        values.sort((left, right) => {
          const leftOrder = typeof left.order === 'number' ? left.order : Number.MAX_SAFE_INTEGER;
          const rightOrder = typeof right.order === 'number' ? right.order : Number.MAX_SAFE_INTEGER;
          return leftOrder - rightOrder;
        });

        setCoreValues(values);
      } catch (err) {
        if (!isActive) {
          return;
        }

        setCoreValues([]);
        setError(err instanceof Error ? err.message : 'Unable to load core values.');
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadCoreValues();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Core Values"
          title={
          <>
              The principles behind every{' '}
              <span className="text-gradient">decision</span> we make
            </>
          }
          description="These guiding principles shape our culture, drive our decisions, and define how we interact with the youth we serve and the partners we collaborate with." />
        

        <div className="mt-16">
          {loading ?
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) =>
            <div
              key={`core-value-skeleton-${index}`}
              className="animate-pulse rounded-2xl border border-slate-100 bg-foroz-bg p-8">
              
                  <div className="mb-6 h-12 w-12 rounded-xl bg-slate-200/70" />
                  <div className="mb-3 h-5 w-3/4 rounded bg-slate-200/70" />
                  <div className="space-y-3">
                    <div className="h-3.5 rounded bg-slate-200/60" />
                    <div className="h-3.5 w-11/12 rounded bg-slate-200/60" />
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
          coreValues.length > 0 ?
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {coreValues.map((value, index) => {
              const normalizedIcon = value.icon.
              toLowerCase().
              replace(/[^a-z0-9]/g, '');
              const Icon = valueIcons[normalizedIcon] || HeartIcon;
              const accentColor = value.color || '#3155FF';
              const tint = hexToRgba(accentColor, 0.09);
              const glow = hexToRgba(accentColor, 0.14);

              return (
                <Reveal key={value.id} delay={index * 0.06} y={22}>
                    <motion.div
                    whileHover={reduceMotion ? undefined : { y: -7 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-8 transition-shadow duration-500 hover:shadow-lift">
                    
                      <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                      style={{
                        background: `linear-gradient(90deg, ${accentColor}, rgba(124,58,237,0.5), transparent)`
                      }} />
                    
                      <span
                      aria-hidden="true"
                      className="absolute -right-14 -top-14 h-40 w-40 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background: `radial-gradient(circle, ${glow || 'rgba(49,85,255,0.12)'}, transparent 70%)`
                      }} />
                    

                      <span
                      className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-3"
                      style={{ backgroundColor: tint || 'rgb(248 250 252)' }}>
                      
                        <Icon className="h-6 w-6" style={{ color: accentColor }} />
                      </span>

                      <h3 className="relative mt-6 font-heading text-lg font-bold tracking-tight text-foroz-ink">
                        {value.title}
                      </h3>
                      <p className="relative mt-3 text-sm leading-relaxed text-slate-600">
                        {value.description}
                      </p>
                    </motion.div>
                  </Reveal>);

            })}
            </div> :

          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-slate-600">
              No core values are available right now.
            </div>
          }
        </div>
      </div>
    </section>);

}