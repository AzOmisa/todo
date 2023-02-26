import React from 'react';
import classNames from 'classnames';

import Task from '../task';
import Input from '../input';

export default function TaskList({ tasksData, destroyTask, editTask, onEditTask, completeTask, onPlay, onPause }) {
  let elements = tasksData.map((item) => {
    const { id, description, leftTime, completed, hidden, editing, min, sec } = item;
    let className = classNames({
      completed: completed && !editing,
      editing: editing,
    });
    if (hidden) return '';
    let input = editing ? <Input type="text" handler={onEditTask} id={id} value={description} /> : null;
    return (
      <li key={id} className={className}>
        <Task
          description={description}
          leftTime={leftTime}
          destroyTask={() => destroyTask(id)}
          completeTask={() => completeTask(id)}
          editTask={() => editTask(id)}
          completed={completed}
          min={min}
          sec={sec}
          onPlay={() => onPlay(id)}
          onPause={() => onPause(id)}
        />
        {input}
      </li>
    );
  });
  return <ul className="todo-list">{elements}</ul>;
}
