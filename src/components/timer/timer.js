import React from 'react';

export default function Timer({ min, sec, onPlay, onPause }) {
  const toStr = (num) => {
    if (!num) {
      return '00';
    }
    if (num < 10) {
      return '0' + String(num);
    }
    return String(num);
  };
  return (
    <span className="description">
      <button className="icon icon-play" onClick={onPlay} />
      <button className="icon icon-pause" onClick={onPause} />
      {toStr(min)}:{toStr(sec)}
    </span>
  );
}
