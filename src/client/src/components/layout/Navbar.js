const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">
        <img src="icon/bitcoin.png" />
        <div className="title">BitHodling</div>
      </div>
      <div className="navigate">
        <a href="#home">Dashboard</a>
        <a href="#home">History</a>
        <a href="#home">Add Transaction</a>
        <a href="#home">Watchlist</a>
      </div>
      <div className="setting"></div>
    </div>
  );
};

export default Navbar;
