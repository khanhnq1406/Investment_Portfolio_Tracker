import "./PortfolioTable.css";
import { useState } from "react";
import { store } from "../../redux/store";
import { hideAddTransaction } from "../../redux/actions";
import { useNavigate } from "react-router-dom";
const PortfolioTable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  function selectHandler(event) {
    const selected = event.target.value.split(".");
    const selectType = selected[0];
    const selectParam = selected[1];
    if (selectType === "Details") {
      navigate(`/details/${selectParam}`);
    }
  }
  store.subscribe(() => {
    const result = store.getState().addSummaryDataReducer.data;
    if (result !== null) {
      const holdingTable = result.holdingTable;
      const table = holdingTable.map((holding, index) => {
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

        return (
          <tr>
            <td className="id">{index + 1}</td>
            <td className="coin">{holding.name}</td>
            <td className="price">${holding.price}</td>
            <td className="holdings-row">
              <p className="holdings-value">${holding.holdingValue}</p>
              <p className="holdings-unit">
                {holding.holdingQuantity !== null
                  ? parseFloat(holding.holdingQuantity.toFixed(8))
                  : 0}{" "}
                {holding.name}
              </p>
            </td>
            {holding.totalPNL > 0 ? (
              <td className="pnl" style={{ color: "#00A445" }}>
                <p className="pnl-value">${holding.totalPNL}</p>
                <p className="pnl-percent">+{holding.totalPNLPercent}%</p>{" "}
              </td>
            ) : holding.totalPNL < 0 ? (
              <td className="pnl" style={{ color: "#C3151C" }}>
                <p className="pnl-value">${holding.totalPNL}</p>
                <p className="pnl-percent">{holding.totalPNLPercent}%</p>{" "}
              </td>
            ) : (
              <td className="pnl">
                <p className="pnl-value">${holding.totalPNL}</p>
                <p className="pnl-percent">{holding.totalPNLPercent}%</p>{" "}
              </td>
            )}

            <td className="unrealized-pnl">
              ${holding.unrealizedPNL}
            </td>

            <td className="realized-pnl">
             ${holding.realizedPNL}
            </td>

            <td className="average">
              ${holding.avgPrice !== null ? parseFloat(holding.avgCost) : 0}
            </td>
            <td className="total">${holding.totalInvested}</td>
            <td className="remaining-cost">${holding.remainingCostBasis}</td>
            <td className="sold">${holding.sold}</td>
            <td className="actions">
              <div>
                <button
                  onClick={(e) => {
                    store.dispatch(
                      hideAddTransaction({ cryptoName: holding.name })
                    );
                  }}
                >
                  <img src="icon/plus(white).png" />
                </button>

                <select onChange={selectHandler}>
                  <option selected disabled></option>
                  <option value={`Details.${holding.name}`}>Details</option>
                </select>
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
            <th>Total PNL</th>
            <th>Unrealized PNL</th>
            <th>Realized PNL</th>
            <th>Average Cost</th>
            <th>Total Invested</th>
            <th>Remaining Cost</th>
            <th>Sold</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>{data}</tbody>
      </table>

      {/* <div className="row-setting">
        <div className="number-result">Showing 1 to 2 of 2 results</div>
        <div className="number-row">
          <p>Rows</p>
          <select>
            <option>5</option>
            <option>10</option>
            <option>100</option>
          </select>
        </div>
      </div> */}
    </div>
  );
};

export default PortfolioTable;
