# AGENTS.md

## Project Overview

This is a browser-based debug harness for [Übersicht](http://tracesof.net/uebersicht/) desktop widgets. It allows widget development with hot reload instead of relying on Übersicht's slower refresh cycle.

The harness:
- Auto-discovers widgets from the configured widgets directory
- Renders them in isolated frames with simulated command output
- Provides a shim for the `uebersicht` module that widgets import from

## ⚠️ Critical: Dependency Versions

**React and Emotion versions are pinned to match Übersicht's runtime.** Do not upgrade these unless Übersicht itself upgrades:

- `react` / `react-dom`: 16.14.0
- `@emotion/core`: 10.3.1
- `@emotion/styled`: 10.3.0
- `emotion`: 10.0.27

Widgets must work in Übersicht's environment. Upgrading these packages would create version mismatches.

## Architecture

| File | Purpose |
|------|---------|
| `vite.config.js` | Vite config with `@widgets` alias pointing to widgets directory |
| `src/main.jsx` | App entry point, renders all discovered widgets |
| `src/widgets.js` | Auto-discovers widgets via `import.meta.glob` |
| `src/WidgetFrame.jsx` | Renders individual widgets with debug controls |
| `src/uebersicht-shim.js` | Mock `uebersicht` module (run, request, css, styled) |

## Configuration

Widgets directory is configurable via `UEBERSICHT_WIDGETS_DIR` env var. Defaults to `~/Library/Application Support/Übersicht/widgets`.



