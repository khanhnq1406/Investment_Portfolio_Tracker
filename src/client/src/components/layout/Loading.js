import "./Loading.css";
const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-popup">
        <img src="/icon/loading.gif" />
        <div className="loading-text">Loading . . .</div>
      </div>
    </div>
  );
};

export default Loading;
