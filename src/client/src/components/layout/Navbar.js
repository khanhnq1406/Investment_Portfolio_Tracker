import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { store } from "../../redux/store";
import "./Navbar.css";

const Navbar = () => {
  const { logoutUser } = useContext(AuthContext);
  const nameOfUser = store.getState().addUserReducer.user;
  const [navigateDisplay, setNavigateDisplay] = useState("none");

  return (
    <div className="navbar">
      <div className="logo">
        <div className="menu">
          <button
            onClick={(e) =>
              setNavigateDisplay(navigateDisplay === "none" ? "flex" : "none")
            }
          >
            <img src="icon/menu-vertical.png" />
          </button>
        </div>
        <img src="icon/bitcoin.png" />
        <div className="title">BitHodling</div>
      </div>

      <div className="navigate" style={{ display: navigateDisplay }}>
        <a className="dashboard" href="#home">
          Dashboard
        </a>
        <hr className="navigate-line" style={{ display: navigateDisplay }} />
        <a className="history" href="#home">
          History
        </a>
        <hr className="navigate-line" style={{ display: navigateDisplay }} />
        <a className="add-transaction" href="#home">
          Add Transaction
        </a>
        <hr className="navigate-line" style={{ display: navigateDisplay }} />
        <a className="watchlist" href="#home">
          Watchlist
        </a>
        <hr className="navigate-line" style={{ display: navigateDisplay }} />
      </div>

      <div className="setting" style={{ display: navigateDisplay }}>
        <div className="name">{nameOfUser}</div>
        <div className="logout">
          <button onClick={logoutUser}>
            <img src="icon/logout(white).png" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
