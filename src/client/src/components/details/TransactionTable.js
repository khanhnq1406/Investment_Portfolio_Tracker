import "./TransactionTable.css";
import { store } from "../../redux/store";
import { hideAddTransaction } from "../../redux/actions";
import { useCallback, useEffect, useState } from "react";
import { BACKEND_URL } from "../../utils/constants";
import axios from "axios";

const TransactionTable = (props) => {
  const email = store.getState().addUserReducer.email;
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [row, setRow] = useState(10);
  const [numberOfPage, setNumberOfPage] = useState();
  const [pageList, setPageList] = useState();

  useEffect(() => {
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
  }, []);

  const setTable = useCallback(async (fromPage, toPage) => {
    const response = await axios
      .get(`${BACKEND_URL}/transaction/table`, {
        params: {
          email: email,
          symbol: props.id,
          fromPage: fromPage,
          toPage: toPage,
        },
      })
      .catch(console.error());
    const tableList = [];
    response.data.map((data) => {
      data.transactions.map((transaction) => {
        console.log(transaction);
        let date, time;
        if (transaction.datetime !== undefined) {
          const datetime = transaction.datetime.split("T");
          [date, time] = datetime;
          console.log(date, time);
        }
        tableList.push(
          <tr>
            <td className="id">{tableList.length + 1}</td>
            <td className="type">{transaction.type}</td>
            <td className="price">${parseFloat(Number(transaction.price))}</td>
            <td className="quantity">{transaction.quantity}</td>
            <td className="datetime">
              {date} {time}
            </td>
            <td className="cost">${parseFloat(Number(transaction.cost))}</td>
            <td className="action">Actions</td>
          </tr>
        );
      });
      setData(tableList);
    });
  }, []);

  useEffect(() => {
    const fromPage = (Number(row) * (Number(page) - 1)) / 10;
    const toPage = (Number(row) * Number(page)) / 10;
    setTable(fromPage, toPage);
  }, [setTable, page, row]);

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

          <select
            onChange={(event) => {
              setPage(event.target.value);
            }}
          >
            {pageList}
          </select>
          <p style={{ marginLeft: "10px" }}>of {numberOfPage}</p>
        </div>
        <div className="number-row">
          <p>Rows</p>
          <select
            onChange={(event) => {
              setRow(event.target.value);
            }}
          >
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
