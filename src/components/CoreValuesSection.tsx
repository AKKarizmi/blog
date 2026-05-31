import { motion } from 'framer-motion';
import {
  Heart,
  Star,
  ShieldCheck,
  Users,
  Lightbulb,
  Handshake,
  Leaf } from
'lucide-react';
import { useForozData } from '../context/ForozDataContext';
import type { ComponentType } from 'react';

const valueIcons: Record<string, ComponentType<{ className?: string }>> = {
  heart: Heart,
  star: Star,
  shield: ShieldCheck,
  shieldcheck: ShieldCheck,
  users: Users,
  lightbulb: Lightbulb,
  handshake: Handshake,
  leaf: Leaf,
};

const containerVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};
export function CoreValuesSection() {
  const { coreValues } = useForozData();

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

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            margin: '-100px'
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {coreValues.map((value, index) => {
            const Icon = valueIcons[value.icon.toLowerCase()] || Heart;
            // Make the 7th item span full width on tablet, or center it on desktop
            const isLast = index === coreValues.length - 1;
            return (
              <motion.div
                key={value.title}
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  transition: {
                    duration: 0.2
                  }
                }}
                className={`bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 ${isLast ? 'sm:col-span-2 lg:col-span-1 lg:col-start-2' : ''}`}>
                
                <div
                  className={`w-14 h-14 rounded-xl ${value.bg} flex items-center justify-center mb-6`}>
                  
                  <Icon className={`w-7 h-7 ${value.color}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>);

          })}
        </motion.div>
      </div>
    </section>);

}
