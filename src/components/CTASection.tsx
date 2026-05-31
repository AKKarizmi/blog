import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useForozData } from '../context/ForozDataContext';

export function CTASection() {
  const { cta } = useForozData();

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-slate-900" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-indigo-900/50 to-purple-900/50" />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            {cta.title}
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            {cta.description}
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a
              href={cta.primaryHref}
              className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg shadow-lg shadow-blue-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all w-full sm:w-auto">
              {cta.primaryLabel}
              <ArrowRight size={20} />
            </a>
            <a
              href={cta.secondaryHref}
              className="inline-flex justify-center items-center px-8 py-4 rounded-full bg-white/10 text-white font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all w-full sm:w-auto backdrop-blur-sm">
              {cta.secondaryLabel}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
