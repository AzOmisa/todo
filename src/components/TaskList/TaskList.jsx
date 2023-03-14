import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Input from '../Input';
import Task from '../Task';

export default function TaskList({ tasksData, destroyTask, editTask, onEditTask, completeTask, onPlay, onPause }) {
  const elements = tasksData.map((item) => {
    const { description, id, leftTime, done, hidden, editing, timer } = item;
    let className = classNames({
      hidden: hidden,
      completed: done && !editing,
      editing: editing,
    });
    let input = editing ? <Input type="text" handler={onEditTask} id={id} value={description} autoFocus /> : null;
    return (
      <li key={id} className={className}>
        <Task
          description={description}
          leftTime={leftTime}
          destroyTask={() => destroyTask(id)}
          completeTask={(e) => {
            completeTask(id);
            e.stopPropagation;
          }}
          editTask={() => editTask(id)}
          done={done}
          timer={timer}
          onPlay={() => onPlay(id)}
          onPause={() => onPause(id)}
        />
        {input}
      </li>
    );
  });
  return <ul className="todo-list">{elements}</ul>;
}
TaskList.propTypes = {
  tasksData: PropTypes.array.isRequired,
  destroyTask: PropTypes.func.isRequired,
  editTask: PropTypes.func.isRequired,
  onEditTask: PropTypes.func.isRequired,
  completeTask: PropTypes.func.isRequired,
  onPlay: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
};
