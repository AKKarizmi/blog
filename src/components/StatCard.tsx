import { useEffect, useState, useRef } from 'react';
import { Card } from './ui/Card';
import type { LucideIcon } from 'lucide-react';
interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color: 'blue' | 'amber' | 'emerald' | 'purple';
}
const colorStyles = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-l-blue-500'
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-l-amber-500'
  },
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-l-emerald-500'
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-l-purple-500'
  }
};
const ANIMATION_DURATION = 1200; // ms
/**
 * Parses a display value like "1,248", "71.5%", or 892 into:
 *  - target: numeric end value
 *  - prefix: any non-numeric leading chars
 *  - suffix: any non-numeric trailing chars (e.g. "%")
 *  - decimals: precision to render during the count-up
 *  - useGrouping: whether the original used thousands separators
 */
function parseValue(value: string | number) {
  const raw = String(value).trim();
  const match = raw.match(/^([^\d-]*)(-?[\d,]*\.?\d*)(.*)$/);
  if (!match)
  return {
    target: NaN,
    prefix: '',
    suffix: raw,
    decimals: 0,
    useGrouping: false
  };
  const [, prefix, numStr, suffix] = match;
  const useGrouping = numStr.includes(',');
  const cleaned = numStr.replace(/,/g, '');
  const target = parseFloat(cleaned);
  const decimals = cleaned.includes('.') ? cleaned.split('.')[1].length : 0;
  return {
    target,
    prefix,
    suffix,
    decimals,
    useGrouping
  };
}
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
function useCountUp(value: string | number) {
  const { target, prefix, suffix, decimals, useGrouping } = parseValue(value);
  const [display, setDisplay] = useState<string>(() => {
    if (Number.isNaN(target)) return String(value);
    if (prefersReducedMotion())
    return formatNumber(target, decimals, useGrouping, prefix, suffix);
    return formatNumber(0, decimals, useGrouping, prefix, suffix);
  });
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    if (Number.isNaN(target)) {
      setDisplay(String(value));
      return;
    }
    if (prefersReducedMotion()) {
      setDisplay(formatNumber(target, decimals, useGrouping, prefix, suffix));
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / ANIMATION_DURATION, 1);
      const eased = easeOutCubic(t);
      const current = target * eased;
      setDisplay(formatNumber(current, decimals, useGrouping, prefix, suffix));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, decimals, prefix, suffix, useGrouping]);
  return display;
}
function formatNumber(
n: number,
decimals: number,
useGrouping: boolean,
prefix: string,
suffix: string)
: string {
  const formatted = n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping
  });
  return `${prefix}${formatted}${suffix}`;
}
export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  color
}: StatCardProps) {
  const styles = colorStyles[color];
  const display = useCountUp(value);
  return (
    <Card
      className={`relative overflow-hidden border-l-4 ${styles.border} hover:shadow-md transition-shadow duration-200`}>
      
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 truncate">
              {title}
            </p>
            <p className="mt-1 text-3xl font-bold text-gray-900 tabular-nums">
              {display}
            </p>
          </div>
          <div className={`p-3 rounded-lg ${styles.bg} ${styles.text}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
        {trend &&
        <div className="mt-4 flex items-center text-sm">
            <span
            className={`font-medium ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
            
              {trendUp ? '+' : ''}
              {trend}
            </span>
            <span className="ml-2 text-gray-400">from last month</span>
          </div>
        }
      </div>
    </Card>);

}
