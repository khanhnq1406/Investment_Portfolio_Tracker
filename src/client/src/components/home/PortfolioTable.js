import "./PortfolioTable.css";
import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../utils/constants";
import { store } from "../../redux/store";
import { hideAddTransaction } from "../../redux/actions";
import { socket } from "./Summary";
const PortfolioTable = () => {
  const [data, setData] = useState(null);
  store.subscribe(() => {
    const result = store.getState().addSummaryDataReducer.data;
    if (result !== null) {
      const holdingTable = result.holdingTable;
      const table = holdingTable.map((holding, index) => {
        console.log(holding, parseFloat(Number(holding.price)));
        const holdingValue =
          Math.floor(
            Number(holding.price) * Number(holding.holdingQuantity) * 100
          ) / 100;
        const profitLoss =
          Math.floor((Number(holdingValue) - Number(holding.totalCost)) * 100) /
          100;
        const pnl =
          Math.floor(
            (Number(profitLoss) / Number(holding.totalCost)) * 100 * 100
          ) / 100;
        console.log(profitLoss, pnl);
        return (
          <tr>
            <td className="id">{index}</td>
            <td className="coin">{holding.name}</td>
            <td className="price">${parseFloat(Number(holding.price))}</td>
            <td className="holdings-row">
              <p className="holdings-value">${holdingValue}</p>
              <p className="holdings-unit">
                {holding.holdingQuantity} {holding.name}
              </p>
            </td>
            {profitLoss > 0 ? (
              <td className="pnl">
                <p className="pnl-value" style={{ color: "#00A445" }}>
                  {profitLoss}
                </p>
                <p className="pnl-percent" style={{ color: "#00A445" }}>
                  +{pnl}
                </p>{" "}
              </td>
            ) : profitLoss < 0 ? (
              <td className="pnl">
                <p className="pnl-value" style={{ color: "#C3151C" }}>
                  {profitLoss}
                </p>
                <p className="pnl-percent" style={{ color: "#C3151C" }}>
                  {pnl}
                </p>{" "}
              </td>
            ) : (
              <td className="pnl">
                <p className="pnl-value">$16,137.28</p>
                <p className="pnl-percent">+136%</p>{" "}
              </td>
            )}

            <td className="average">$29,041.63</td>
            <td className="total">$11,539.63</td>
            <td className="actions">
              <div>
                <button
                  onClick={(e) => {
                    store.dispatch(hideAddTransaction({ cryptoName: "BTC" }));
                  }}
                >
                  <img src="icon/plus(white).png" />
                </button>
                <button>
                  <img src="icon/menu.png" />
                </button>
              </div>
            </td>
          </tr>
        );
      });
      setData(table);
    }
  });
  return (
    <div className="portfolio-table">
      <hr className="navbar-line" />
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Coin</th>
            <th>Price</th>
            <th>Holdings</th>
            <th>PNL</th>
            <th>Average Cost</th>
            <th>Total Cost</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>{data}</tbody>
      </table>

      <div className="row-setting">
        <div className="number-result">Showing 1 to 2 of 2 results</div>
        <div className="number-row">
          <p>Rows</p>
          <select>
            <option>5</option>
            <option>10</option>
            <option>100</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PortfolioTable;
