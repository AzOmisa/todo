import React from 'react';

import TasksFilter from '../TasksFilter';
export default function Footer({ selectedFilter, leftItems, clearDone, onFilterClick }) {
  return (
    <footer className="footer">
      <span className="todo-count">{leftItems} items left</span>
      <TasksFilter selectedFilter={selectedFilter} onFilterClick={onFilterClick} />
      <button className="clear-completed" onClick={clearDone}>
        Clear completed
      </button>
    </footer>
  );
}
