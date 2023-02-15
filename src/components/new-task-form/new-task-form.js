import React from 'react';
export default class NewTaskForm extends React.Component {
  state = {
    item: this.props.value,
  };
  createNewTodo = (e) => {
    this.setState({
      item: e.target.value,
    });
  };
  submitItem = (e) => {
    if (e.key === 'Enter' && e.target.value !== '') {
      const { id, value } = this.props;
      const { item } = this.state;
      if (!value) {
        this.props.handler(item);
        this.setState({
          item: '',
        });
      }
      this.props.handler(id, item);
    }
  };
  render() {
    return (
      <input
        type="text"
        className={this.props.className}
        placeholder={this.props.placeholder}
        onChange={this.createNewTodo}
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
