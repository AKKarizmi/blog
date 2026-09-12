export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#060A16',
          900: '#080D1C',
          800: '#0D1430',
          700: '#111936',
          600: '#182347',
        },
        foroz: {
          blue: '#3155FF',
          indigo: '#4F46E5',
          violet: '#7C3AED',
          purple: '#8B5CF6',
          cyan: '#38BDF8',
          bg: '#F7F8FC',
          mist: '#F1F4FA',
          ink: '#0B1020',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(11, 16, 32, 0.04), 0 12px 32px -12px rgba(11, 16, 32, 0.12)',
        lift: '0 24px 60px -24px rgba(49, 85, 255, 0.28)',
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 30px 80px -30px rgba(79, 70, 229, 0.55)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      letterSpacing: {
        tighter2: '-0.035em',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
}
