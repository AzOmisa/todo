import React, { useEffect, useState } from 'react';
export default function Input({ value, className, placeholder, type, form, id, handler, autoFocus }) {
  const [item, setItem] = useState(value);
  let onChange = (e) => {
    setItem(e.target.value);
  };
  let onSubmit = (e) => {
    if (e.key === 'Enter' && e.target.value !== '') {
      handler(id, item);
    }
  };
  if (form) {
    useEffect(() => setItem(value));
    onSubmit = null;
  }
  return (
    <input
      type={type}
      className={className}
      placeholder={placeholder}
      onChange={onChange}
      onKeyUp={onSubmit}
      value={item}
      autoFocus={autoFocus}
    />
  );
}
Input.defaultProps = {
  className: 'edit',
  value: '',
  autoFocus: false,
};
