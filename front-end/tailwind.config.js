/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero-pattern': "url('/images/festival_background.jpg')",
      },
      colors: {
        primary: 'var(--color-primary, #845ec2)', // Default fallback color
        secondary: 'var(--color-secondary, #d65db1)',
        accent: 'var(--color-accent, #ff6f91)',
      },
    },
  },
  plugins: [],
};