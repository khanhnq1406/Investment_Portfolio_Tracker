import { useEffect, useState } from "react";
import "./CurrencyConverter.css";

const usdtPriceApi =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usdt.json";
const vndFormat = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});
const usdFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const CurrencyConverter = () => {
  const [usdt, setUsdt] = useState();
  const [vnd, setVnd] = useState();
  const [convertBox, setConvertBox] = useState("none");
  const [usdtPrice, setUsdtPrice] = useState();

  useEffect(() => {
    fetch(usdtPriceApi).then(async (response) => {
      const json = await response.json();
      setUsdtPrice(json.usdt.vnd);
    });
  }, []);

  const usdtToVnd = (event) => {
    const usdtValue = event.target.value;
    setUsdt(usdtValue);
    console.log(usdtValue);
    const vnd = Number(usdtPrice) * Number(usdtValue);

    setVnd(vndFormat.format(parseInt(vnd)));
  };

  const vndToUsdt = (event) => {
    const vndValue = event.target.value;
    setVnd(vndValue);
    const usdt = Number(vndValue) / Number(usdtPrice);

    setUsdt(usdFormat.format(parseInt(usdt)));
  };
  return (
    <div className="currency-converter">
      <div className="currency-convert-popup" style={{ display: convertBox }}>
        <div className="edit-popup">
          <button
            className="close-btn"
            onClick={(e) => {
              setConvertBox("none");
            }}
          >
            <img src="/icon/cross.png" />
          </button>
          <div className="transaction-title">Currency Converter </div>
          <form className="transaction-form">
            <div className="form-group">
              <div>USDT</div>
              <input
                type="text"
                value={usdt}
                onChange={usdtToVnd}
                required
              ></input>
            </div>
            <div className="form-group">
              <div>VND</div>
              <input
                type="text"
                value={vnd}
                onChange={vndToUsdt}
                required
              ></input>
            </div>
          </form>
        </div>
      </div>
      <div className="convert-icon">
        <button onClick={(e) => setConvertBox("flex")}>
          <img src="/icon/convert.png" />
        </button>
      </div>
    </div>
  );
};

export default CurrencyConverter;
