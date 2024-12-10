import React from 'react';

const sizeClasses = {
  txtHauoraMedium16WhiteA700: 'font-medium',
  txtHauoraMedium14Gray100: 'font-medium',
  txtHauoraBold32WhiteA700: 'font-bold',
  txtHauoraExtraLight9: 'font-thin',
  txtHauoraBold16: 'font-bold',
  txtHauoraSemiBold32: 'font-semibold',
  txtHauoraBold14: 'font-bold',
  txtHauoraMedium40: 'font-medium',
  txtHauoraSemiBold18: 'font-semibold',
  txtHauoraBold32: 'font-bold',
  txtHauoraRegular14: 'font-normal',
  txtHauoraSemiBold32Gray100: 'font-semibold',
  txtHauoraMedium116: 'font-medium',
  txtHauoraRegular16: 'font-normal',
  txtHauoraMedium40Gray100: 'font-medium',
  txtHauoraSemiBold16: 'font-semibold',
  txtHauoraMedium14WhiteA700: 'font-medium',
  txtHauoraLight16: 'font-light',
  txtHauoraMedium14: 'font-medium',
  txtHauoraMedium36: 'font-medium',
  txtHauoraSemiBold40: 'font-semibold',
  txtHauoraSemiBold20: 'font-semibold',
  txtHauoraMedium16: 'font-medium',
  txtHauoraSemiBold26: 'font-semibold',
  txtHauoraRegular25: 'font-normal',
  txtHauoraSemiBold28: 'font-semibold',
};

const Text = ({ children, className = '', size, as, ...restProps }) => {
  // const Component = as || 'p';

  return (
    <p className={`text-left ${className} ${size && sizeClasses[size]}`} {...restProps}>
      {children}
    </p>
  );
};

export { Text };

/**
 * Renders a component that wraps its children inside nested div elements with a specific class name.
 *
 * @param {object} props - The properties object.
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the component.
 * @return {JSX.Element} The JSX code for the component.
 */
export const TextStrick = ({ children, ...props }) => {
  return (
    <span className='strick-text'>
      <span {...props}>{children}</span>
    </span>
  );
};

/**
 * Renders a component that wraps its children inside a span element with the class name "accent-text", 
 * which is used to style the text as an accent color.
 * 
 * @param {object} props - The properties object.
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the component.
 * @return {JSX.Element} The JSX code for the component.
 */
export const TextAccent = ({ children, ...props }) => {
  return (
    <span className='accent-text' {...props}>
      {children}
    </span>
  );
};

/**
 * Renders a component that wraps its children inside a span element with the class name "secondary-text", 
 * which is used to style the text as a secondary color.
 * 
 * @param {object} props - The properties object.
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the component.
 * @return {JSX.Element} The JSX code for the component.
 */
export const TextSecondary = ({ children, ...props }) => {
  return (
    <span className='secondary-text' {...props}>
      {children}
    </span>
  );
};

/**
 * Splits a given text into an array of strings, separated by new lines, and then maps over the array
 * to render each line as a separate div element. The key for each div is the index of the line
 * in the array.
 * 
 * @param {string} text - The text string to be formatted.
 * @returns {JSX.Element[]} An array of JSX elements, each of which is a div containing a line of text.
 */
export const formattedText = (text) =>
  text?.split('\n')?.map((line, index) => <div key={index}>{line}</div>);
