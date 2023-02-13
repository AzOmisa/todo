import React from 'react';
export default function TasksFilter({ selectedFilter, onFilterClick }) {
  const filterNames = ['All', 'Active', 'Completed'];
  const filters = filterNames.map((item) => {
    let className = undefined;
    if (item === selectedFilter) {
      className = 'selected';
    }
    return (
      <li key={item}>
        <button className={className} onClick={() => onFilterClick(item)}>
          {item}
        </button>
      </li>
    );
  });
  return <ul className="filters">{filters}</ul>;
}
