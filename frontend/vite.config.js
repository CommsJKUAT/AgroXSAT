import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  
  server: {
    build: {
        outDir: './frontend/dist', 
      },
      proxy: {
          '/backend': {
              target: 'https://agroxsat.onrender.com',
              changeOrigin: true,
              secure: false,
          },
      },
  },
});
