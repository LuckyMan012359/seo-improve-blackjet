import { useEffect, useRef, useState } from 'react';

/**
 * useIntersectionObserver
 *
 * @param {object} [options={}] - Options to be passed to the IntersectionObserver
 * @returns {array} - [isIntersecting, elementRef]
 * @description
 * A hook that uses the IntersectionObserver API to check if an element is intersecting
 * with the viewport.
 *
 * The hook returns an array. The first element is a boolean indicating whether the
 * element is intersecting with the viewport. The second element is a ref that should be
 * passed to the element which should be observed.
 *
 * The hook takes an options object as a parameter, which is passed to the
 * IntersectionObserver. The options can include the following properties:
 *
 * @prop {string} root - The element that is used as the viewport for checking
 *   visibility of the target. Must be the ancestor of the target. Defaults to the
 *   browser viewport if not specified or if null.
 * @prop {string} rootMargin - Margin around the root. Can have values similar to the
 *   CSS margin property, e.g. "10px 20px 30px 40px". The values can be percentages.
 *   This set of values serves to grow or shrink each side of the root element's
 *   bounding box before computing intersections. Defaults to "0px 0px 0px 0px".
 * @prop {number} threshold - A number between 0 and 1.0 indicating how much of the
 *   target must be visible within the root for the observer to trigger. A value of
 *   0 means the observer will trigger when the target is completely out of view.
 *   A value of 1.0 means the observer will trigger when the target is fully visible.
 *   Defaults to 0.
 *
 * @example
 * import { useIntersectionObserver } from 'react-intersection-observer';
 *
 * const MyComponent = () => {
 *   const [isIntersecting, elementRef] = useIntersectionObserver({
 *     threshold: 0.5,
 *   });
 *
 *   return (
 *     <div ref={elementRef}>
 *       {isIntersecting ? <p>Is intersecting</p> : <p>Not intersecting</p>}
 *     </div>
 *   );
 * };
 */
function useIntersectionObserver(options = {}) {
    
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(elementRef.current);
      }
    };
  }, [options]);

  return [isIntersecting, elementRef];
}

export default useIntersectionObserver;