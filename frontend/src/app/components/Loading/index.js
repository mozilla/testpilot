import React from "react";

import "./index.scss";

const Loading = () => {
  return (
    <div className="loading-wrapper">
      <div className="loading">
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
      </div>
    </div>
  );
};

export default Loading;
