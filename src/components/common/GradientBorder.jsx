import PropTypes from 'prop-types';

const GradientBorder = ({ children, className = '' }) => {
  return (
    <div className={`inline-block bg-gradient-to-br ${className} `}>
      <div className="flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

GradientBorder.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default GradientBorder;
