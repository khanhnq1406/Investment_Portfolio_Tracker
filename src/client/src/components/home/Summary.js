import "./Summary.css";

const Summary = () => {
  return (
    <div className="summary">
      <div className="title">
        <div className="content">My Portfolio</div>
        <button>
          <img src="icon/plus.png" />
          <div>Add coin</div>
        </button>
      </div>

      <div className="grid-container">
        <div className="total-invested">
          <div className="value">$23,800.05</div>
          <div className="title">Total Invested</div>
        </div>
        <div className="current-balance">
          <div className="value">$50,653.71</div>
          <div className="title">Current Balance</div>
        </div>
        <div className="profit-lost">
          <div className="value">+$26,853.66</div>
          <div className="title">Total Profit / Lost</div>
        </div>
        <div className="portfolio-change">
          <div className="value">+$619.37</div>
          <div className="title">24h Portfolio Change</div>
        </div>
        <div className="holdings">5</div>
        <div className="performance">6</div>
      </div>
    </div>
  );
};

export default Summary;
