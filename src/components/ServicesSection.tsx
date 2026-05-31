import { motion } from 'framer-motion';
import {
  ArrowRight,
  Laptop,
  GraduationCap,
  Briefcase,
  Compass,
  Wrench,
} from 'lucide-react';
import { useForozData } from '../context/ForozDataContext';
import type { ComponentType } from 'react';

const serviceIcons: Record<string, ComponentType<{ className?: string }>> = {
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

export function ServicesSection() {
  const { services } = useForozData();

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = serviceIcons[service.icon.toLowerCase()] || Laptop;

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
                  className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${service.gradient}`}
                />

                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-slate-100 transition-colors">
                  <Icon className="w-8 h-8 text-slate-700" />
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
      </div>
    </section>
  );
}
