import { keyValues } from "helpers";
import React, { memo, useState } from "react";

const CommonInput = ({
  placeholder = "",
  error = false,
  register = () => {},
  value,
  controlled = true,
  onChange = () => {},
  name,
  min,
  max,
  type = "text",
  onKeyDown = () => {},
  disabled = false,
  onBlur = () => {},
  inputMode = "text",
  readOnly = false,
  _handleFocus = () => {},
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => {
    setIsFocused(true);
    _handleFocus("");
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur();
    _handleFocus();
  };

  const handleKeyDown = (e) => {
    if (type === "number") {
      keyValues(e);
    }
    _handleFocus("")
    onKeyDown(e);
  };
  return (
    <>
      {controlled ? (
        <input
          placeholder={placeholder}
          className={`common-input ${
            isFocused && !error ? "focused-input" : ""
          } ${error ? " red-error " : ""}`}
          onChange={onChange}
          type={type}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          disabled={disabled}
          min={min}
          max={max}
          readOnly={readOnly}
          name={name}
          inputMode={type === "number" ? "numeric" : inputMode}
        />
      ) : (
        <input
          placeholder={placeholder}
          className={`common-input ${
            isFocused && !error ? "focused-input" : ""
          } ${error ? " red-error " : ""}`}
          {...register(name)}
          type={type}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          min={min}
          max={max}
          readOnly={readOnly}
          inputMode={type === "number" ? "numeric" : inputMode}
        />
      )}
    </>
  );
};

export default memo(CommonInput);
