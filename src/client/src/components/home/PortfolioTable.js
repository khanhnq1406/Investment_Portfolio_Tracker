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
    console.log(selectParam);
    if (selectType === "Details") {
      console.log("Go to detail");
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
            <td className="price">${parseFloat(Number(holding.price))}</td>
            <td className="holdings-row">
              <p className="holdings-value">${holdingValue}</p>
              <p className="holdings-unit">
                {parseFloat(holding.holdingQuantity.toFixed(8))} {holding.name}
              </p>
            </td>
            {profitLoss > 0 ? (
              <td className="pnl" style={{ color: "#00A445" }}>
                <p className="pnl-value">${profitLoss}</p>
                <p className="pnl-percent">+{pnl}%</p>{" "}
              </td>
            ) : profitLoss < 0 ? (
              <td className="pnl" style={{ color: "#C3151C" }}>
                <p className="pnl-value">${profitLoss}</p>
                <p className="pnl-percent">{pnl}%</p>{" "}
              </td>
            ) : (
              <td className="pnl">
                <p className="pnl-value">${profitLoss}</p>
                <p className="pnl-percent">{pnl}%</p>{" "}
              </td>
            )}

            <td className="average">
              ${parseFloat(holding.avgPrice.toFixed(2))}
            </td>
            <td className="total">
              ${parseFloat(Number(holding.totalCost).toFixed(2))}
            </td>
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
            <th>PNL</th>
            <th>Average Cost</th>
            <th>Total Cost</th>
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
