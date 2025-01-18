
import "./App.css";

import { useEffect, useState } from "react";
import HealthForm from "./components/HealthForm";
import { useDarkMode } from "./hooks/useDarkMode";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { getTimeOfDay } from "./utils/time";
import DataTable from "./components/DataTable";
import Chart from "./components/Chart";
import FilterBar from "./components/FilterBar";
import Header from "./components/Header";

function App() {
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [localValue, setLocalValue] = useLocalStorage("healthMetrics", []);

  const [metrics, setMetrics] = useState(localValue ?? []);
  const [formData, setFormData] = useState({ metric: "", value: "", time: "" });
  const [selectedMetric, setSelectedMetric] = useState("");
  const [showResults, setShowResults] = useState(
    localValue && localValue.length > 0
  );
  const [timeFilter, setTimeFilter] = useState("all"); // 'all', 'morning', 'afternoon', 'evening'
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [sortBy, setSortBy] = useState("time");
  const [isEditingMetric, setIsEditingMetric] = useState(null);
  const [filteredAndSortedMetrics, setFilteredAndSortedMetrics] = useState([]);

  useEffect(() => {
    setLocalValue(metrics);
    const filteredAndSorted = filterAndSortMetrics();
    setFilteredAndSortedMetrics(filteredAndSorted);
  }, [metrics, setLocalValue]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === "metric" ? value.toLowerCase() : value,
    }));
  };

  const handleEdit = (metric) => {
    setIsEditingMetric(metric);
    setFormData({
      metric: metric.metric,
      value: metric.value,
      time: metric.time,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.metric || !formData.value || !formData.time) {
      alert("All fields are required!");
      return;
    }

    if (isEditingMetric) {
      // Update existing metric
      setMetrics((prev) =>
        prev.map((item) =>
          item.id === isEditingMetric.id
            ? { ...formData, id: item.id, value: parseFloat(formData.value) }
            : item
        )
      );
      setIsEditingMetric(null);
    } else {
      // Add new metric
      const newMetric = {
        ...formData,
        id: Date.now(),
        value: parseFloat(formData.value),
      };
      setMetrics((prev) => [...prev, newMetric]);
    }

    setFormData({ metric: "", value: "", time: "" });
    setShowResults(true);
  };

  const handleDelete = (id) => {
    const newMetrics = metrics.filter((item) => item.id !== id);
    setMetrics(newMetrics);
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all metrics? This cannot be undone."
      )
    ) {
      setMetrics([]);
      setShowResults(false);
      handleCancelEdit();
    }
  };

  const handleCancelEdit = () => {
    setIsEditingMetric(null);
    setFormData({ metric: "", value: "", time: "" });
  };

  const filterAndSortMetrics = () => {
    let filtered = metrics;
    console.log("All metrics:", metrics); // Log all metrics

    // Metric type filter
    if (selectedMetric) {
      filtered = filtered.filter((item) => item.metric === selectedMetric);
      console.log("Filtered by metric:", filtered); // Log after metric filtering
    }

    // Time of day filter
    if (timeFilter !== "all") {
      filtered = filtered.filter(
        (item) => getTimeOfDay(item.time) === timeFilter
      );
      console.log("Filtered by time of day:", filtered); // Log after time filtering
    }

    // Log final sorted results
    const sorted = filtered.sort((a, b) => {
      if (sortBy === "time") {
        const comparison = new Date(b.time) - new Date(a.time);
        return sortOrder === "asc" ? -comparison : comparison;
      } else {
        const comparison = b.value - a.value;
        return sortOrder === "asc" ? -comparison : comparison;
      }
    });
    console.log("Final sorted results:", sorted);
    return sorted;
  };

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        handleClearAll={handleClearAll}
      />

      <main className="main-content">
        <HealthForm
          editingMetric={isEditingMetric}
          setEditingMetric={setIsEditingMetric}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleCancelEdit={handleCancelEdit}
        />

        {showResults && metrics.length > 0 && (
          <div className="results-container">
            <FilterBar
              metrics={metrics}
              selectedMetric={selectedMetric}
              setSelectedMetric={setSelectedMetric}
              timeFilter={timeFilter}
              setTimeFilter={setTimeFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />

            <Chart
              filteredAndSortedMetrics={filteredAndSortedMetrics}
              selectedMetric={selectedMetric}
            />

            <DataTable
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              filteredAndSortedMetrics={filteredAndSortedMetrics}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
