import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tanstackStart({
      server: { entry: "server" },
    }),
    nitro({
      preset: "vercel",
    }),
    viteReact(),
    tailwindcss(),
    tsConfigPaths(),
  ],
  build: {
    // Code splitting: separate vendor chunks
    rollupOptions: {
      output: {
        manualChunks: {
          // Heavy Solana libs in separate chunk (loaded on demand)
          "solana-vendor": ["@solana/web3.js"],
          // Charts only loaded on analytics pages
          "charts-vendor": ["recharts"],
          // UI framework
          "ui-vendor": ["framer-motion"],
        },
      },
    },
    // Source maps off in prod (smaller build)
    sourcemap: process.env.NODE_ENV !== "production",
    // Minify with esbuild (faster than terser)
    minify: "esbuild",
    // CSS code splitting
    cssCodeSplit: true,
    // Chunk size warning threshold
    chunkSizeWarningLimit: 600,
  },
  // Optimize deps: pre-bundle these
  optimizeDeps: {
    include: [
      "lucide-react",
      "@tanstack/react-query",
    ],
  },
});
