import { memo } from "react";

/**
 * CommonLabel is a component that displays a label with an optional label
 * that will be rendered in a lighter color.
 *
 * @param {string} label - The main label.
 * @param {string} [optionalLabel] - The optional label that will be rendered
 *   in a lighter color.
 * @param {string} [className] - The CSS class name to be applied to the
 *   component.
 * @returns {React.ReactElement} The rendered component.
 */
const CommonLabel = ({ label, optionalLabel, className = '' }) => {
  return (
    <div className={`common-label ${className}`}>
      {label}
      {optionalLabel && <span className='optional-label'>{optionalLabel}</span>}
    </div>
  );
};

export default memo(CommonLabel);
