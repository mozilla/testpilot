
import React from 'react';


class Switch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnabling: false,
      isDisabling: false
    };
  }

  getProgress() {
    const { progress } = this.props;
    if (progress === Infinity) {
      return 100;
    } else if (progress === -Infinity) {
      return 0;
    }
    return progress;
  }

  render() {
    const {
      className, disabled, label, name, progress, success
    } = this.props;

    const identifier = `install-button-${name}`;
    const hasProgress = progress !== undefined;
    const classList = [
      'Switch',
      className,
      progress === Infinity ? 'Switch--indefinite' : '',
      progress === -Infinity ? 'Switch--indefinite-reverse' : '',
      hasProgress && progress !== Infinity && progress !== -Infinity ? 'Switch--progress' : '',
      success ? 'Switch--success' : ''
    ];
    const classes = classList.join(' ');

    return (
      <div className={classes} onClick={
          (e) => {
            e.preventDefault();
            if (this.props.checked) {
              this.props.onDisable(e);
            } else {
              this.props.onEnable(e);
            }
          }
        }
        data-progress={hasProgress ? this.getProgress() : 0}>
        <input
          id={identifier}
          className="visually-hidden"
          checked={this.props.checked}
          disabled={disabled}
          onChange={() => {}}
          type="checkbox" />
        <label htmlFor={identifier}>
          {hasProgress ? <div className="Switch-progress-bar" /> : null}
          <span className="visually-hidden">{label}</span>
        </label>
      </div>
    );
  }
}

Switch.propTypes = {
  checked: React.PropTypes.bool,
  className: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  label: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func,
  onClick: React.PropTypes.func,
  onEnable: React.PropTypes.func.isRequired,
  onDisable: React.PropTypes.func.isRequired,
  progress: React.PropTypes.number,
  success: React.PropTypes.bool
};

Switch.defaultProps = {
  checked: false,
  disabled: false,
  success: false
};


export default Switch;
