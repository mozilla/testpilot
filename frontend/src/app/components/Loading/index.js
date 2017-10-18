import React from 'react';

import './index.scss';

const Loading = () => {
  return (
    <div className="full-page-wrapper centered overflow-hidden">
      <div className="loading-wrapper">
        <div className="loading">
          <div className="loading-bar"></div>
          <div className="loading-bar"></div>
          <div className="loading-bar"></div>
          <div className="loading-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
