import Summary from "../components/home/Summary";
import Navbar from "../components/layout/Navbar";
const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <hr className="navbar-line" />
      <div className="portfolio-container">
        <Summary />
      </div>
    </div>
  );
};
export default Home;
