
export default function HealthForm(props) {
    const {
      editingMetric,
      formData,
      handleInputChange,
      handleSubmit,
      handleCancelEdit,
    } = props;
    return (
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
              required
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
              required
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
              required
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
                onClick={handleCancelEdit}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }
  