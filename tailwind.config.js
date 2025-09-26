module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#1E40AF',
        gradient: {
          start: '#667eea',
          end: '#764ba2'
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'splash': 'splash 2s ease-in-out'
      }
    },
  },
  plugins: [],
}