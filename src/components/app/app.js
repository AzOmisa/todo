import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import NewTaskForm from '../new-task-form';
import TaskList from '../task-list';
import Footer from '../footer';

export default class App extends React.Component {
  state = {
    tasksData: [],
    selectedFilter: 'All',
  };
  componentDidMount() {
    if (localStorage.getItem('tasksData')) {
      this.setState(() => {
        return {
          tasksData: JSON.parse(localStorage.getItem('tasksData')),
          selectedFilter: JSON.parse(localStorage.getItem('selectedFilter')),
        };
      });
    }
  }
  componentDidUpdate() {
    localStorage.setItem('tasksData', JSON.stringify(this.state.tasksData));
    localStorage.setItem('selectedFilter', JSON.stringify(this.state.selectedFilter));
  }
  createNewTask = (id, description) => {
    const now = new Date().setTime(Date.now());
    const newEl = {
      id: uuidv4(),
      description: description,
      created: now,
      leftTime: 'created less than 5 seconds ago',
      completed: false,
      hidden: false,
      editing: false,
    };
    const newArr = this.updateCreatedTime([newEl, ...this.state.tasksData.slice()]);
    this.setState(() => {
      return { tasksData: newArr };
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
    let newArr = this.state.tasksData.map((item) => {
      if (item.id === id) {
        item.description = newDescription;
        item.editing = false;
      }
      return item;
    });
    this.setState(() => {
      return { tasksData: this.updateCreatedTime(newArr) };
    });
  };
  editTask = (id) => {
    let newArr = this.state.tasksData.map((item) => {
      if (item.id === id) {
        item.editing = !item.editing;
      }
      return item;
    });
    this.setState(() => {
      return { tasksData: this.updateCreatedTime(newArr) };
    });
  };
  destroyTask = (id) => {
    let newArr = this.state.tasksData.filter((item) => item.id !== id);
    newArr = this.updateCreatedTime(newArr);
    this.setState(() => {
      return { tasksData: newArr };
    });
  };
  completeTask = (id) => {
    let newArr = this.state.tasksData.map((item) => {
      if (item.id === id) {
        item.completed = !item.completed;
      }
      return item;
    });
    const filter = this.state.selectedFilter;
    this.setState(() => {
      return { tasksData: this.updateCreatedTime(this.filteredView(filter, newArr)) };
    });
  };
  clearCompleted = () => {
    let newArr = this.state.tasksData.filter((item) => !item.completed);
    this.setState(() => {
      return { tasksData: this.updateCreatedTime(newArr) };
    });
  };
  filteredView = (name, arr) => {
    let newTasksData;
    switch (name) {
      case 'All':
        newTasksData = [...arr];
        newTasksData.forEach((item) => (item.hidden = false));
        break;
      case 'Active':
        newTasksData = arr.map((item) => {
          item.completed ? (item.hidden = true) : (item.hidden = false);
          return item;
        });
        break;
      case 'Completed':
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
