/**
 * Dynamic Widget Discovery and Loading
 *
 * Automatically discovers and loads all widgets from the Übersicht widgets directory.
 *
 * The widgets path is configurable via vite.config.js (see @widgets alias).
 * By default, it uses ~/Library/Application Support/Übersicht/widgets on macOS.
 *
 * You can override this by setting the UEBERSICHT_WIDGETS_DIR environment variable
 * before starting the dev server:
 *   UEBERSICHT_WIDGETS_DIR=/path/to/widgets npm run dev
 *
 * Widgets are detected by finding directories containing an index.jsx file.
 * Directories starting with underscore (_) or dot (.) are ignored.
 */

// Dynamically import all widget index.jsx files using Vite's glob import
// The @widgets alias is defined in vite.config.js and points to the widgets directory
const widgetModules = import.meta.glob("@widgets/*/index.jsx", { eager: true });

/**
 * Process glob results into widget registry
 *
 * Glob returns: { '../widgets/world-clocks/index.jsx': { render, command, ... } }
 * We transform to: [{ id: 'world-clocks', render, command, ... }]
 */
const loadWidgets = () => {
  const widgets = [];

  for (const [path, module] of /** @type {[string, object][]} */ (
    Object.entries(widgetModules)
  )) {
    // Extract widget ID from path: '@widgets/world-clocks/index.jsx' -> 'world-clocks'
    // Also handles full paths like '/path/to/widgets/world-clocks/index.jsx'
    const match = path.match(
      /(?:@widgets|\/widgets|widgets)\/([^/]+)\/index\.jsx$/,
    );
    if (!match) {
      continue;
    }

    const id = match[1];

    if (!id) {
      continue;
    }
    // Skip directories starting with underscore or dot (like _harness, .git)
    if (id.startsWith("_") || id.startsWith(".")) {
      continue;
    }

    // Skip 'shared' directory (it's a helper module, not a widget)
    if (id === "shared") {
      continue;
    }

    widgets.push({
      id,
      ...module,
    });
  }

  // Sort alphabetically by ID for consistent ordering
  widgets.sort((a, b) => a.id.localeCompare(b.id));

  console.log(
    `[widgets] Discovered ${widgets.length} widgets:`,
    widgets.map((w) => w.id),
  );

  return widgets;
};

export const widgets = loadWidgets();

/**
 * Get a single widget by ID
 * @param {string} id
 * @returns {object | undefined}
 */
export const getWidget = (id) => {
  return widgets.find((w) => w.id === id);
};

/**
 * Get all widget IDs
 * @returns {string[]}
 */
export const getWidgetIds = () => {
  return widgets.map((w) => w.id);
};
