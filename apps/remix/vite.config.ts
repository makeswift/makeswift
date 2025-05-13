import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { reactRouter } from "react-router-build/vite";

export default defineConfig({
  plugins: [
    react(),
    reactRouter(),
  ],
  server: {
    port: 3000,
  },
});