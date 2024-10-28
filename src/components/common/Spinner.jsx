import PropTypes from 'prop-types';
import { LoaderCircleIcon } from "lucide-react";
import { cn } from '../../lib/utils';

const Spinner = ({ className }) => {
  return <LoaderCircleIcon className={cn("size-4 animate-spin", className)} />;
};

Spinner.propTypes = {
  className: PropTypes.string,
};

export default Spinner;
