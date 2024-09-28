import "./Loading.css";
const Loading = ({ display }) => {
  return (
    <div className="loading-container" style={{ display }}>
      <div className="loading-popup">
        <img src="/icon/loading.gif" />
        <div className="loading-text">Loading . . .</div>
      </div>
    </div>
  );
};

export default Loading;
