import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  
  server: {
    build: {
        outDir: 'dist', 
      rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // All third-party libraries will go into a 'vendor' chunk
          }
        }
      }
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
