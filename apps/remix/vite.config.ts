import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// React Router v7 doesn't need a specific Vite plugin like in early versions
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "~": resolve(__dirname, "./app"),
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
  server: {
    port: 3000,
  },
});