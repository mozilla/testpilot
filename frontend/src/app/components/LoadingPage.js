import React from 'react';

export default function LoadingPage() {
  return (
    <div className="full-page-wrapper centered overflow-hidden">
      <div className="loader">
        <div className="loader-bar"></div>
        <div className="loader-bar"></div>
        <div className="loader-bar"></div>
        <div className="loader-bar"></div>
      </div>
    </div>
  );
}
