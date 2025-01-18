
export default function Header(props) {
    const { darkMode, toggleDarkMode, handleClearAll } = props;
    return (
      <header className="app-header">
        <h1>Health Metrics Tracker</h1>
        <div className="header-controls">
          <button
            className="clear-data-btn"
            onClick={handleClearAll}
            title="Clear all saved metrics"
          >
            Clear All
          </button>
          <button className="dark-mode-toggle" onClick={toggleDarkMode}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </header>
    );
  }
  