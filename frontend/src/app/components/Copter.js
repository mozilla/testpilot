import React, { PropTypes } from 'react';
import classnames from 'classnames';


const Copter = ({ small = false, animation = null }) => {
  return (
    <div className={classnames('copter', { 'copter--small': small })}>
      <div className={classnames('copter__inner', animation)} />
    </div>
  );
};

export default Copter;

Copter.PropTypes = {
  small: PropTypes.boolean,
  animation: PropTypes.string
};

