/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // iOS-подобная цветовая палитра
        'cloud-white': '#F5F5F7',
        'serenity-blue': '#8AB4F8',
        'mindful-green': '#34C759',
        'ios-gray': '#8E8E93',
        'ios-light-gray': '#E5E5EA',
        'ios-dark-gray': '#3A3A3C',
        'ios-red': '#FF3B30',
        'ios-orange': '#FF9500',
        'ios-yellow': '#FFCC00',
        'ios-green': '#34C759',
        'ios-teal': '#5AC8FA',
        'ios-blue': '#007AFF',
        'ios-indigo': '#5856D6',
        'ios-purple': '#AF52DE',
        'ios-pink': '#FF2D55',
      },
      fontFamily: {
        'sf-pro': ['-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'Helvetica Neue', 'sans-serif'],
      },
      boxShadow: {
        'ios': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'ios-strong': '0 4px 20px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'ios': '10px',
        'ios-lg': '20px',
        'ios-xl': '30px',
      },
      backdropBlur: {
        'ios': '20px',
      },
    },
  },
  plugins: [],
}
