import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import  { resolve } from 'path'

const PUBLIC_URL = process.env.PUBLIC_URL || ""

// https://vitejs.dev/config/
export default defineConfig({
  base: `${PUBLIC_URL}/rewards-dashboard`,
  define: {
    "BASE_URL": `"${PUBLIC_URL}"`,
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
})
