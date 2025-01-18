Health Metrics Tracker
A React-based web application for tracking and visualizing health metrics like heart rate, step count, or water intake. The application includes features like data input, visualization, filtering, sorting, and data persistence.

Features
Health Data Input:

Input health metrics using a form with fields for metric name, value, and timestamp.
Validations ensure proper data entry to prevent empty or invalid inputs.
Data Visualization:

View data in a sortable table, sorted by time of entry (most recent first).
Visualize trends using a line chart for selected metrics.
Display data for the last 24 hours or the current day.
Filtering and Sorting:

Provide options to filter data within the day (e.g., morning, afternoon, evening).
Allow sorting the data by ascending or descending order based on the metric's value.
Dark/Light Mode Toggle:

Switch between dark and light themes.
Data Export:

Export health metrics data as a CSV file.
Responsive Design:

Optimized for both mobile and desktop screens.
Data Persistence:

Uses localStorage to persist data through page reloads.
Validation:

Validates form inputs, including ensuring timestamps are within the last 24 hours.
Installation
Clone the repository:

git clone https://github.com/your-username/health-metrics-tracker.git
Navigate to the project directory:

cd health-metrics-tracker
Install dependencies:

npm install
Start the development server:

npm start
Open the app in your browser at http://localhost:3000.

Deployed Application
Access the deployed application here: Health Metrics Tracker

Hooks Explanation
useDarkMode Hook:
Purpose: Manages the dark and light theme of the application.
Logic:
Retrieves the user's theme preference from localStorage.
Provides a toggle function to switch between themes.
Updates the DOM's className to apply the corresponding styles dynamically.
useLocalStorage Hook:
Purpose: Simplifies state management with localStorage to persist data between page reloads.
Logic:
Checks if a value exists in localStorage for the given key.
Initializes state with the retrieved value or a default value.
Updates localStorage whenever the state changes.
Folder Structure
The folder structure is designed to ensure modularity and scalability:

src/
├── components/         # Reusable components
│   ├── HealthForm      # Form for data input
│   ├── DataTable       # Table for data visualization
│   ├── Chart           # Line chart for trends
│   ├── FilterBar       # Filter and sorting controls
├── hooks/              # Custom React hooks
│   ├── useLocalStorage # Hook for managing localStorage
│   ├── useDarkMode     # Hook for managing dark/light mode
├── utils/              # Utility functions (e.g., CSV export)
├── App.css             # Global and component-specific styles
├── App.js              # Main application component
└── index.js            # Entry point of the application
Modularity:
Components: Each component handles a specific UI functionality (e.g., form, table, chart) and is self-contained with its own styles.
Hooks: Custom hooks encapsulate logic for reusability and separation of concerns.
Utils: Utility functions (e.g., CSV export) are separated for cleaner code and easier testing.
Validation Logic
Metric Name: Required field to ensure meaningful data entry.
Value: Must be a positive number to prevent invalid metrics.
Timestamp: Ensures entries are within the last 24 hours to maintain relevance.
Future Enhancements
Add the ability to edit or delete previously entered data.
Integrate with external APIs for fetching real-time health data.
Include more advanced filtering options.
Support for additional data visualization types.