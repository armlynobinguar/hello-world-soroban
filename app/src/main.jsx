import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

function ErrorFallback({ error }) {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: '480px', margin: '0 auto' }}>
      <h1 style={{ color: '#f85149' }}>Something went wrong</h1>
      <pre style={{ overflow: 'auto', fontSize: '0.85rem' }}>{error?.message ?? String(error)}</pre>
      <p>Check the browser console for details. Restart the app (npm run dev) after changing app/.env.</p>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) return <ErrorFallback error={this.state.error} />;
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);

