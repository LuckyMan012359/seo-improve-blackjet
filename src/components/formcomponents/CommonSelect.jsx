import { MenuItem, Select } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
const CommonSelect = ({
  options = [],
  trigger = () => {},
  onChange = () => {},
  register = () => {},
  name,
  setValue = () => {},
  error = false,
  placeholder = "",
  defaultValue = "",
  value = "",
  onChangeFn = () => {},
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (open && ref.current) {
      console.log(ref.current);
      ref.current.focus();
    }
  }, [open]);

  console.log(open, 'open__check');
  return (
    <Select
      ref={ref}
      value={value}
      onChange={(e) => {
        onChange(e);
        setValue(name, e.target.value);
        trigger(name);
        setOpen(false);
        onChangeFn();
        // setValueSelected(e.target.value)
      }}
      // IconComponent={(e) => {
      //   console.log(e, 'this_is_e');
      //   return open ? <KeyboardArrowUpIcon />  : <KeyboardArrowDownIcon />
      // }}
      displayEmpty
      inputProps={{ "aria-label": "Without label" }}
      className={`common-select ${error ? " red-error " : ""} ${
        value ? "value-selected" : ""
      }`}
      open={open}
      onClick={() => {
        setOpen(!open);
        onChangeFn();
      }}
    >
      <MenuItem value="">{placeholder}</MenuItem>
      {options?.map((option,) => (
        <MenuItem value={option?.value} key={option?.value}>{option?.label}</MenuItem>
      ))}
    </Select>
  );
};


export const CommonSelectV2 = ({
  options = [],
  trigger = () => {},
  onChange = () => {},
  register = () => {},
  name,
  setValue = () => {},
  error = false,
  placeholder = "",
  defaultValue = "",
  value = "",
  onChangeFn = () => {},
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (open && ref.current) {
      console.log(ref.current);
      ref.current.focus();
    }
  }, [open]);

  console.log(open, 'open__check');
  return (
    <Select
      ref={ref}
      value={value}
      onChange={(e) => {
        onChange(e);
        setValue(name, e.target.value);
        trigger(name);
        setOpen(false);
        onChangeFn();
        // setValueSelected(e.target.value)
      }}
      IconComponent={(e) => {
        return open ? <KeyboardArrowUpIcon />  : <KeyboardArrowDownIcon />
      }}
      displayEmpty
      inputProps={{ "aria-label": "Without label" }}
      className={`common-selectV2 ${error ? " red-error " : ""} ${
        value ? "value-selected" : ""
      }`}
      open={open}
      onClick={() => {
        setOpen(!open);
        onChangeFn();
      }}
    >
      <MenuItem value="">{placeholder}</MenuItem>
      {options?.map((option,) => (
        <MenuItem value={option?.value} key={option?.value}>{option?.label}</MenuItem>
      ))}
    </Select>
  );
};

export default CommonSelect;
