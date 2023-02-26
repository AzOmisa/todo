import React from 'react';

import Timer from '../timer';

export default function Task({
  description,
  completed,
  leftTime,
  destroyTask,
  editTask,
  completeTask,
  min,
  sec,
  onPlay,
  onPause,
}) {
  return (
    <div className="view">
      <input className="toggle" type="checkbox" onChange={completeTask} checked={completed} />
      <label>
        <span className="title" onClick={completeTask}>
          {description}
        </span>
        <Timer min={min} sec={sec} onPlay={onPlay} onPause={onPause} />
        <span className="description">{leftTime}</span>
      </label>
      <button className="icon icon-edit" onClick={editTask}></button>
      <button className="icon icon-destroy" onClick={destroyTask}></button>
    </div>
  );
}
