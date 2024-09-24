import "./TransactionTable.css";
import { store } from "../../redux/store";
import { hideAddTransaction } from "../../redux/actions";
import { useCallback, useEffect, useState } from "react";
import { BACKEND_URL, CONFIRMATION_TYPE } from "../../utils/constants";
import axios from "axios";
import Confirmation from "../layout/Confirmation";

const TransactionTable = (props) => {
  const email = store.getState().addUserReducer.email;
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [row, setRow] = useState(10);
  const [numberOfPage, setNumberOfPage] = useState();
  const [pageList, setPageList] = useState();
  const [transactionLength, setTransactionLength] = useState();
  const [confirmation, setConfirmation] = useState();

  const createPageList = useCallback(async (_numberOfPage) => {
    const _pageList = [];
    for (let index = 0; index < _numberOfPage; index++) {
      _pageList.push(<option key={index + 1}>{index + 1}</option>);
    }
    setPageList(_pageList);
    setPage(1);
    setNumberOfPage(_numberOfPage);
  }, []);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/transaction/numberOfPage`, {
        params: {
          email: email,
          symbol: props.id,
        },
      })
      .then((response) => {
        setTransactionLength(response.data);
        const _numberOfPage = Math.ceil(response.data / row);
        createPageList(_numberOfPage);
      })
      .catch(console.error());
  }, []);

  const closeConfirmationBox = () => {
    setConfirmation(null);
  };

  const deleteTransaction = (event, id, cost, price, quantity) => {
    setConfirmation(
      <Confirmation
        closeConfirmationBox={closeConfirmationBox}
        payload={{
          type: CONFIRMATION_TYPE.DELETE_TRANSACTION,
          id: id,
          cost: cost,
          price: price,
          quantity: quantity,
          symbol: props.id,
        }}
      />
    );
  };
  const setTable = useCallback(async (_page, _row) => {
    console.log(row);
    const response = await axios
      .get(`${BACKEND_URL}/transaction/table`, {
        params: {
          email: email,
          symbol: props.id,
          row: _row,
          page: _page,
        },
      })
      .catch(console.error());
    const tableList = [];
    console.log(response.data);
    const data = response.data;
    data.map((transaction) => {
      let date, time;
      if (transaction.datetime !== undefined) {
        const datetime = transaction.datetime.split("T");
        [date, time] = datetime;
      }
      tableList.push(
        <tr>
          <td className="id">{tableList.length + 1}</td>
          <td
            className="type"
            style={{
              color: transaction.type === "Buy" ? "#00A445" : "#C3151C",
            }}
          >
            {transaction.type}
          </td>
          <td className="price">${parseFloat(Number(transaction.price))}</td>
          <td
            className="quantity"
            style={{
              color: transaction.type === "Buy" ? "#00A445" : "#C3151C",
            }}
          >
            {transaction.quantity}
          </td>
          <td className="datetime">
            {date} {time}
          </td>
          <td className="cost">${parseFloat(Number(transaction.cost))}</td>
          <td className="actions">
            <div>
              <button className="edit-transaction">
                <img src="/icon/editing.png" />
              </button>
              <button
                className="delete-transaction"
                onClick={(e) =>
                  deleteTransaction(
                    e,
                    transaction._id,
                    transaction.cost,
                    transaction.price,
                    transaction.quantity
                  )
                }
              >
                <img src="/icon/remove.png" />
              </button>
            </div>
          </td>
        </tr>
      );
    });
    setData(tableList);
  }, []);

  useEffect(() => {
    setTable(page, row);
  }, [setTable, page, row]);

  return (
    <div className="transaction-table">
      {confirmation}
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
              const _row = Number(event.target.value);
              setRow(_row);
              createPageList(Math.ceil(Number(transactionLength) / _row));
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
