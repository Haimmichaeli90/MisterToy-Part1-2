// src/hooks/useForm.js

import { useState } from 'react';

export function useForm(initialState, onChange) {
  const [state, setState] = useState(initialState);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setState((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));

    if (onChange) onChange(name, newValue);  // אם יש פונקציה onChange, נקרא לה
  };

  const register = (name, type) => {
    return {
      name,
      type,
      value: state[name],
      onChange: handleChange
    };
  };

  return [register, state];
}
