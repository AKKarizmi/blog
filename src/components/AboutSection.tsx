import { motion } from 'framer-motion';
import { BookOpen, Users, Globe2, Target, X } from 'lucide-react';
import { useForozData } from '../context/ForozDataContext';
import type { FeatureCardData } from '../context/ForozDataContext';
import type { ComponentType } from 'react';
import { useState } from 'react';

const featureIcons: Record<string, ComponentType<{ className?: string }>> = {
  book: BookOpen,
  education: BookOpen,
  globe: Globe2,
  global: Globe2,
  target: Target,
  skills: Target,
  users: Users,
  mentorship: Users,
};

export function AboutSection() {
  const { about, blogPage } = useForozData();
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const { aboutSectionSummarize, aboutSection } = blogPage;
  const midpoint = Math.ceil(about.featureCards.length / 2);
  const featureColumns = [
    about.featureCards.slice(0, midpoint),
    about.featureCards.slice(midpoint),
  ].filter((column) => column.length > 0);

  const paragraphs = aboutSectionSummarize
    ? aboutSectionSummarize.split(/\n{2,}|\r\n{2,}/).map((p) => p.trim()).filter(Boolean)
    : about.paragraphs;

  const historyParagraphs = aboutSection
    ? aboutSection.split(/\n{2,}|\r\n{2,}/).map((p) => p.trim()).filter(Boolean)
    : ['About Long Description Content'];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{
              opacity: 0,
              x: -30
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.6
            }}>
            
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              {about.title}
            </h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-8" />

            <div className="space-y-6 text-lg text-slate-600">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsHistoryModalOpen(true)}
              className="inline-flex mt-8 px-6 py-3 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors">
              {about.buttonLabel}
            </button>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: 30
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.6,
              delay: 0.2
            }}
            className="grid grid-cols-2 gap-4">
            
            {featureColumns.map((column, columnIndex) => (
              <div
                key={columnIndex}
                className={`space-y-4 ${columnIndex === 0 ? 'pt-8' : ''}`}>
                {column.map((card) => (
                  <FeatureCard key={card.id} card={card} />
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {isHistoryModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          onClick={() => setIsHistoryModalOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="about-history-title"
            className="relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl"
            onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => setIsHistoryModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              aria-label="Close about history dialog">
              <X className="h-5 w-5" />
            </button>
            <h3 id="about-history-title" className="pr-8 text-2xl font-bold text-slate-900">
              Our history
            </h3>
            <div className="mt-4 space-y-4 text-lg text-slate-700">
              {historyParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>);

}

function FeatureCard({ card }: { card: FeatureCardData }) {
  const Icon = featureIcons[card.icon.toLowerCase()] || BookOpen;

  return (
    <div className={`${card.bg} p-6 rounded-2xl border border-slate-100`}>
      <Icon className={`w-10 h-10 ${card.color} mb-4`} />
      <h3 className="font-bold text-slate-900 mb-2">{card.title}</h3>
      <p className="text-sm text-slate-600">{card.description}</p>
    </div>
  );
}
