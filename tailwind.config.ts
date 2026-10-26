import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Prompt', 'Sarabun', 'sans-serif'],
        body: ['Sarabun', 'Prompt', 'sans-serif']
      },
      colors: {
        firezone: {
          red: '#e31e24',
          darkred: '#b81419',
          navy: '#151922',
          charcoal: '#1e2430',
          slate: '#68707d',
          light: '#f5f6f8'
        }
      },
      boxShadow: {
        cameron: '0 10px 30px rgba(21, 25, 34, 0.08)',
        'cameron-hover': '0 16px 40px rgba(227, 30, 36, 0.14)'
      }
    }
  }
}
