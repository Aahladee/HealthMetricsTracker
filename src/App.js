import logo from './logo.svg';
import './App.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from "react-chartjs-2";
import { useEffect, useState } from 'react';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const getTimeOfDay = (dateStr) => {
  console.log("hiiiiiii")
  const hour = new Date(dateStr).getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  return 'evening';
};
const exportToCSV = async(metrics) => {
  // Helper function to escape special characters
  const escapeCSV = (str) => {
    if (typeof str !== 'string') str = String(str);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  // Define CSV headers
  const headers = ['Metric', 'Value', 'Time', 'Time of Day'];
  
  // Convert metrics to CSV rows with proper escaping
  const rows = metrics.map(item => [
    escapeCSV(item.metric),
    escapeCSV(item.value),
    escapeCSV(new Date(item.time).toLocaleString()),
    escapeCSV(getTimeOfDay(item.time))
  ]);

  // Create CSV content with proper line endings
  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.join(','))
  ].join('\r\n');
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { 
    type: 'text/csv;charset=utf-8;' 
  });
  try {
    // Try using the newer File System Access API if available
    if (window.showSaveFilePicker) {
      const handle = await window.showSaveFilePicker({
        suggestedName: `health_metrics_${new Date().toISOString().split('T')[0]}.csv`,
        types: [{
          description: 'CSV File',
          accept: { 'text/csv': ['.csv'] },
        }],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
    } else {
      // Fallback to traditional download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `health_metrics_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Error exporting CSV:', error);
    alert('Failed to export CSV file. Please try again.');
  }
};


const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    // Optionally show user feedback
    alert('Failed to save data locally. Please ensure you have enough storage space.');
  }
};

const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

function App() {
  const [metrics, setMetrics] = useState(() => {
    const savedMetrics = localStorage.getItem('healthMetrics');
    return savedMetrics ? JSON.parse(savedMetrics) : [];
  });
  const [formData, setFormData] = useState({ metric: "", value: "", time: "" });
  const [selectedMetric, setSelectedMetric] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [showResults, setShowResults] = useState(false);
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'morning', 'afternoon', 'evening'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [sortBy, setSortBy] = useState('time');
  const [editingMetric, setEditingMetric] = useState(null);

  useEffect(() => {
    localStorage.setItem('healthMetrics', JSON.stringify(metrics));
  }, [metrics]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);


  const isWithinLast24Hours = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);
    return date >= twentyFourHoursAgo && date <= now;
  };
  

  // const getFilteredAndSortedMetrics = () => {
  //   let filtered = selectedMetric
  //     ? metrics.filter((item) => item.metric === selectedMetric)
  //     : metrics;

  //   // Sort by time (most recent first)
  //   return filtered.sort((a, b) => new Date(b.time) - new Date(a.time));
  // };

  const getFilteredAndSortedMetrics = () => {
    let filtered = metrics;
    console.log('All metrics:', metrics); // Log all metrics

    // Metric type filter
    if (selectedMetric) {
      filtered = filtered.filter(item => item.metric === selectedMetric);
      console.log('Filtered by metric:', filtered); // Log after metric filtering
    }

    // Time of day filter
    if (timeFilter !== 'all') {
      filtered = filtered.filter(item => getTimeOfDay(item.time) === timeFilter);
      console.log('Filtered by time of day:', filtered); // Log after time filtering
    }

    // Log final sorted results
    const sorted = filtered.sort((a, b) => {
      if (sortBy === 'time') {
        const comparison = new Date(b.time) - new Date(a.time);
        return sortOrder === 'asc' ? -comparison : comparison;
      } else {
        const comparison = b.value - a.value;
        return sortOrder === 'asc' ? -comparison : comparison;
      }
    });
    console.log('Final sorted results:', sorted);
    return sorted;
  };
  
  const getChartMetrics = () => {
    const filtered = getFilteredAndSortedMetrics();
    return filtered.filter(item => isWithinLast24Hours(item.time));
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (metric) => {
    setEditingMetric(metric);
    setFormData({
      metric: metric.metric,
      value: metric.value,
      time: metric.time
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.metric || !formData.value || !formData.time) {
      alert("All fields are required!");
      return;
    }

    if (editingMetric) {
      // Update existing metric
      setMetrics(prev => prev.map(item => 
        item.id === editingMetric.id 
          ? { ...formData, id: item.id, value: parseFloat(formData.value) }
          : item
      ));
      setEditingMetric(null);
    } else {
      // Add new metric
      const newMetric = { ...formData, id: Date.now(), value: parseFloat(formData.value) };
      setMetrics(prev => [...prev, newMetric]);
    }

    setFormData({ metric: "", value: "", time: "" });
    setShowResults(true);
  };

  const handleDelete = (id) => {
    const newMetrics = metrics.filter(item => item.id !== id);
    setMetrics(newMetrics);
  };
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all metrics? This cannot be undone.')) {
      setMetrics([]);
      setShowResults(false);
    }
  };
  // const filteredMetrics = selectedMetric
  //   ? metrics.filter((item) => item.metric === selectedMetric)
  //   : metrics;

  const filteredMetrics = getFilteredAndSortedMetrics();
  const chartMetrics = getChartMetrics();

  // const chartData = {
  //   labels: filteredMetrics.map((item) => item.time),
  //   datasets: [
  //     {
  //       label: selectedMetric || "Metric Trends",
  //       data: filteredMetrics.map((item) => item.value),
  //       borderColor: "blue",
  //       backgroundColor: "rgba(0, 0, 255, 0.1)",
  //     },
  //   ],
  // };
  const chartData = {
    labels: chartMetrics.map((item) => 
      new Date(item.time).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    ),
    datasets: [
      {
        label: selectedMetric || "Metric Trends (Last 24 Hours)",
        data: chartMetrics.map((item) => item.value),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Metric Trends (Last 24 Hours)'
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            const index = context[0].dataIndex;
            return new Date(chartMetrics[index].time).toLocaleString();
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Value'
        },
        beginAtZero: true
      }
    }
  };

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
     <header className="app-header">
        <h1>Health Metrics Tracker</h1>
        <div className="header-controls">
          <button 
            className="clear-data-btn"
            onClick={handleClearAll}
            title="Clear all saved metrics"
          >
            Clear All Data
          </button>
          <button 
            className="dark-mode-toggle"
            onClick={() => setDarkMode(prev => !prev)}
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="form-container">
          <h2>{editingMetric ? "Edit Metric" : "Add New Metric"}</h2>
          <form onSubmit={handleSubmit} className="metric-form">
            <div className="form-group">
              <label>Metric Name:</label>
              <input
                name="metric"
                value={formData.metric}
                onChange={handleInputChange}
                placeholder="e.g., Step Count, Heart Rate"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Value:</label>
              <input
                name="value"
                type="number"
                value={formData.value}
                onChange={handleInputChange}
                placeholder="Enter value"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Time:</label>
              <input
                name="time"
                type="datetime-local"
                value={formData.time}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="submit-btn">
                {editingMetric ? "Update Metric" : "Add Metric"}
              </button>
              {editingMetric && (
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setEditingMetric(null);
                    setFormData({ metric: "", value: "", time: "" });
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {showResults && metrics.length > 0 && (
        <div className="results-container">
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
                  const [newSortBy, newSortOrder] = e.target.value.split('-');
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


            {/* <div className="chart-container">
              <Line data={chartData} options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Metric Trends Over Time'
                  }
                }
              }} />
            </div> */}
            <div className="chart-container">
              <Line data={chartData} options={chartOptions} />
              {chartMetrics.length === 0 && (
                <div className="no-data-message">
                  No data available for the last 24 hours
                </div>
              )}
            </div>

            <div className="table-container">
            <h3>All Recorded Metrics</h3>
              <table className="metrics-table">
                <thead>
                  <tr>
                  <th>Metric</th>
                  <th>Value</th>
                  <th>Time</th>
                  <th>Time of Day</th>
                  <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                {getFilteredAndSortedMetrics().map((item) => (
                  <tr key={item.id}>
                    <td>{item.metric}</td>
                    <td>{item.value}</td>
                    <td>{new Date(item.time).toLocaleString()}</td>
                    <td className={`time-of-day ${getTimeOfDay(item.time)}`}>
                      {getTimeOfDay(item.time).charAt(0).toUpperCase() + 
                       getTimeOfDay(item.time).slice(1)}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="edit-btn"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
