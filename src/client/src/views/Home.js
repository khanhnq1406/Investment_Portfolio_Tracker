import PortfolioTable from "../components/home/PortfolioTable";
import Summary from "../components/home/Summary";
import Navbar from "../components/layout/Navbar";
import AddTransaction from "../components/layout/AddTransaction";
const Home = () => {
  return (
    <div className="home">
      <AddTransaction />
      <Navbar />
      <hr className="navbar-line" />
      <div className="portfolio-container">
        <Summary />
        <PortfolioTable />
      </div>
    </div>
  );
};
export default Home;
