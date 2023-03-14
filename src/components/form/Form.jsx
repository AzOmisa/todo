import React, { useState } from 'react';

import { formConstants } from '../../services/constants';
import Input from '../Input';

export default function Form({ handler }) {
  const [description, setDescription] = useState('');
  const [min, setMin] = useState('');
  const [sec, setSec] = useState('');
  const onSubmit = (e) => {
    if (e.key === 'Enter' && description) {
      const time = Number(min) * 60 + Number(sec);
      handler(description, time);
      setDescription('');
      setMin('');
      setSec('');
    }
  };
  const onChange = (e) => {
    switch (e.target.placeholder) {
      case formConstants.searchInput:
        setDescription(e.target.value);
        break;
      case formConstants.minInput:
        setMin(e.target.value);
        break;
      case formConstants.secInput:
        setSec(e.target.value);
        break;
      default:
        break;
    }
  };
  return (
    <form className="new-todo-form" onKeyUp={onSubmit} onChange={onChange}>
      <Input type="text" className="new-todo" placeholder={formConstants.searchInput} value={description} form />
      <Input type="number" className="new-todo-form__timer" placeholder={formConstants.minInput} value={min} form />
      <Input type="number" className="new-todo-form__timer" placeholder={formConstants.secInput} value={sec} form />
    </form>
  );
}
