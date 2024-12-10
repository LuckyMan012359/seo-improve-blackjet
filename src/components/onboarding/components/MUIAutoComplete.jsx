import { styled } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Autocomplete, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';


const MUIAutocompleteField = styled(Autocomplete)(({ theme }) => ({
  position: 'relative',
  border: 'none',
  '& .MuiAutocomplete-input': {
    padding: 'inherit !important',
    fontSize: '14px',
    color: '#BFBFBF',
  },
  '& .MuiAutocomplete-listbox': {
    color: '#F2F2F2 !important',
  },
  '& .MuiFormControl-root': {
    backgroundColor: '#333333 !important',
    borderRadius: '5px',
    '&:focus-visible': {
      border: 'none !important',
      outline: 'none !important',
    },
  },
  '& input, .MuiOutlinedInput-notchedOutline': {
    border: 'none',
    outline: 'none', // Remove outline
    '&::focus': {
      // Target the focused state
      border: 'none', // Remove focus border
      boxShadow: 'none', // Remove default focus box-shadow
    },
    '&:hover': {
      border: 'none !important',
      outline: 'none !important',
      boxShadow: 'none !important',
    },
  },
  '& .MuiOutlinedInput-root': {
    // Target the outlined input root
    outline: 'none', // Remove outline
    '&::focus': {
      // Target the focused state
      border: 'none', // Remove focus border
      boxShadow: 'none', // Remove default focus box-shadow
    },
  },
}));
export const MUIAutoComplete = ({
  options = [],
  trigger = () => {},
  onChange = () => {},
  register = () => {},
  name,
  setValue = () => {},
  error = false,
  placeholder = '',
  defaultValue = '',
  value = '',
  onChangeFn = () => {},
  setError,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const handleChange = (event, newValue) => {
    onChange(event);
    if (newValue?.label) {
      setValue(name, newValue?.label);
      trigger(name);
      setOpen(false);
      onChangeFn();
      return;
    }
    setValue(name, '');
    trigger(name);
  };

  /**
   * Handles the change event of the autocomplete input by setting the value to the event target's value.
   * If the value is not found in the options, it sets the error state for the field.
   * @param {object} event - The change event object.
   */
  const handleInputChange = (event) => {
    const { value } = event.target;
    setValue(name, value);
    const fullData = options.map((ele) => ele.label);
    const isInList = fullData.find((ele) => ele.toLowerCase() === value.toLowerCase());

    if (!isInList) {
      setError(name, {
        type: 'custom',
        message: `Oops! We couldn't find that country.  Please double-check your entry.`,
      });
      return;
    }
    trigger(name);
  };

  useEffect(() => {
    if (open && ref.current) {
      ref.current.focus();
    }
  }, [open]);

  return (
    <div>
      <MUIAutocompleteField
        popupIcon={<KeyboardArrowDownIcon />}
        noOptionsText={null}
        freeSolo={true}
        defaultValue={'Australia'}
        disablePortal
        id='combo-box-demo'
        className={`common-select ${error ? ' red-error ' : ''} ${value ? 'value-selected' : ''}`}
        options={options}
        onChange={handleChange}
        renderInput={(params) => <TextField {...params} onChange={handleInputChange} />}
      />
    </div>
  );
};
