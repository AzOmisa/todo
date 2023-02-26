import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { v4 } from 'uuid';

import Form from '../form';
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
    this.timerIds = {};
    if (this.local.getItem('data')) {
      let { taskData, selectedFilter } = JSON.parse(this.local.getItem('data'));
      const newTasksData = taskData.map((item) => {
        if (item.timerIsRun) {
          item.timerIsRun = false;
        }
        return item;
      });
      this.setState(() => {
        return {
          tasksData: this.updateCreatedTime(newTasksData),
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
  componentWillUnmount() {
    for (let key in this.timerIds) {
      clearInterval(this.timerIds[key]);
    }
    delete this.timerIds;
  }
  onMountTimerRunner = (arr) => {
    const newArr = arr.reduce((acc, item) => {
      return this.updateTimer(item.id, acc);
    }, arr);
    return newArr;
  };
  createNewTask = (description, min, sec) => {
    const now = new Date().setTime(Date.now());
    const [formatMin, formatSec] = this.format(min, sec);
    const newEl = {
      id: v4(),
      description: description,
      created: now,
      leftTime: 'created less than 5 seconds ago',
      completed: false,
      hidden: false,
      editing: false,
      min: formatMin,
      sec: formatSec,
      timerIsRun: false,
    };
    const newArr = this.updateCreatedTime([newEl, ...this.state.tasksData.slice()]);
    this.setState(() => {
      return { tasksData: this.filteredView(this.state.selectedFilter, newArr) };
    });
  };
  format = (min, sec) => {
    const secInMin = sec ? Math.trunc(sec / 60) : 0;
    const formatMin = min ? Number(min) + secInMin : secInMin;
    const formatSec = sec ? sec % 60 : 0;
    return [formatMin, formatSec];
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
        item.editing = true;
      }
      return item;
    });
    this.setState(() => {
      return { tasksData: this.updateCreatedTime(newTasksData) };
    });
  };
  destroyTask = (id) => {
    let newTasksData = this.state.tasksData.filter((item) => item.id !== id);
    this.state.tasksData.forEach((item) => {
      if (item.id === id && item.timerIsRun) {
        this.clearTimerInterval(item.id);
      }
    });
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
    const newTasksData = this.state.tasksData.filter((item) => !item.completed);
    let completedTasks = this.state.tasksData.filter((item) => item.completed);
    completedTasks.forEach((item) => {
      if (item.timerIsRun) {
        this.clearTimerInterval(item.id);
      }
    });
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
  updateTimer = (id) => {
    let item = this.state.tasksData.find((item) => item.id === id);
    let newTasksData;
    if (!item.min && !item.sec) {
      this.onPause(item.id);
      return false;
    }
    if (item.sec < 1) {
      newTasksData = this.state.tasksData.map((item) => {
        if (item.id === id) {
          item.min -= 1;
          item.sec = 59;
          item.timerIsRun = true;
        }
        return item;
      });
    } else {
      newTasksData = this.state.tasksData.map((item) => {
        if (item.id === id) {
          item.sec -= 1;
          item.timerIsRun = true;
        }
        return item;
      });
    }
    return newTasksData;
  };
  onPlay = (id) => {
    let item = this.state.tasksData.find((item) => item.id === id);
    if (item.timerIsRun) return;
    this.setTimerInterval(id);
  };
  setTimerInterval = (id) => {
    if (!this.updateTimer(id)) return;
    this.timerIds[id] = setInterval(() => {
      const newTasksData = this.updateTimer(id);
      this.setState(() => {
        return {
          tasksData: newTasksData,
        };
      });
    }, 1000);
  };
  clearTimerInterval = (id) => {
    clearInterval(this.timerIds[id]);
    delete this.timerIds[id];
  };
  onPause = (id) => {
    let item = this.state.tasksData.find((item) => item.id === id);
    if (!item.timerIsRun) return;
    this.clearTimerInterval(item.id);
    const newTasksData = this.state.tasksData.map((item) => {
      if (item.id === id) {
        item.timerIsRun = false;
      }
      return item;
    });
    this.setState(() => {
      return {
        tasksData: newTasksData,
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
          <Form handler={this.createNewTask} />
        </header>
        <TaskList
          tasksData={tasksData}
          editTask={this.editTask}
          destroyTask={this.destroyTask}
          completeTask={this.completeTask}
          onEditTask={this.onEditTask}
          onPlay={this.onPlay}
          onPause={this.onPause}
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
