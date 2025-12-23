import react from '@vitejs/plugin-react';
import os from 'os';
import path from 'path';
import { defineConfig } from 'vite';

// Übersicht widgets directory - configurable via UEBERSICHT_WIDGETS_DIR env var
// Defaults to the standard macOS location
const WIDGETS_DIR =
  process.env.UEBERSICHT_WIDGETS_DIR ||
  path.join(os.homedir(), 'Library/Application Support/Übersicht/widgets');

console.log(`[vite] Using widgets directory: ${WIDGETS_DIR}`);

/**
 * Build proxy configuration for CORS bypass.
 *
 * Widgets running in real Übersicht can make fetch() calls to any localhost
 * endpoint without CORS restrictions (it's a desktop app, not a browser). In
 * our browser-based harness, we need to proxy these requests through Vite to
 * bypass CORS.
 *
 * The harness's fetch interceptor (in main.jsx) automatically rewrites:
 * fetch('http://localhost:8080/token') -> fetch('/proxy/8080/token')
 *
 * This config sets up the corresponding Vite proxies: /proxy/8080/* ->
 * http://localhost:8080/* /proxy/3000/* -> http://localhost:3000/* etc.
 *
 * Set UEBERSICHT_PROXY_PORTS to customize which ports are proxied. Default:
 * 3000,4000,5000,8000,8080,9000
 */
const buildProxyConfig = () => {
  const proxy = {};

  // Common development ports - configurable via env var
  const defaultPorts = '3000,4000,5000,8000,8080,9000';
  const portsStr = process.env.UEBERSICHT_PROXY_PORTS || defaultPorts;
  const ports = portsStr
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);

  for (const port of ports) {
    proxy[`/proxy/${port}`] = {
      changeOrigin: true,
      /** @param {string} reqPath */
      rewrite: (reqPath) => reqPath.replace(`/proxy/${port}`, ''),
      target: `http://localhost:${port}`,
    };
  }

  console.log(
    `[vite] CORS proxy enabled for localhost ports: ${ports.join(', ')}`,
  );

  return proxy;
};

export default defineConfig({
  // Build settings - preserve names for debugging
  build: {
    minify: 'esbuild',
    target: 'esnext',
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
            '@emotion/babel-plugin',
            {
              // Generate readable class names: [filename]--[local]
              labelFormat: '[filename]--[local]',
              // Include source maps for CSS
              sourceMap: true,
            },
          ],
        ],
      },
      // Use the classic JSX runtime for React 16 compatibility
      jsxRuntime: 'classic',
    }),
  ],
  resolve: {
    alias: {
      // Alias for the widgets directory - used by glob imports
      '@widgets': WIDGETS_DIR,
      // Shim the 'uebersicht' module that widgets import from
      uebersicht: path.resolve(__dirname, 'src/uebersicht-shim.js'),
    },
  },
  // Allow importing from the widgets directory (outside project root)
  server: {
    fs: {
      allow: [
        // Project root
        '.',
        // Übersicht widgets directory
        WIDGETS_DIR,
      ],
    },
    // Proxy configuration for bypassing CORS when widgets fetch from local servers
    proxy: buildProxyConfig(),
  },
});
