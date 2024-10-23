import PortfolioTable from "../components/home/PortfolioTable";
import Summary from "../components/home/Summary";
import Navbar from "../components/layout/Navbar";
import AddTransaction from "../components/layout/AddTransaction";
import Loading from "../components/layout/Loading";
import CurrencyConverter from "../components/layout/CurrencyConverter";
const Home = () => {
  return (
    <div className="home">
      <Loading />
      <AddTransaction />
      <Navbar />
      <CurrencyConverter />
      <hr className="navbar-line" />
      <div className="portfolio-container">
        <Summary />
        <PortfolioTable />
      </div>
    </div>
  );
};
export default Home;
