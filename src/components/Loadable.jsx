import { Suspense } from 'react';

// project import
import Loader from './Loader.jsx';

/**
 * Returns a higher-order component that wraps the given `Component` with a `Suspense` component
 * and a `Loader` component as a fallback. The `Component` is rendered with the provided `props`.
 *
 * @param {React.ComponentType} Component - The component to be wrapped.
 * @return {React.ComponentType} A higher-order component that wraps the `Component` with a `Suspense`
 * and `Loader` component.
 */
const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<Loader />}>
      <Component {...props} />
    </Suspense>
  );

export default Loadable;
