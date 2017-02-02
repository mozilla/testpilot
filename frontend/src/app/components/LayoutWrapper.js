import React, { PropTypes } from 'react';
import classnames from 'classnames';

const LayoutWrapper = ({ children, flexModifier, helperClass = null }) => {
  if (flexModifier) flexModifier = `layout-wrapper--${flexModifier}`;

  return (
    <div className={classnames('layout-wrapper', flexModifier, helperClass)} >
      { children }
    </div>
  );
};

export default LayoutWrapper;

LayoutWrapper.PropTypes = {
  flexModifier: PropTypes.string,
  helperClass: PropTypes.string
};
