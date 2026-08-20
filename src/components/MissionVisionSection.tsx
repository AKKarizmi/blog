import { motion } from 'framer-motion';
import { Eye, Rocket } from 'lucide-react';
import { useForozData } from '../context/ForozDataContext';

export function MissionVisionSection() {
  const { missionVision, blogPage } = useForozData();

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Vision Card */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.5
            }}
            className="relative bg-white rounded-3xl p-10 shadow-lg shadow-slate-200/50 overflow-hidden group">
            
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-blue-600" />
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl group-hover:bg-blue-100 transition-colors duration-500" />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-8">
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-6">
                {missionVision.visionTitle}
              </h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                {blogPage.visionText}
              </p>
            </div>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.5,
              delay: 0.2
            }}
            className="relative bg-white rounded-3xl p-10 shadow-lg shadow-slate-200/50 overflow-hidden group">
            
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 to-purple-600" />
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-50 rounded-full blur-3xl group-hover:bg-purple-100 transition-colors duration-500" />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-8">
                <Rocket className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-6">
                {missionVision.missionTitle}
              </h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                {blogPage.missionText}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>);

}
