import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  Award,
  BookOpen,
  Handshake,
  Heart,
  Leaf,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import type { ComponentType, CSSProperties } from 'react';
import { fetchJson } from '../services/api';

type ValueIconProps = {
  className?: string;
  style?: CSSProperties;
};

const valueIcons: Record<string, ComponentType<ValueIconProps>> = {
  heart: Heart,
  star: Star,
  shield: ShieldCheck,
  shieldcheck: ShieldCheck,
  users: Users,
  lightbulb: Lightbulb,
  handshake: Handshake,
  leaf: Leaf,
  sparkles: Sparkles,
  bookopen: BookOpen,
  book_open: BookOpen,
  award: Award,
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
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Our Core Values
          </h2>
          <p className="text-lg text-slate-600">
            These guiding principles shape our culture, drive our decisions, and
            define how we interact with the youth we serve and the partners we
            collaborate with.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`core-value-skeleton-${index}`}
                className="rounded-2xl bg-slate-50 border border-slate-100 p-8 animate-pulse">
                <div className="w-14 h-14 rounded-xl bg-slate-100 mb-6" />
                <div className="h-6 w-3/4 bg-slate-100 rounded mb-3" />
                <div className="space-y-3">
                  <div className="h-4 bg-slate-100 rounded" />
                  <div className="h-4 bg-slate-100 rounded w-11/12" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-700">
            {error}
          </div>
        ) : coreValues.length > 0 ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              margin: '-100px',
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => {
              const normalizedIcon = value.icon
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '');
              const Icon = valueIcons[normalizedIcon] || Heart;
              const accentColor = value.color || '#0F172A';
              const tint = hexToRgba(accentColor, 0.08);

              return (
                <motion.div
                  key={value.id}
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 20,
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.5,
                        delay: index * 0.08,
                      },
                    },
                  }}
                  whileHover={{
                    y: -5,
                    transition: {
                      duration: 0.2,
                    },
                  }}
                  className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                    style={{
                      backgroundColor: tint || 'rgb(248 250 252)',
                    }}>
                    <Icon
                      className="w-7 h-7"
                      style={{
                        color: accentColor,
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-slate-600">
            No core values are available right now.
          </div>
        )}
      </div>
    </section>
  );
}
