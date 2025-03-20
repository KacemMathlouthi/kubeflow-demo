import { defineConfig } from "vite";
import path from "path"
import react from "@vitejs/plugin-react";
import tailwindcss from 'tailwindcss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  server: {
    // Specify the development server port
    port: 80,
  },
  // Base name of your app
  base: "/", // Replace this with the subdirectory path if needed
});