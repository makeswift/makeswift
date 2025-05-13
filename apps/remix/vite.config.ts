import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// React Router v7 doesn't need a specific Vite plugin like in early versions
export default defineConfig(({ mode }) => {
  // Load environment variables from .env files
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  
  // Get NODE_ENV from process.env for client-side definition
  const nodeEnv = process.env.NODE_ENV || mode;
  
  return {
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
      // Exclude Makeswift packages from optimization to prevent build issues
      exclude: ["@makeswift/runtime", "@makeswift/remix"],
    },
    server: {
      port: parseInt(process.env.PORT || '3000', 10),
    },
    define: {
      // Polyfill for process.env in the client
      'process.env': {
        NODE_ENV: JSON.stringify(nodeEnv),
        // Add any other environment variables needed by client code here
        MAKESWIFT_SITE_API_KEY: JSON.stringify(process.env.MAKESWIFT_SITE_API_KEY || '14f4ac75-39ac-4f23-a6b7-199dfd8ee6ae'),
        MAKESWIFT_API_ORIGIN: JSON.stringify(process.env.MAKESWIFT_API_ORIGIN || 'https://api.makeswift.com'),
      }
    }
  };
});