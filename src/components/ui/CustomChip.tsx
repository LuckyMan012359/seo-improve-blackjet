const CustomChip = ({ label = '', ...props }) => {
  if (!label) return null;
  return (
    <div className={`custom-chip ${props.className || ''}`} {...props}>
      {label}
    </div>
  );
};

export default CustomChip;
