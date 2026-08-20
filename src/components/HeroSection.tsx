import { motion } from 'framer-motion';
import { ArrowRight, Globe } from 'lucide-react';
import { useForozData } from '../context/ForozDataContext';

export function HeroSection() {
  const { hero, blogPage } = useForozData();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-50">
      
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-blue-100 to-purple-100 blur-3xl opacity-50" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-indigo-100 to-blue-50 blur-3xl opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{
              opacity: 0,
              y: 30
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.8,
              ease: 'easeOut'
            }}
            className="max-w-2xl">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-6">
              <Globe size={16} />
              <span>{hero.badge}</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
              {blogPage.heroTitle}
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed">
              {blogPage.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={blogPage.heroCtaLink}
                className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                
                {blogPage.heroCtaText}
                <ArrowRight size={20} />
              </a>
              <a
                href={hero.secondaryActionHref}
                className="inline-flex justify-center items-center px-8 py-4 rounded-full bg-white text-slate-700 font-semibold text-lg border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all">
                
                {hero.secondaryActionLabel}
              </a>
            </div>
          </motion.div>

          {/* Hero Illustration / Abstract Graphic */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            transition={{
              duration: 1,
              delay: 0.2
            }}
            className="relative hidden lg:block h-[600px]">
            
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-purple-600/10 rounded-3xl transform rotate-3 scale-105" />
            <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center border border-slate-100">
              {blogPage.heroImage ? (
                <img src={blogPage.heroImage} alt={blogPage.heroTitle} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full relative p-8">
                  {/* Abstract composition representing education and growth */}
                <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-blue-500/20 blur-xl" />
                <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-purple-500/20 blur-xl" />

                <div className="grid grid-cols-2 gap-4 h-full">
                  <div className="flex flex-col gap-4 pt-12">
                    <motion.div
                      animate={{
                        y: [0, -10, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                      className="h-48 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg p-6 flex flex-col justify-end">
                      
                      <div className="w-12 h-12 rounded-full bg-white/20 mb-4" />
                      <div className="h-4 w-2/3 bg-white/30 rounded mb-2" />
                      <div className="h-4 w-1/2 bg-white/30 rounded" />
                    </motion.div>
                    <motion.div
                      animate={{
                        y: [0, 10, 0]
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                      className="h-64 rounded-2xl bg-slate-100 shadow-inner p-6 border border-slate-200">
                      
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="h-20 bg-slate-200 rounded-lg" />
                        <div className="h-20 bg-slate-200 rounded-lg" />
                      </div>
                      <div className="h-3 w-full bg-slate-200 rounded mb-2" />
                      <div className="h-3 w-4/5 bg-slate-200 rounded" />
                    </motion.div>
                  </div>
                  <div className="flex flex-col gap-4 pb-12">
                    <motion.div
                      animate={{
                        y: [0, 15, 0]
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                      className="h-64 rounded-2xl bg-white shadow-xl p-6 border border-slate-100 flex flex-col items-center justify-center">
                      
                      <div className="w-24 h-24 rounded-full border-4 border-purple-100 border-t-purple-500 animate-spin-slow" />
                    </motion.div>
                    <motion.div
                      animate={{
                        y: [0, -15, 0]
                      }}
                      transition={{
                        duration: 4.5,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                      className="h-48 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg p-6 flex flex-col justify-end">
                      
                      <div className="flex gap-2 mb-4">
                        <div className="w-8 h-8 rounded bg-white/20" />
                        <div className="w-8 h-8 rounded bg-white/20" />
                        <div className="w-8 h-8 rounded bg-white/20" />
                      </div>
                      <div className="h-4 w-3/4 bg-white/30 rounded" />
                    </motion.div>
                  </div>
                </div>
              </div>
            )}
          </div>
          </motion.div>
        </div>
      </div>
    </section>);

}
