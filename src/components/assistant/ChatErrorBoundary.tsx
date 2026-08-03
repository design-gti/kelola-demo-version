"use client";
import { Component, type ReactNode } from "react";

const FONT = "'Open Sans', sans-serif";
const ACCENT = "#016699";

interface Props {
  children: ReactNode;
  /** Bumped by the parent to force a fresh mount when the user retries. */
  resetKey: number;
  onRetry: () => void;
}

interface State {
  hasError: boolean;
}

/**
 * A crash inside CopilotChat or one of the useRenderToolCall card components
 * (e.g. a malformed tool result) would otherwise take down the whole
 * dashboard, not just the assistant panel — React error boundaries only
 * catch render-time exceptions, so this is a narrower net than CopilotChat's
 * own `error` label (which only covers failed API calls). Class component
 * because React has no hook equivalent for getDerivedStateFromError.
 */
export default class ChatErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: Props) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, textAlign: "center", fontFamily: FONT }}>
          <div style={{ fontSize: 13, color: "#495057", marginBottom: 12 }}>
            Asisten mengalami masalah menampilkan percakapan ini.
          </div>
          <button
            onClick={this.props.onRetry}
            style={{
              background: ACCENT,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 16px",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: FONT,
              cursor: "pointer",
            }}
          >
            Mulai percakapan baru
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
