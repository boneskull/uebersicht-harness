#!/usr/bin/env node

/**
 * Übersicht Harness CLI
 *
 * Spawns Vite dev server with the harness configuration. Widgets directory can
 * be configured via UEBERSICHT_WIDGETS_DIR env var.
 */

import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(__dirname, '..');

// Find the vite binary in our own node_modules
const viteBin = join(packageRoot, 'node_modules', '.bin', 'vite');

// Spawn vite with our config, passing through any CLI args
const args = process.argv.slice(2);

// Default to 'dev' command if none specified
if (args.length === 0 || args[0]?.startsWith('-')) {
  args.unshift('dev');
}

const child = spawn(viteBin, args, {
  cwd: packageRoot,
  env: {
    ...process.env,
    // Ensure vite can find our config
    VITE_CWD: packageRoot,
  },
  stdio: 'inherit',
});

child.on('error', (err) => {
  console.error('Failed to start vite:', err.message);
  process.exit(1);
});

child.on('close', (code) => {
  process.exit(code ?? 0);
});
