/**
 * WidgetFrame - Debug wrapper for Übersicht widgets
 *
 * Provides:
 * - Widget rendering with className applied
 * - Command output simulation
 * - State inspection
 * - Error boundaries
 * - Refresh controls
 */

// React is auto-injected by Vite's jsxInject config
import { Component } from "react";
import { css } from "emotion";

// Theme colors matching the Retro Synth Matrix aesthetic
const theme = {
  cyan: "#00ffff",
  magenta: "#ff00ff",
  orange: "#ff9933",
  green: "#00ff41",
  red: "#ff0066",
  background: "rgba(0, 0, 0, 0.85)",
  border: "rgba(255, 0, 255, 0.4)",
};

const frameStyles = css`
  margin: 20px 0;
  border: 2px solid ${theme.border};
  border-radius: 15px;
  background: ${theme.background};
  overflow: hidden;
`;

const headerStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 0, 255, 0.1);
  border-bottom: 1px solid ${theme.border};
`;

const titleStyles = css`
  font-size: 14px;
  font-weight: 600;
  color: ${theme.cyan};
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const controlsStyles = css`
  display: flex;
  gap: 8px;
`;

const buttonStyles = css`
  background: transparent;
  border: 1px solid ${theme.cyan};
  color: ${theme.cyan};
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: 11px;
  letter-spacing: 0.5px;
  transition: all 0.2s;

  &:hover {
    background: ${theme.cyan};
    color: #000;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const contentStyles = css`
  padding: 20px;
  position: relative;

  /* Neutralize absolute positioning from widgets - they render inline in the harness */
  & > div {
    position: relative !important;
    top: auto !important;
    left: auto !important;
    right: auto !important;
    bottom: auto !important;
    transform: none !important;
  }
`;

const debugPanelStyles = css`
  border-top: 1px solid ${theme.border};
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.5);
`;

const textareaStyles = css`
  width: 100%;
  min-height: 100px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid ${theme.border};
  border-radius: 4px;
  color: ${theme.green};
  font-family: "IBM Plex Mono", monospace;
  font-size: 12px;
  padding: 10px;
  resize: vertical;

  &::placeholder {
    color: rgba(255, 153, 51, 0.5);
  }

  &:focus {
    outline: none;
    border-color: ${theme.cyan};
  }
`;

const labelStyles = css`
  display: block;
  font-size: 11px;
  color: ${theme.orange};
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 6px;
`;

const stateDisplayStyles = css`
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid ${theme.border};
  border-radius: 4px;
  padding: 10px;
  font-size: 11px;
  color: ${theme.green};
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 150px;
  overflow: auto;
  margin-top: 10px;
`;

const errorStyles = css`
  background: rgba(255, 0, 102, 0.2);
  border: 2px solid ${theme.red};
  border-radius: 8px;
  padding: 16px;
  margin: 10px;
`;

const errorTitleStyles = css`
  color: ${theme.red};
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 10px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const errorMessageStyles = css`
  color: ${theme.orange};
  font-size: 12px;
  margin: 0 0 10px 0;
`;

const errorStackStyles = css`
  color: ${theme.cyan};
  font-size: 10px;
  white-space: pre-wrap;
  word-break: break-all;
  opacity: 0.8;
`;

/**
 * Error Boundary for catching widget render errors
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[WidgetFrame] Render error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={errorStyles}>
          <h3 className={errorTitleStyles}>Widget Render Error</h3>
          <p className={errorMessageStyles}>{this.state.error?.message}</p>
          <pre className={errorStackStyles}>{this.state.error?.stack}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * WidgetFrame Component
 */
export default class WidgetFrame extends Component {
  constructor(props) {
    super(props);

    const { widget } = props;

    this.state = {
      // Widget state follows Übersicht's updateState pattern
      widgetState: widget.initialState || { output: "", error: null },
      // Debug panel state
      showDebug: false,
      simulatedOutput: "",
      refreshCount: 0,
    };

    this.refreshInterval = null;
  }

  componentDidMount() {
    const { widget } = this.props;

    // DON'T auto-run commands - they'll fail without real output
    // User should paste simulated output via Debug panel
    if (widget.command) {
      console.log(
        `[${widget.id}] Has command - use Debug panel to provide simulated output`,
      );
    }

    // Set up refresh interval if specified
    if (widget.refreshFrequency && widget.refreshFrequency > 0) {
      // Don't actually auto-refresh in debug mode - let user control it
      console.log(
        `[${widget.id}] Would refresh every ${widget.refreshFrequency}ms`,
      );
    }

    // Call widget's init if it exists
    if (widget.init) {
      try {
        widget.init(this.dispatch);
      } catch (err) {
        console.error(`[${widget.id}] init() error:`, err);
      }
    }
  }

  componentWillUnmount() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  /**
   * Dispatch function passed to widgets (matches Übersicht's API)
   */
  dispatch = (event) => {
    const { widget } = this.props;

    console.log(`[${widget.id}] dispatch:`, event);

    try {
      const updateState = widget.updateState || defaultUpdateState;
      const nextState = updateState(event, this.state.widgetState);
      this.setState({ widgetState: nextState });
    } catch (err) {
      console.error(`[${widget.id}] updateState error:`, err);
      this.setState({
        widgetState: { ...this.state.widgetState, error: err.message },
      });
    }
  };

  /**
   * Execute the widget's command
   */
  executeCommand = async () => {
    const { widget } = this.props;

    if (!widget.command) return;

    const commandStr =
      typeof widget.command === "function" ? "function" : widget.command;

    console.log(`[${widget.id}] Executing command:`, commandStr);

    // In the harness, commands don't actually run - use simulated output
    // This dispatch mimics what Übersicht does after command execution
    this.dispatch({
      type: "UB/COMMAND_RAN",
      output:
        this.state.simulatedOutput || `[Simulated output for: ${widget.id}]`,
    });
  };

  /**
   * Handle simulated output change
   */
  handleOutputChange = (e) => {
    this.setState({ simulatedOutput: e.target.value });
  };

  /**
   * Apply simulated output to widget
   */
  applySimulatedOutput = () => {
    this.dispatch({
      type: "UB/COMMAND_RAN",
      output: this.state.simulatedOutput,
    });
    this.setState((s) => ({ refreshCount: s.refreshCount + 1 }));
  };

  /**
   * Toggle debug panel
   */
  toggleDebug = () => {
    this.setState((s) => ({ showDebug: !s.showDebug }));
  };

  /**
   * Force refresh
   */
  forceRefresh = () => {
    this.executeCommand();
    this.setState((s) => ({ refreshCount: s.refreshCount + 1 }));
  };

  render() {
    const { widget } = this.props;
    const { widgetState, showDebug, simulatedOutput, refreshCount } =
      this.state;

    // Build the className for the widget content area
    const widgetClassName = widget.className
      ? css`
          ${widget.className}
        `
      : "";

    return (
      <div className={frameStyles}>
        {/* Header with controls */}
        <div className={headerStyles}>
          <span className={titleStyles}>{widget.id}</span>
          <div className={controlsStyles}>
            <button className={buttonStyles} onClick={this.forceRefresh}>
              ↻ Refresh
            </button>
            <button className={buttonStyles} onClick={this.toggleDebug}>
              {showDebug ? "▼ Hide Debug" : "▶ Debug"}
            </button>
          </div>
        </div>

        {/* Widget content */}
        <div className={contentStyles}>
          <ErrorBoundary key={refreshCount}>
            <div className={widgetClassName}>
              {widget.render(widgetState, this.dispatch)}
            </div>
          </ErrorBoundary>
        </div>

        {/* Debug panel */}
        {showDebug && (
          <div className={debugPanelStyles}>
            <label className={labelStyles}>Simulated Command Output</label>
            <textarea
              className={textareaStyles}
              value={simulatedOutput}
              onChange={this.handleOutputChange}
              placeholder={`Paste the output of this widget's command here...\n\nTo get real output, run in terminal:\n${typeof widget.command === "string" ? widget.command.trim().slice(0, 200) : "(function-based command)"}`}
            />
            <button
              className={buttonStyles}
              onClick={this.applySimulatedOutput}
              style={{ marginTop: "10px" }}
            >
              Apply Output
            </button>

            <label className={labelStyles} style={{ marginTop: "16px" }}>
              Current Widget State
            </label>
            <pre className={stateDisplayStyles}>
              {JSON.stringify(widgetState, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  }
}

/**
 * Default updateState (matches Übersicht's default)
 */
function defaultUpdateState(event, previousState) {
  if (event.type === "UB/COMMAND_RAN") {
    return {
      ...previousState,
      output: event.output,
      error: event.error,
    };
  }
  return previousState;
}
