import "./Holdings.css";

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Colors,
  plugins,
} from "chart.js";

ChartJS.register(Colors, ArcElement, Tooltip, Legend, plugins);

const Holdings = () => {
  const data = {
    labels: ["BTC", "ETH", "BNB", "WLD"],
    datasets: [
      {
        data: [35, 30, 20, 15],
        borderWidth: 0,
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        display: true,
        position: "right",
        usePointStyle: true,
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
