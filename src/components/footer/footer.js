import React from 'react';

import TasksFilter from '../tasks-filter';
export default function Footer({ selectedFilter, leftItems, clearCompleted, onFilterClick }) {
  return (
    <footer className="footer">
      <span className="todo-count">{leftItems} items left</span>
      <TasksFilter selectedFilter={selectedFilter} onFilterClick={onFilterClick} />
      <button className="clear-completed" onClick={clearCompleted}>
        Clear completed
      </button>
    </footer>
  );
}
