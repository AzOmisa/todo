import React from 'react';
export default class Input extends React.Component {
  state = {
    item: this.props.value,
  };
  onChange = (e) => {
    this.setState({
      item: e.target.value,
    });
  };
  onSubmit = (e) => {
    if (e.key === 'Enter' && e.target.value !== '') {
      let { id, handler } = this.props;
      const { item } = this.state;
      if (handler) {
        handler(id, item);
        this.setState({
          item: '',
        });
      }
    }
  };
  render() {
    const { className, placeholder, type, form, value } = this.props;
    let { item } = this.state;
    if (form) {
      item = value;
    }
    return (
      <input
        type={type}
        className={className}
        placeholder={placeholder}
        onChange={this.onChange}
        onKeyUp={this.onSubmit}
        value={item}
      />
    );
  }
}
Input.defaultProps = {
  className: 'edit',
  value: '',
};
