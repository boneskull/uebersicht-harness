/**
 * Übersicht Widget Debug Harness - Main Entry Point
 * 
 * Renders all widgets in a debuggable browser environment.
 */

// React is auto-injected by Vite's jsxInject config
import { Component } from 'react';
import ReactDOM from 'react-dom';
import { css } from 'emotion';
import WidgetFrame from './WidgetFrame.jsx';
import { widgets } from './widgets.js';

// Theme colors
const theme = {
  cyan: '#00ffff',
  magenta: '#ff00ff',
  orange: '#ff9933',
  green: '#00ff41',
};

const appStyles = css`
  max-width: 1400px;
  margin: 0 auto;
`;

const headerStyles = css`
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 0, 255, 0.3);
`;

const titleStyles = css`
  margin: 0 0 10px 0;
  font-size: 24px;
  color: ${theme.cyan};
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  letter-spacing: 3px;
  text-transform: uppercase;
`;

const subtitleStyles = css`
  margin: 0;
  color: ${theme.orange};
  font-size: 12px;
  letter-spacing: 1px;
`;

const statsStyles = css`
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 15px;
  font-size: 11px;
`;

const statStyles = css`
  color: ${theme.green};
  
  span {
    color: ${theme.magenta};
    margin-left: 5px;
  }
`;

const filterStyles = css`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
`;

const filterButtonStyles = css`
  background: transparent;
  border: 1px solid rgba(0, 255, 255, 0.3);
  color: ${theme.cyan};
  padding: 6px 14px;
  border-radius: 20px;
  cursor: pointer;
  font-family: inherit;
  font-size: 11px;
  letter-spacing: 0.5px;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${theme.cyan};
    background: rgba(0, 255, 255, 0.1);
  }
  
  &.active {
    background: ${theme.cyan};
    color: #000;
    border-color: ${theme.cyan};
  }
`;

const widgetGridStyles = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const noWidgetsStyles = css`
  text-align: center;
  padding: 40px;
  color: ${theme.orange};
  font-size: 14px;
`;

/**
 * Main Harness App
 */
class HarnessApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedWidgets: new Set(widgets.map(w => w.id)), // All selected by default
    };
  }

  toggleWidget = (id) => {
    this.setState(state => {
      const selected = new Set(state.selectedWidgets);
      if (selected.has(id)) {
        selected.delete(id);
      } else {
        selected.add(id);
      }
      return { selectedWidgets: selected };
    });
  };

  selectAll = () => {
    this.setState({ selectedWidgets: new Set(widgets.map(w => w.id)) });
  };

  selectNone = () => {
    this.setState({ selectedWidgets: new Set() });
  };

  render() {
    const { selectedWidgets } = this.state;
    const visibleWidgets = widgets.filter(w => selectedWidgets.has(w.id));

    return (
      <div className={appStyles}>
        {/* Header */}
        <header className={headerStyles}>
          <h1 className={titleStyles}>Übersicht Widget Harness</h1>
          <p className={subtitleStyles}>Debug your widgets in the browser</p>
          <div className={statsStyles}>
            <div className={statStyles}>
              Widgets loaded: <span>{widgets.length}</span>
            </div>
            <div className={statStyles}>
              Showing: <span>{visibleWidgets.length}</span>
            </div>
          </div>
        </header>

        {/* Widget filter */}
        <div className={filterStyles}>
          <button 
            className={filterButtonStyles}
            onClick={this.selectAll}
          >
            All
          </button>
          <button 
            className={filterButtonStyles}
            onClick={this.selectNone}
          >
            None
          </button>
          {widgets.map(widget => (
            <button
              key={widget.id}
              className={`${filterButtonStyles} ${selectedWidgets.has(widget.id) ? 'active' : ''}`}
              onClick={() => this.toggleWidget(widget.id)}
            >
              {widget.id}
            </button>
          ))}
        </div>

        {/* Widget grid */}
        <div className={widgetGridStyles}>
          {visibleWidgets.length === 0 ? (
            <div className={noWidgetsStyles}>
              No widgets selected. Click a widget name above to show it.
            </div>
          ) : (
            visibleWidgets.map(widget => (
              <WidgetFrame 
                key={widget.id} 
                widget={widget} 
              />
            ))
          )}
        </div>
      </div>
    );
  }
}

// Mount the app
ReactDOM.render(
  <HarnessApp />,
  document.getElementById('root')
);

// Log startup info
console.log('🔧 Übersicht Widget Harness');
console.log(`📦 Loaded ${widgets.length} widgets:`, widgets.map(w => w.id));
console.log('💡 Click "Debug" on any widget to simulate command output');

