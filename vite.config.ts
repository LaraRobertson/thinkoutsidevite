/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr"; // Import the plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],// Add the plugin to the plugins array
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['react-map-gl']
  },
  // @ts-ignore
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: './src/tests/setup.ts',
    transformMode: {
      web: [/\.[jt]sx?$/],
    },
  },
})
