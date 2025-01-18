
export default function FilterBar(props) {
    const {
      metrics,
      selectedMetric,
      setSelectedMetric,
      timeFilter,
      setTimeFilter,
      sortBy,
      setSortBy,
      sortOrder,
      setSortOrder,
    } = props;
  
    return (
      <div className="filters-toolbar">
        <div className="filter-group">
          <label>Metric Type:</label>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="filter-select"
          >
            <option value="">All Metrics</option>
            {[...new Set(metrics.map((item) => item.metric))].map((metric) => (
              <option key={metric} value={metric}>
                {metric}
              </option>
            ))}
          </select>
        </div>
  
        <div className="filter-group">
          <label>Time of Day:</label>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Times</option>
            <option value="morning">Morning (5AM-12PM)</option>
            <option value="afternoon">Afternoon (12PM-5PM)</option>
            <option value="evening">Evening (5PM-5AM)</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Sort By:</label>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split("-");
              setSortBy(newSortBy);
              setSortOrder(newSortOrder);
            }}
            className="filter-select"
          >
            <option value="time-desc">Time (Newest First)</option>
            <option value="time-asc">Time (Oldest First)</option>
            <option value="value-desc">Value (Highest First)</option>
            <option value="value-asc">Value (Lowest First)</option>
          </select>
        </div>
      </div>
    );
  }
  