import { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';
import { useForozData } from '../context/ForozDataContext';
interface CounterProps {
  end: number;
  duration: number;
  suffix?: string;
  label: string;
}
function Counter({ end, duration, suffix = '', label }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: '-50px'
  });
  useEffect(() => {
    if (isInView) {
      let startTime: number | null = null;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        // Ease out quad
        const easeOut = progress * (2 - progress);
        setCount(Math.floor(easeOut * end));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);
  return (
    <div ref={ref} className="text-center p-6">
      <div className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-lg font-medium text-blue-100 uppercase tracking-wider">
        {label}
      </div>
    </div>);

}
export function ImpactSection() {
  const { impact } = useForozData();

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700" />

      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            Our Impact in Numbers
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Together, we are making a measurable difference in the lives of
            youth around the world.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-white/20">
          {impact.map((item) => (
            <Counter
              key={item.id}
              end={item.end}
              duration={item.duration}
              suffix={item.suffix}
              label={item.label}
            />
          ))}
        </div>
      </div>
    </section>);

}
