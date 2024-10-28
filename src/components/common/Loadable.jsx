import { Suspense } from "react";
import Spinner from "./Spinner";

const Loadable = (Component) => {
  const LoadableComponent = (props) => (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <Spinner aria-label="Default status example" />
        </div>
      }
    >
      <Component {...props} />
    </Suspense>
  );

  LoadableComponent.displayName = `Loadable(${Component.displayName || Component.name || 'Component'})`;
  return LoadableComponent;
};

export default Loadable;
