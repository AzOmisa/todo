import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { filtersNames } from '../../services/constants';
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
TasksFilter.propTypes = {
  selectedFilter: PropTypes.string.isRequired,
  onFilterClick: PropTypes.func.isRequired,
};
