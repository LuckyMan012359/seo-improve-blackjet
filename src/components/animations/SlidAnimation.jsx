import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

/**
 * A Framer Motion component to animate a slide in/out transition.
 *
 * @param {boolean} open - Whether the component should be visible or not.
 * @param {React.ReactNode} children - The content to be animated.
 * @param {{}} [props] - Additional props to be passed to the motion component.
 *
 * @returns {React.ReactElement} A div containing the animated content.
 */
const SlidAnimation = ({ open, children, ...props }) => {
  return (
    <div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            {...props}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SlidAnimation;
