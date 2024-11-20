import type { Config } from 'tailwindcss';
import tailwindcssAnimated from 'tailwindcss-animated';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        'primary-500': '#FF8B00',
        'primary-500-hover': '#E97F02',
        'primary-600': '#D87500',

        'secondary-200': '#CEB2B9',
        'secondary-300': '#997B83',
        'secondary-400': '#785A62',
        'secondary-500': '#5C4047',
        'secondary-600': '#3B2B2F',
        'secondary-700': '#3B2B2F',
        'secondary-900': '#221D1E'
      }
    }
  },
  plugins: [tailwindcssAnimated]
};
export default config;
