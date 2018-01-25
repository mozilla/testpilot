import React from "react";
import classnames from "classnames";

import "./index.scss";

const LayoutWrapper = ({ children, flexModifier, helperClass = null }) => {
  if (flexModifier) flexModifier = `layout-wrapper--${flexModifier}`;

  return (
    <div className={classnames("layout-wrapper", flexModifier, helperClass)} >
      { children }
    </div>
  );
};

export default LayoutWrapper;

// TODO Port propTypes to FlowTypes for LayoutWrapper

// LayoutWrapper.propTypes = {
//   flexModifier: PropTypes.string,
//   helperClass: PropTypes.string
// };
