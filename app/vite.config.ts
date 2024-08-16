import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src', // Optional: to make imports from src cleaner
    },
  },
  build: {
    target: 'es2020', // Match the "target" setting in your tsconfig.json
    outDir: 'dist',   // Ensure output directory is set to "dist"
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
});
