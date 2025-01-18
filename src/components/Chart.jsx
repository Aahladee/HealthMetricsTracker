import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";
  import { Line } from "react-chartjs-2";
  import { isWithinLast24Hours } from "../utils/time";
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  
  export default function Chart(props) {
    const { filteredAndSortedMetrics, selectedMetric } = props;
    const getChartMetrics = () => {
      return filteredAndSortedMetrics.filter((item) =>
        isWithinLast24Hours(item.time)
      );
    };
    const chartMetrics = getChartMetrics();
  
    const chartData = {
      labels: chartMetrics.map((item) =>
        new Date(item.time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
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
          position: "top",
        },
        title: {
          display: true,
          text: "Metric Trends (Last 24 Hours)",
        },
        tooltip: {
          callbacks: {
            title: (context) => {
              const index = context[0].dataIndex;
              return new Date(chartMetrics[index].time).toLocaleString();
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Time",
          },
        },
        y: {
          title: {
            display: true,
            text: "Value",
          },
          beginAtZero: true,
        },
      },
    };
  
    return (
      <div className="chart-container">
        <Line data={chartData} options={chartOptions} />
        {chartMetrics.length === 0 && (
          <div className="no-data-message">
            No data available for the last 24 hours
          </div>
        )}
      </div>
    );
  }