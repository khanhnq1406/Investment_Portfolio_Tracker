import "./Holdings.css";

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Colors,
  plugins,
  scales,
} from "chart.js";

ChartJS.register(Colors, ArcElement, Tooltip, Legend, plugins, scales);

const Holdings = () => {
  const data = {
    labels: [`BTC 35%`, `ETH 30%`, `BNB 20%`, `WLD 15%`],
    datasets: [
      {
        data: [35, 30, 20, 15],
        borderWidth: 0,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: {
          usePointStyle: true,
          boxHeight: 10,
        },
      },
    },
    layout: {
      padding: {
        left: 10,
      },
    },
  };
  return (
    <div className="holdings-wrapper">
      <div className="holdings-title">Holdings</div>
      <div className="holdings-chart">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default Holdings;
