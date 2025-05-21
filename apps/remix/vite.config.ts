import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  ssr: {
    noExternal: [
      '@emotion/cache',
      '@emotion/css',
      '@emotion/hash',
      '@emotion/memoize',
      '@emotion/serialize',
      '@emotion/sheet',
      '@emotion/unitless',
      '@emotion/utils',
      '@emotion/weak-memoize',
    ],
  },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
});
