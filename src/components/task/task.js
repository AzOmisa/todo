import React from 'react';

export default function Task({ description, completed, leftTime, destroyTask, editTask, completeTask }) {
  let handler = editTask;
  if (completed) {
    handler = undefined;
  }
  return (
    <div className="view">
      <input className="toggle" type="checkbox" onChange={completeTask} checked={completed} />
      <label>
        <span className="description" onClick={completeTask}>
          {description}
        </span>
        <span className="created">{leftTime}</span>
      </label>
      <button className="icon icon-edit" onClick={handler}></button>
      <button className="icon icon-destroy" onClick={destroyTask}></button>
    </div>
  );
}
