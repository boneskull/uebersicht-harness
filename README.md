# Übersicht Harness

> A development/testing harness for [Übersicht](http://tracesof.net/uebersicht/) widgets. Run & debug your widgets in a browser with hot reload!

## Quick Start

```bash
npm install
npm run dev
```

## Configuration

### Widgets Directory

By default, widgets are loaded from `~/Library/Application Support/Übersicht/widgets`.

Override with the `UEBERSICHT_WIDGETS_DIR` environment variable:

```bash
UEBERSICHT_WIDGETS_DIR=/path/to/widgets npm run dev
```

### Widget Requirements

Widgets must have an `index.jsx` entry point. Directories starting with `_` or `.` are ignored.

CoffeeScript-based widgets are unsupported.

## License

Copyright © 2025 [Christopher "boneskull" Hiller](https://github.com/boneskull). Licensed Blue Oak Model License 1.0.0.
