import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // porta diferente da padrão (5173) pra não bater com outro projeto rodando
  server: {
    port: 5180,
  },
})
