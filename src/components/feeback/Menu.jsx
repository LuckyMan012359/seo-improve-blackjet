const { useRef } = require('react');

/**
 * ListWithIcon
 *
 * @param {boolean} open
 * @param {{ title: string, icon: string, accept?: string, multiple?: boolean, onClick?: (e: React.MouseEvent) => void, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }} data
 * @param {boolean} [isInput=true]
 * @returns {JSX.Element}
 */
export const ListWithIcon = ({ open, data, isInput = true }) => {
  // const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleButtonClick = (e) => {
    if (!isInput) {
      data.onClick(e);
      return;
    }
    fileInputRef.current.click();
  };

  return (
    <div className='attach-file' onClick={handleButtonClick}>
      <input
        type='file'
        accept={data.accept}
        multiple={data.multiple}
        // onChange={data.onChange}
        onChange={(e) => data.onChange(e)}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
      <p>{data.title}</p>
      <img src={data.icon} alt={data.title} />
    </div>
  );
};
/**
 * ListWithIcon2
 *
 * @param {string} title
 * @param {string} icon
 * @param {{}} [props]
 * @returns {JSX.Element}
 */
export const ListWithIcon2 = ({ title, icon, ...props }) => {
  // const containerRef = useRef(null);

  return (
    <li className='attach-file' {...props}>
      <p>{title}</p>
      <img src={icon} alt={title} />
    </li>
  );
};
