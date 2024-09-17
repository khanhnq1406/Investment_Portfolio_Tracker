import axios from "axios";
import { useEffect, useState } from "react";
import { store } from "../../redux/store";
import { socket } from "../../views/Details";
const DetailsSummary = (props) => {
  const [symbol, setSymbol] = useState("");
  const [price, setPrice] = useState();
  useEffect(() => {
    axios
      .get(
        `https://www.binance.com/bapi/composite/v1/public/marketing/tardingPair/detail?symbol=${props.id}`
      )
      .then((response) => {
        setSymbol(response.data.data[0].symbol);
      })
      .catch(console.error());
  }, []);
  useEffect(() => {
    const email = store.getState().addUserReducer.email;
    socket.emit("getPrice", {
      currency: props.id,
    });

    const interval = setInterval(() => {
      socket.emit("getPrice", {
        currency: props.id,
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    socket.on("getPriceResponse", (data) => {
      setPrice(parseFloat(Number(data)));
    });
  }, [socket]);
  return (
    <div className="details-summary">
      <div className="coin-name">
        <p className="symbol">{symbol}</p>
        <p className="pair-symbol">{props.id}</p>
      </div>
      <div className="detail-price">${price}</div>
    </div>
  );
};

export default DetailsSummary;
