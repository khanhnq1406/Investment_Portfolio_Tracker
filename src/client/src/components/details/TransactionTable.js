import "./TransactionTable.css";
import { store } from "../../redux/store";
import { hideAddTransaction } from "../../redux/actions";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../utils/constants";
import axios from "axios";
const TransactionTable = (props) => {
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [row, setRow] = useState(10);
  const [numberOfPage, setNumberOfPage] = useState();
  const [pageList, setPageList] = useState();

  function handlePageNumber(event) {
    console.log(event.target.value);
  }
  useEffect(() => {
    const email = store.getState().addUserReducer.email;
    const fromPage = (Number(row) * (Number(page) - 1)) / 10;
    const toPage = (Number(row) * Number(page)) / 10;
    console.log(fromPage, toPage);
    axios
      .get(`${BACKEND_URL}/transaction/numberOfPage`, {
        params: {
          email: email,
          symbol: props.id,
        },
      })
      .then((response) => {
        const _numberOfPage = response.data;
        setNumberOfPage(_numberOfPage);
        const _pageList = [];
        for (let index = 0; index < _numberOfPage; index++) {
          _pageList.push(<option key={index + 1}>{index + 1}</option>);
        }
        setPageList(_pageList);
      })
      .catch(console.error());
    axios
      .get(`${BACKEND_URL}/transaction/table`, {
        params: {
          email: email,
          symbol: props.id,
          fromPage: fromPage,
          toPage: toPage,
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch(console.error());
  }, []);
  return (
    <div className="transaction-table">
      <div className="title">
        <div className="content">Transactions</div>
        <button
          onClick={(e) => {
            store.dispatch(hideAddTransaction({ cryptoName: props.id }));
          }}
        >
          <img src="/icon/plus.png" />
          <div>Add Transaction</div>
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Type</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Date & Time</th>
            <th>Cost</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>{data}</tbody>
      </table>

      <div className="row-setting">
        <div className="number-row">
          <p>Page</p>
          <select onChange={handlePageNumber}>{pageList}</select>
          <p style={{ marginLeft: "10px" }}>of {numberOfPage}</p>
        </div>
        <div className="number-row">
          <p>Rows</p>
          <select>
            <option>10</option>
            <option>20</option>
            <option>30</option>
            <option>50</option>
            <option>100</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
