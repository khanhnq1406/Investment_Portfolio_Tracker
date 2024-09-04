import "./PortfolioTable.css";
const PortfolioTable = () => {
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

        <tbody>
          <tr>
            <td className="id">1</td>
            <td className="coin">BTC</td>
            <td className="price">$65,105.78</td>
            <td className="holdings-row">
              <p className="holdings-value">$28,034.82</p>
              <p className="holdings-unit">0.411636429904 BTC</p>
            </td>
            <td className="pnl">
              <p className="pnl-value">$16,137.28</p>
              <p className="pnl-percent">+136%</p>
            </td>
            <td className="average">$29,041.63</td>
            <td className="total">$11,539.63</td>
            <td className="actions">
              <div>
                <button>
                  <img src="icon/plus(white).png" />
                </button>
                <button>
                  <img src="icon/menu.png" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
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
