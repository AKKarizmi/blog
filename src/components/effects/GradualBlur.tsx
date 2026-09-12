type GradualBlurProps = {
  position?: 'top' | 'bottom';
  /** Tailwind height classes, e.g. "h-24 md:h-40". */
  heightClassName?: string;
  /** Number of stacked blur layers — more layers, smoother ramp. */
  layers?: number;
  /** Strongest blur in pixels at the outer edge. */
  maxBlur?: number;
  className?: string;
};

/**
 * Gradual Blur — a progressive, masked backdrop blur used as a premium
 * transition between major sections instead of a hard edge.
 */
export function GradualBlur({
  position = 'bottom',
  heightClassName = 'h-24 md:h-36',
  layers = 5,
  maxBlur = 12,
  className = ''
}: GradualBlurProps) {
  const edge = position === 'bottom' ? 'bottom-0' : 'top-0';

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute left-0 right-0 ${edge} ${heightClassName} z-[5] ${className}`}>
      
      {Array.from({ length: layers }).map((_, index) => {
        const step = index / layers;
        const nextStep = (index + 1) / layers;
        const blur = (index + 1) / layers * maxBlur;

        const from = position === 'bottom' ? step * 100 : 100 - nextStep * 100;
        const to = position === 'bottom' ? nextStep * 100 : 100 - step * 100;

        const mask = `linear-gradient(to bottom, transparent ${from}%, #000 ${
        (from + to) / 2}%, #000 ${
        to}%, transparent ${to}%)`;

        return (
          <div
            key={`blur-layer-${index}`}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blur.toFixed(1)}px)`,
              WebkitBackdropFilter: `blur(${blur.toFixed(1)}px)`,
              maskImage: mask,
              WebkitMaskImage: mask
            }} />);


      })}
    </div>);

}