import React from 'react';
import PropTypes from 'prop-types';

export default function Task({
  description,
  done,
  leftTime,
  destroyTask,
  editTask,
  completeTask,
  timer,
  onPlay,
  onPause,
}) {
  const strTime = (time) => {
    let minutes = Math.floor(time / 60);
    minutes = String(minutes).length == 1 ? `0${minutes}` : minutes;
    let seconds = Math.floor(time % 60);
    seconds = String(seconds).length == 1 ? `0${seconds}` : seconds;
    return `${minutes}:${seconds}`;
  };
  return (
    <div className="view">
      <input className="toggle" type="checkbox" onChange={completeTask} checked={done} />
      <label>
        <span className="title" onClick={completeTask}>
          {description}
        </span>
        <span className="description">
          <button className="icon icon-play" onClick={onPlay} />
          <button className="icon icon-pause" onClick={onPause} />
          <span>{strTime(timer)}</span>
        </span>
        <span className="description">{leftTime}</span>
      </label>
      <button className="icon icon-edit" onClick={editTask}></button>
      <button className="icon icon-destroy" onClick={destroyTask}></button>
    </div>
  );
}
Task.propTypes = {
  description: PropTypes.string.isRequired,
  done: PropTypes.bool,
  leftTime: PropTypes.string,
  destroyTask: PropTypes.func.isRequired,
  editTask: PropTypes.func.isRequired,
  completeTask: PropTypes.func.isRequired,
  timer: PropTypes.number,
  onPlay: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
};
Task.defaultProps = {
  timer: 0,
};
