
import { exportToCSV } from "../utils/exportToCSV";
import { getTimeOfDay } from "../utils/time";

export default function DataTable(props) {
  const { handleEdit, handleDelete, filteredAndSortedMetrics } = props;

  const handleExport = () => {
    const fileName = "metrics";
    const data = filteredAndSortedMetrics.map((item) => ({
      Metric: item.metric,
      Value: item.value,
      Time: new Date(item.time).toLocaleString(),
      "Time of Day": getTimeOfDay(item.time),
    }));
    exportToCSV(data, fileName);
  };

  return (
    <div className="table-container">
      <div className="d-flex justify-content-between align-items-center">
        <h3>All Recorded Metrics</h3>
        <button className="export-btn" onClick={handleExport}>
          Export to CSV
        </button>
      </div>
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
          {filteredAndSortedMetrics.map((item) => (
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
                  <button className="edit-btn" onClick={() => handleEdit(item)}>
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
  );
}
