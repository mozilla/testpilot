
import React from 'react';

type SwitchProps = {
  checked: boolean,
  className: string,
  disabled: boolean,
  label: string,
  name: string,
  onChange: Function,
  onClick: Function,
  onEnable: Function,
  onDisable: Function;
  progress: number,
  success: boolean
};

type SwitchState = {
  isEnabling: boolean,
  isDisabling: boolean
};

class Switch extends React.Component {
  props: SwitchProps
  state: SwitchState

  constructor(props: SwitchProps) {
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
      'switch',
      className,
      progress === Infinity ? 'switch--indefinite' : '',
      progress === -Infinity ? 'switch--indefinite-reverse' : '',
      hasProgress && progress !== Infinity && progress !== -Infinity ? 'switch--progress' : '',
      success ? 'switch--success' : ''
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
          {hasProgress ? <div className="switch-progress-bar" /> : null}
          <span className="visually-hidden">{label}</span>
        </label>
      </div>
    );
  }
}


Switch.defaultProps = {
  checked: false,
  disabled: false,
  success: false
};


export default Switch;
