# Health Metrics Tracker

A React-based web application for tracking and visualizing health metrics like heart rate, step count, or water intake. The application includes features like data input, visualization, filtering, sorting, and data persistence.

---

## Features

1. *Health Data Input:*
   - Input health metrics using a form with fields for metric name, value, and timestamp.
   - Validations ensure proper data entry to prevent empty or invalid inputs.

2. *Data Visualization:*
   - View data in a sortable table, sorted by time of entry (most recent first).
   - Visualize trends using a line chart for selected metrics.
   - Display data for the last 24 hours or the current day.

3. *Filtering and Sorting:*
   - Provide options to filter data within the day (e.g., morning, afternoon, evening).
   - Allow sorting the data by ascending or descending order based on the metric's value.

4. *Dark/Light Mode Toggle:*
   - Switch between dark and light themes.

5. *Data Export:*
   - Export health metrics data as a CSV file.

6. *Responsive Design:*
   - Optimized for both mobile and desktop screens.

7. *Data Persistence:*
   - Uses localStorage to persist data through page reloads.

8. *Validation:*
   - Validates form inputs, including ensuring timestamps are within the last 24 hours.

---

## Installation

1. Clone the repository:
   bash
   git clone https://github.com/Aahladee/HealthMetricsTracker.git
   

2. Navigate to the project directory:
   bash
   cd health-metrics-tracker
   

3. Install dependencies:
   bash
   npm install
   

4. Start the development server:
   bash
   npm start
   

5. Open the app in your browser at http://localhost:3000.

---

## Deployed Application

Access the deployed application here: [Health Metrics Tracker](https://healthmetrixtracker.netlify.app)

---

## Hooks Explanation

### useDarkMode Hook:
- *Purpose*: Manages the dark and light theme of the application.
- *Logic*:
  - Retrieves the user's theme preference from localStorage.
  - Provides a toggle function to switch between themes.
  - Updates the DOM's className to apply the corresponding styles dynamically.

### useLocalStorage Hook:
- *Purpose*: Simplifies state management with localStorage to persist data between page reloads.
- *Logic*:
  - Checks if a value exists in localStorage for the given key.
  - Initializes state with the retrieved value or a default value.
  - Updates localStorage whenever the state changes.

---

## Folder Structure

The folder structure is designed to ensure modularity and scalability:


src/
├── components/         # Reusable components
│   ├── HealthForm/     # Form for data input
│   ├── DataTable/      # Table for data visualization
│   ├── Chart/          # Line chart for trends
│   ├── FilterBar/      # Filter and sorting controls
├── hooks/              # Custom React hooks
│   ├── useLocalStorage # Hook for managing localStorage
│   ├── useDarkMode     # Hook for managing dark/light mode
├── utils/              # Utility functions (e.g., CSV export)
├── App.css             # Global and component-specific styles
├── App.js              # Main application component
└── index.js            # Entry point of the application


### Modularity:
- *Components*: Each component handles a specific UI functionality (e.g., form, table, chart) and is self-contained with its own styles.
- *Hooks*: Custom hooks encapsulate logic for reusability and separation of concerns.
- *Utils*: Utility functions (e.g., CSV export) are separated for cleaner code and easier testing.

---

## Validation Logic

- *Metric Name*: Required field to ensure meaningful data entry.
- *Value*: Must be a positive number to prevent invalid metrics.
- *Timestamp*: Ensures entries are within the last 24 hours to maintain relevance.

---

## Future Enhancements

1. Add the ability to edit or delete previously entered data.
2. Integrate with external APIs for fetching real-time health data.
3. Include more advanced filtering options.
4. Support for additional data visualization types.