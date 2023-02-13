import React from 'react';
export default class NewTaskForm extends React.Component {
  state = {
    item: this.props.value,
  };
  newItem = (e) => {
    this.setState({
      item: e.target.value,
    });
  };
  submitItem = (e) => {
    if (e.code === 'Enter' && e.target.value !== '') {
      const { id, value } = this.props;
      if (!value) {
        this.props.handler(this.state.item);
        this.setState({
          item: '',
        });
      }
      this.props.handler(id, this.state.item);
    }
  };
  render() {
    return (
      <input
        type="text"
        className={this.props.className}
        placeholder={this.props.placeholder}
        onChange={this.newItem}
        autoFocus
        onKeyUp={this.submitItem}
        value={this.state.item}
      />
    );
  }
}
NewTaskForm.defaultProps = {
  className: 'edit',
  placeholder: undefined,
  value: '',
};
