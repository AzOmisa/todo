import React from 'react';
import classNames from 'classnames';

import filtersNames from '../constants';
export default function TasksFilter({ selectedFilter, onFilterClick }) {
  let filters = [];
  for (let key in filtersNames) {
    const filter = filtersNames[key];
    const className = classNames({
      selected: filter === selectedFilter,
    });
    filters.push(
      <li key={filter}>
        <button className={className} onClick={() => onFilterClick(filter)}>
          {filter}
        </button>
      </li>
    );
  }
  return <ul className="filters">{filters}</ul>;
}
