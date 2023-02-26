import React from 'react';

import Input from '../input';

export default class Form extends React.Component {
  _searchInput = 'What needs to be done?';
  _minInput = 'Min';
  _secInput = 'Sec';
  _stateNameDescription = 'description';
  _stateNameMin = 'min';
  _stateNameSec = 'sec';
  state = {
    description: '',
    min: undefined,
    sec: undefined,
  };
  onSubmit = (e) => {
    if (e.key === 'Enter' && this.state.description) {
      const { handler } = this.props;
      const { description, min, sec } = this.state;
      handler(description, min, sec);
      this.setState(() => {
        return { description: '', min: undefined, sec: undefined };
      });
    }
  };
  onChange = (e) => {
    let stateName;
    switch (e.target.placeholder) {
      case this._searchInput:
        stateName = this._stateNameDescription;
        break;
      case this._minInput:
        stateName = this._stateNameMin;
        break;
      case this._secInput:
        stateName = this._stateNameSec;
        break;
      default:
        break;
    }
    this.setState({ [stateName]: e.target.value });
  };
  render() {
    const { description, min, sec } = this.state;
    return (
      <form className="new-todo-form" onKeyUp={this.onSubmit} onChange={this.onChange}>
        <Input type="text" className="new-todo" placeholder={this._searchInput} value={description} form />
        <Input type="number" className="new-todo-form__timer" placeholder={this._minInput} value={min} form />
        <Input type="number" className="new-todo-form__timer" placeholder={this._secInput} value={sec} form />
      </form>
    );
  }
}
