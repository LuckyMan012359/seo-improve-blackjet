import React from 'react';
import { useMediaQuery } from '@mui/material';
import { TextAccent } from 'components/Text';
import { privateTerminals } from 'assets';

/**
 * PrivateTerminals component
 *
 * This component renders a section on the homepage that explains the
 * benefits of flying from private terminals with us.
 *
 * @returns {ReactElement} The rendered component
 */
const PrivateTerminals = () => {
  const isMobile = useMediaQuery('(max-width : 699px)');
  return (
    <div className='private-terminals-wrap'>
      <div className='private-terminals-left'>
        <div className='private-terminals-text'>
          {isMobile ? (
            <h2 className=''>
              Fly from <br /> Private Terminals
            </h2>
          ) : (
            <h2>
              {' '}
              Fly from <br /> Private Terminals{' '}
            </h2>
          )}

          <p>
            <TextAccent> Enjoy </TextAccent> a selection of{' '}
            <TextAccent> gourmet snacks </TextAccent>
            and <TextAccent> freshly brewed coffee </TextAccent> in our{' '}
            <TextAccent>exclusive lounge</TextAccent> before departure.
          </p>
          <p>
            <TextAccent> All our flights operate from private terminals</TextAccent>, ensuring a
            <TextAccent> serene ambiance</TextAccent>. Relish our{' '}
            <TextAccent>curated range</TextAccent> of <TextAccent> healthy treats </TextAccent> and{' '}
            <TextAccent> beverages </TextAccent> as you prepare for your journey
          </p>
        </div>
      </div>
      <div className='private-terminals-right'>
        <img src={privateTerminals} alt='' />
      </div>
    </div>
  ); 
};

export default PrivateTerminals;
