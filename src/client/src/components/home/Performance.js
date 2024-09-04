import "./Performance.css";

import { useState } from "react";

import { Line } from "react-chartjs-2";
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
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Performance = () => {
  const periodName = {
    D7: 0,
    M1: 1,
    M3: 2,
    Y1: 3,
  };
  const [periodActive, setPeriodActive] = useState([
    "active",
    null,
    null,
    null,
  ]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          boxHeight: 7,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#2e3032", // Color of the x-axis labels
        },
        grid: {
          display: false,
          //   color: "#ffffff44", // Color of the x-axis grid lines
        },
        border: {
          // width: 2,
          // color: "#fff", // <-------------- Color of the x-axis
        },
      },
      y: {
        ticks: {
          color: "#2e3032", // Color of the x-axis labels
        },
        grid: {
          color: "#2e3032", // Color of the x-axis grid lines
        },
        border: {
          display: false,
        },
      },
    },
  };

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];

  const datas = {
    January: 100,
    February: 200,
    March: 50,
    April: 400,
    May: 300,
    June: 150,
    July: 100,
  };
  const data = {
    labels,
    datasets: [
      {
        label: "USD",
        data: labels.map((label) => datas[label]),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        tension: 0.4,
      },
    ],
  };

  const periodHandle = (event) => {
    event.preventDefault();
    const period = event.target.value;
    setPeriodActive(
      periodActive.map((element, index) =>
        Number(period) === Number(index) ? "active" : null
      )
    );
  };
  return (
    <div className="performance-wrapper">
      <div className="title-period-wrapper">
        <div className="performance-title">Performance</div>
        <div className="performance-period">
          <button
            onClick={periodHandle}
            value={periodName.D7}
            className={periodActive[periodName.D7]}
          >
            7d
          </button>
          <button
            onClick={periodHandle}
            value={periodName.M1}
            className={periodActive[periodName.M1]}
          >
            1m
          </button>
          <button
            onClick={periodHandle}
            value={periodName.M3}
            className={periodActive[periodName.M3]}
          >
            3m
          </button>
          <button
            onClick={periodHandle}
            value={periodName.Y1}
            className={periodActive[periodName.Y1]}
          >
            1y
          </button>
        </div>
      </div>
      <div className="performance-chart">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default Performance;
