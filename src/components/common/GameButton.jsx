import PropTypes from 'prop-types';

function GameButton({ onClick, disabled, className, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`game-button ${className}`}
    >
      {children}
    </button>
  );
}

GameButton.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

GameButton.defaultProps = {
  onClick: () => {},
  disabled: false,
  className: '',
};

export default GameButton;
