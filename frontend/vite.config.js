import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  
  server: {
    build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; 
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000, 
  }
      },
      proxy: {
          '/backend': {
              target: 'https://agrixcubesat.azurewebsites.net/',
              changeOrigin: true,
              secure: false,
          },
      },
  },
});
