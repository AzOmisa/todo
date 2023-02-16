import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { v4 } from 'uuid';

import NewTaskForm from '../new-task-form';
import TaskList from '../task-list';
import Footer from '../footer';
import filtersNames from '../constants';

import Storage from './storage';

export default class App extends React.Component {
  state = {
    tasksData: [],
    selectedFilter: filtersNames.all,
  };
  local = new Storage(localStorage);
  componentDidMount() {
    if (this.local.getItem('data')) {
      const { taskData, selectedFilter } = JSON.parse(this.local.getItem('data'));
      this.setState(() => {
        return {
          tasksData: taskData,
          selectedFilter: selectedFilter,
        };
      });
    }
  }
  componentDidUpdate() {
    const data = {
      taskData: this.state.tasksData,
      selectedFilter: this.state.selectedFilter,
    };
    this.local.setItem('data', JSON.stringify(data));
  }
  createNewTask = (description) => {
    const now = new Date().setTime(Date.now());
    const newEl = {
      id: v4(),
      description: description,
      created: now,
      leftTime: 'created less than 5 seconds ago',
      completed: false,
      hidden: false,
      editing: false,
    };
    const newArr = this.updateCreatedTime([newEl, ...this.state.tasksData.slice()]);
    this.setState(() => {
      return { tasksData: this.filteredView(this.state.selectedFilter, newArr) };
    });
  };
  updateCreatedTime = (arr) => {
    arr.forEach((item) => {
      item.leftTime =
        'created ' +
        formatDistanceToNow(item.created, {
          addSuffix: true,
          includeSeconds: true,
        });
    });
    return arr;
  };
  onEditTask = (id, newDescription) => {
    let newTasksData = this.state.tasksData.map((item) => {
      if (item.id === id) {
        item.description = newDescription;
        item.editing = false;
      }
      return item;
    });
    this.setState(() => {
      return { tasksData: this.updateCreatedTime(newTasksData) };
    });
  };
  editTask = (id) => {
    let newTasksData = this.state.tasksData.map((item) => {
      if (item.id === id) {
        item.editing = !item.editing;
      }
      return item;
    });
    this.setState(() => {
      return { tasksData: this.updateCreatedTime(newTasksData) };
    });
  };
  destroyTask = (id) => {
    let newTasksData = this.state.tasksData.filter((item) => item.id !== id);
    this.setState(() => {
      return { tasksData: this.updateCreatedTime(newTasksData) };
    });
  };
  completeTask = (id) => {
    let newTasksData = this.state.tasksData.map((item) => {
      if (item.id === id) {
        item.completed = !item.completed;
      }
      return item;
    });
    const filter = this.state.selectedFilter;
    this.setState(() => {
      return { tasksData: this.updateCreatedTime(this.filteredView(filter, newTasksData)) };
    });
  };
  clearCompleted = () => {
    let newTasksData = this.state.tasksData.filter((item) => !item.completed);
    this.setState(() => {
      return { tasksData: this.updateCreatedTime(newTasksData) };
    });
  };
  filteredView = (name, arr) => {
    let newTasksData;
    const { all, active, completed } = filtersNames;
    switch (name) {
      case all:
        newTasksData = [...arr];
        newTasksData.forEach((item) => (item.hidden = false));
        break;
      case active:
        newTasksData = arr.map((item) => {
          item.completed ? (item.hidden = true) : (item.hidden = false);
          return item;
        });
        break;
      case completed:
        newTasksData = arr.map((item) => {
          item.completed ? (item.hidden = false) : (item.hidden = true);
          return item;
        });
        break;
      default:
        break;
    }
    return newTasksData;
  };
  onFilterClick = (name) => {
    let newTasksData = this.filteredView(name, this.state.tasksData);
    this.setState(() => {
      return {
        tasksData: this.updateCreatedTime(newTasksData),
        selectedFilter: name,
      };
    });
  };
  render() {
    const leftItems = this.state.tasksData.filter((item) => !item.completed).length;
    const { tasksData, selectedFilter } = this.state;
    return (
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <NewTaskForm
            className="new-todo"
            placeholder="What needs to be done?"
            id={this.number}
            handler={this.createNewTask}
          />
        </header>
        <TaskList
          tasksData={tasksData}
          editTask={this.editTask}
          destroyTask={this.destroyTask}
          completeTask={this.completeTask}
          onEditTask={this.onEditTask}
        />
        <Footer
          selectedFilter={selectedFilter}
          leftItems={leftItems}
          onFilterClick={this.onFilterClick}
          clearCompleted={this.clearCompleted}
        />
      </section>
    );
  }
}
