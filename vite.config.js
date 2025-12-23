import react from "@vitejs/plugin-react";
import os from "os";
import path from "path";
import { defineConfig } from "vite";

// Übersicht widgets directory - configurable via UEBERSICHT_WIDGETS_DIR env var
// Defaults to the standard macOS location
const WIDGETS_DIR =
  process.env.UEBERSICHT_WIDGETS_DIR ||
  path.join(os.homedir(), "Library/Application Support/Übersicht/widgets");

console.log(`[vite] Using widgets directory: ${WIDGETS_DIR}`);

export default defineConfig({
  // Build settings - preserve names for debugging
  build: {
    minify: "esbuild",
    target: "esnext",
  },
  // Auto-inject React import into all JSX files
  // Übersicht provides React globally, but ES modules need explicit imports
  esbuild: {
    jsxInject: `import React from 'react'`,
    keepNames: true, // Don't mangle class/function names
  },
  plugins: [
    react({
      // Configure Emotion for readable CSS class names
      babel: {
        plugins: [
          [
            "@emotion/babel-plugin",
            {
              // Generate readable class names: [filename]--[local]
              labelFormat: "[filename]--[local]",
              // Include source maps for CSS
              sourceMap: true,
            },
          ],
        ],
      },
      // Use the classic JSX runtime for React 16 compatibility
      jsxRuntime: "classic",
    }),
  ],
  resolve: {
    alias: {
      // Alias for the widgets directory - used by glob imports
      "@widgets": WIDGETS_DIR,
      // Shim the 'uebersicht' module that widgets import from
      uebersicht: path.resolve(__dirname, "src/uebersicht-shim.js"),
    },
  },
  // Allow importing from the widgets directory (outside project root)
  server: {
    fs: {
      allow: [
        // Project root
        ".",
        // Übersicht widgets directory
        WIDGETS_DIR,
      ],
    },
  },
});
