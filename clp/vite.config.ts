import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { config } from "dotenv";
config()

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: 3000,
    host: true,
    cors: true,
  },
  ssr: {
    noExternal: ['@supabase/supabase-js'],
    external: ['jsonwebtoken', 'safe-buffer'],
  },
  optimizeDeps: {
    exclude: ['jsonwebtoken', 'safe-buffer'],
  },
});
