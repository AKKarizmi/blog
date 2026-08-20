import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Laptop,
  GraduationCap,
  Briefcase,
  Compass,
  Wrench,
} from 'lucide-react';
import type { ComponentType, CSSProperties } from 'react';
import { fetchJson } from '../services/api';

type ServiceIconProps = {
  className?: string;
  style?: CSSProperties;
};

const serviceIcons: Record<string, ComponentType<ServiceIconProps>> = {
  bookopen: BookOpen,
  book_open: BookOpen,
  book: BookOpen,
  laptop: Laptop,
  education: Laptop,
  graduation: GraduationCap,
  mentorship: GraduationCap,
  briefcase: Briefcase,
  internship: Briefcase,
  compass: Compass,
  leadership: Compass,
  wrench: Wrench,
  workshop: Wrench,
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
    <section id="services" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              What We Offer
            </h2>
            <p className="text-lg text-slate-600">
              Comprehensive programs designed to equip youth with the knowledge,
              skills, and opportunities needed to thrive in today's world.
            </p>
          </div>
          <a
            href="/programs"
            className="px-6 py-3 rounded-full bg-white border-2 border-slate-200 text-slate-700 font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all self-start md:self-auto whitespace-nowrap">
            View All Programs
          </a>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`service-skeleton-${index}`}
                className="rounded-2xl bg-white p-8 shadow-sm animate-pulse">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 mb-6" />
                <div className="h-6 w-3/4 bg-slate-100 rounded mb-4" />
                <div className="space-y-3">
                  <div className="h-4 bg-slate-100 rounded" />
                  <div className="h-4 bg-slate-100 rounded w-11/12" />
                  <div className="h-4 bg-slate-100 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-700">
            {error}
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const normalizedIcon = service.icon_text
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '');
              const Icon = serviceIcons[normalizedIcon] || BookOpen;
              const accentColor = service.color || '#0F172A';
              const tint = hexToRgba(accentColor, 0.08);

              return (
                <motion.div
                  key={service.id}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  whileHover={{
                    scale: 1.02,
                  }}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                  <div
                    className="absolute top-0 left-0 w-full h-1.5"
                    style={{
                      backgroundColor: accentColor,
                    }}
                  />

                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors"
                    style={{
                      backgroundColor: tint || 'rgb(248 250 252)',
                    }}
                  >
                    <Icon
                      className="w-8 h-8"
                      style={{
                        color: accentColor,
                      }}
                    />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="mt-8 flex items-center text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-slate-600">
            No programs are available right now.
          </div>
        )}
      </div>
    </section>
  );
}
