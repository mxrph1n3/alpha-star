import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Если вы используете новый Tailwind

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // ЭТА СТРОКА КРИТИЧЕСКИ ВАЖНА:
  base: '/alpha-star/', 
})
