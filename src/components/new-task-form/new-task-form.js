import React from 'react';
export default class NewTaskForm extends React.Component {
  state = {
    item: this.props.value,
  };
  createNewTask = (e) => {
    this.setState({
      item: e.target.value,
    });
  };
  submitTask = (e) => {
    if (e.key === 'Enter' && e.target.value !== '') {
      const { id, handler } = this.props;
      const { item } = this.state;
      if (!id) {
        handler(item);
        return this.setState({
          item: '',
        });
      }
      handler(id, item);
    }
  };
  render() {
    return (
      <input
        type="text"
        className={this.props.className}
        placeholder={this.props.placeholder}
        onChange={this.createNewTask}
        autoFocus
        onKeyUp={this.submitTask}
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
