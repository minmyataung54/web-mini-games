import PropTypes from "prop-types";
import { cn } from "../../lib/utils";

function GradientText({
  children,
  from = "from-[#E5C401]",
  to = "to-[#C27501]",
  className,
  ...props
}) {
  return (
    <span
      className={cn(
        "bg-gradient-to-b bg-clip-text text-transparent",
        from,
        to,
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

GradientText.propTypes = {
  children: PropTypes.node.isRequired,
  from: PropTypes.string,
  to: PropTypes.string,
  className: PropTypes.string,
};

export default GradientText;
