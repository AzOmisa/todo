import React from 'react';

import Task from '../task';
import NewTaskForm from '../new-task-form';

export default function TaskList({ tasksData, destroyTask, editTask, updateEditedTask, completeTask }) {
  let elements = tasksData.map((item) => {
    const { id, description, leftTime, completed, hidden, editing } = item;
    if (hidden) return '';
    let li = undefined;
    if (completed) {
      li = 'completed';
    }
    if (editing) {
      li = 'editing';
      return (
        <li key={id} className={li}>
          <Task
            description={description}
            destroyTask={() => destroyTask(id)}
            completeTask={() => completeTask(id)}
            editTask={() => editTask(id)}
            completed={completed}
            leftTime={leftTime}
          />
          <NewTaskForm handler={updateEditedTask} id={id} value={description} />
        </li>
      );
    }
    return (
      <li key={id} className={li}>
        <Task
          description={description}
          leftTime={leftTime}
          destroyTask={() => destroyTask(id)}
          completeTask={() => completeTask(id)}
          editTask={() => editTask(id)}
          completed={completed}
        />
      </li>
    );
  });
  return <ul className="todo-list">{elements}</ul>;
}
