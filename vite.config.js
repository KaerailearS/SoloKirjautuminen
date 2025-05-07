import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    outDir: "dist",
    emptyOutDir:true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html')
    }
  },
  base: './'
})
