import React from 'react';

export default function Task({ description, completed, leftTime, destroyTask, editTask, completeTask }) {
  return (
    <div className="view">
      <input className="toggle" type="checkbox" onChange={completeTask} checked={completed} />
      <label>
        <span className="description" onClick={completeTask}>
          {description}
        </span>
        <span className="created">{leftTime}</span>
      </label>
      <button className="icon icon-edit" onClick={editTask}></button>
      <button className="icon icon-destroy" onClick={destroyTask}></button>
    </div>
  );
}
