import { truncateText } from 'helpers';

import AttachFileIcon from '@mui/icons-material/AttachFile';
import ClearIcon from '@mui/icons-material/Clear';
import { useMediaQuery } from '@mui/material';
import { Resizable } from 're-resizable';
import { initialSize } from '../ChatBox';

/**
 * @function
 * @description This component is a Resizable container used to wrap the ChatArea in the ChatBox.
 * It is used to resize the ChatBox on the screen.
 * @param {Object} props Properties passed to the component.
 * @param {Node} props.children The children nodes to be rendered inside the Resizable container.
 * @param {Object} props.size The size of the Resizable container.
 * @param {function} props.setSize A function to be called when the Resizable container is resized.
 * @returns {Node} A Resizable container wrapping the children nodes.
 */
export const ChatArea = ({ children, size, setSize }) => {
  const isMobile = useMediaQuery('(max-width : 699px)');

  const _handleGetResize = (e, direction, ref, d) => {
    e.stopPropagation();
    setSize((prev) => {
      return {
        width: prev.width + d.width,
        height: prev.height + d.height,
      };
    });
  };

  return (
    <Resizable
      defaultSize={size}
      minHeight={isMobile ? '100vh' : initialSize.height}
      minWidth={isMobile ? '100vw' : initialSize.width}
      // maxHeight={'100vh'}
      // maxWidth={'100vw'}
      onResizeStop={_handleGetResize}
      enable={{
        right: false,
        top: isMobile ? false : true,
        bottom: isMobile ? false : true,
        left: isMobile ? false : true,
      }}
      style={{
        boxSizing: 'border-box',
      }}
      className='flex'
    >
      {children}
    </Resizable>
  );
};

/**
 * A functional component that renders an attached file.
 *
 * @param {object} data An object containing the file details.
 * @param {function} handleClearFile A function to be called when the user clicks the clear icon.
 * @returns {Node} A JSX node representing the attached file.
 */
export const AttachedFile = ({ data, handleClearFile }) => {
  return (
    <>
      {data?.media?.map((ele, index) => {
        return (
          <div>
            <div className='attach-container'>
              <AttachFileIcon className='rotate-45' />
              <p className='attach-text'>{truncateText(ele?.name, 20)}</p>
              <ClearIcon
                className='attach-clear-icon'
                onClick={(e) => handleClearFile(e, ele, index)}
              />
            </div>
          </div>
        );
      })}
    </>
  );
};
