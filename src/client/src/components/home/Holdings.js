import "./Holdings.css";
import { store } from "../../redux/store";

import { useEffect, useState } from "react";

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
  const [chart, setChart] = useState(null);
  const createChart = () => {
    const summaryData = store.getState().addSummaryDataReducer.data;
    if (summaryData !== null) {
      const holdingList = summaryData.holdingList;
      const totalInvested = summaryData.totalInvested;
      const data = {
        labels: holdingList.map((index) => {
          const percentage =
            Math.floor(
              (Number(index[Object.keys(index)[0]]) / Number(totalInvested)) *
                100
            ) / 100;
          return `${Object.keys(index)[0]} ${percentage}%`;
        }),
        datasets: [
          {
            data: holdingList.map((index) => {
              return index[Object.keys(index)[0]];
            }),
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
          colors: {
            enabled: true,
          },
        },
        layout: {
          padding: {
            left: 10,
          },
        },
      };
      setChart(<Doughnut data={data} options={options} />);
    }
  };

  if (chart === null) {
    createChart();
  }

  return (
    <div className="holdings-wrapper">
      <div className="holdings-title">Holdings</div>
      <div className="holdings-chart">{chart}</div>
    </div>
  );
};

export default Holdings;
