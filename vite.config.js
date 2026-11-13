import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// react()       → understands JSX + fast refresh while you edit
// tailwindcss() → scans your files and generates ONLY the classes you use
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
