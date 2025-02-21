/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      animation: {
        wave: 'wave 1s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': {
            transform: 'scaleY(1)',
          },
          '50%': {
            transform: 'scaleY(0.5)',
          },
        },
      },
    },
  },
  plugins: [],
};
