import React, { PropTypes } from 'react';
import classnames from 'classnames';

const Banner = ({ children, condensed = false, background = false }) => {
  return (
    <div className={classnames('banner', {
      'banner--condensed': condensed,
      'banner--expanded': !condensed,
      'banner--background': background
    })}>
      { children }
    </div>
  );
};

export default Banner;

Banner.propTypes = {
  background: PropTypes.bool,
  condensed: PropTypes.bool,
  dataL10nId: PropTypes.string
};
