import React, { PropTypes } from 'react';

const CondensedHeader = ({ dataL10nId, children }) => {
  return (
    <div className="condensed-header">
      <div className="responsive-content-wrapper">
        <h1 className="header-content" data-l10n-id={dataL10nId} >{ children }</h1>
        <div className="logo-container">
          <div className="logo"></div>
        </div>
      </div>
    </div>
  );
};

export default CondensedHeader;

CondensedHeader.propTypes = {
  children: PropTypes.string.isRequired,
  dataL10nId: PropTypes.string.isRequired
};
