import React from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@mui/material';

const openTopVariants = {
  hidden: { opacity: 0, y: '100%' },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: '100%' },
};

/**
 * A component that wraps a Framer Motion div around its children if the
 * screen size is less than 700px. The div will animate in and out from the
 * top of the screen.
 *
 * @param {{ children: React.ReactElement }} props
 * @returns {React.ReactElement}
 */
const FramerMotion = ({ children, key }) => {
  const isMobile = useMediaQuery('(max-width : 699px)');

  if (isMobile) {
    return (
      <motion.div
        key={key}
        initial='hidden'
        animate='visible'
        exit='exit'
        style={{ minHeight: '100vh' }}
        variants={openTopVariants}
        transition={{ duration: 0.3 }}
        id='framer-motion'
        {...children.props}

      >
        {children}
      </motion.div>
    );
  }
  return <div>{children}</div>;
};

export default FramerMotion;
