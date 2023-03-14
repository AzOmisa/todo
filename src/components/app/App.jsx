import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { v4 } from 'uuid';

import Storage from '../../services';
import { filtersNames } from '../../services/constants';
import Footer from '../Footer';
import Form from '../Form';
import TaskList from '../TaskList';

export default function App() {
  const local = new Storage(localStorage);
  const [tasksData, setTasksData] = useState(() => {
    const saved = local.getItem('data');
    let initialValue = JSON.parse(saved);
    if (initialValue) {
      initialValue.forEach((item) => {
        item.timerIsRun = false;
        item.leftTime =
          'created ' +
          formatDistanceToNow(item.created, {
            addSuffix: true,
            includeSeconds: true,
          });
      });
    }
    return initialValue || [];
  });
  const [selectedFilter, setSelectedFilter] = useState(() => {
    const saved = local.getItem('filter');
    const initialValue = saved;
    return initialValue || filtersNames.all;
  });
  const [leftItems, setLeftItems] = useState(0);
  useEffect(() => {
    const counted = tasksData.filter((item) => !item.done).length;
    setLeftItems(counted);
  }, [tasksData]);
  useEffect(() => {
    local.setItem('data', JSON.stringify(tasksData));
    local.setItem('filter', selectedFilter);
  }, [tasksData, selectedFilter]);
  const createNewTask = (description, timer) => {
    const newEl = {
      id: v4(),
      description: description,
      created: new Date().setTime(Date.now()),
      leftTime: 'created less than 5 seconds ago',
      done: false,
      editing: false,
      hidden: false,
      timer: timer,
      timerIsRun: false,
    };
    let newTasksData = [newEl, ...tasksData];
    newTasksData = filteredView(selectedFilter, newTasksData);
    setTasksData(updateCreatedTime(newTasksData));
  };
  const updateCreatedTime = (arr) => {
    const newArr = [...arr];
    newArr.forEach((item) => {
      item.leftTime =
        'created ' +
        formatDistanceToNow(item.created, {
          addSuffix: true,
          includeSeconds: true,
        });
    });
    return newArr;
  };
  const onEditTask = (id, newDescription) => {
    const newTasksData = tasksData.map((item) => {
      if (item.id === id) {
        item.description = newDescription;
        item.editing = false;
      }
      return item;
    });
    setTasksData(updateCreatedTime(newTasksData));
  };
  const editTask = (id) => {
    const newTasksData = tasksData.map((item) => {
      if (item.id === id) {
        item.editing = true;
      }
      return item;
    });
    setTasksData(updateCreatedTime(newTasksData));
  };
  const destroyTask = (id) => {
    const newTasksData = tasksData.filter((item) => item.id !== id);
    setTasksData(updateCreatedTime(newTasksData));
  };
  const completeTask = (id) => {
    let newTasksData = tasksData.map((item) => {
      if (item.id === id) {
        item.done = !item.done;
      }
      return item;
    });
    newTasksData = filteredView(selectedFilter, newTasksData);
    setTasksData(updateCreatedTime(newTasksData));
  };
  const clearDone = () => {
    const newTasksData = tasksData.filter((item) => !item.done);
    setTasksData(updateCreatedTime(newTasksData));
  };
  const filteredView = (name, arr) => {
    let newTasksData;
    const { all, active, completed } = filtersNames;
    switch (name) {
      case all:
        newTasksData = arr.map((item) => {
          if (item.hidden) {
            item.hidden = false;
          }
          return item;
        });
        break;
      case active:
        newTasksData = arr.map((item) => {
          item.done ? (item.hidden = true) : (item.hidden = false);
          return item;
        });
        break;
      case completed:
        newTasksData = arr.map((item) => {
          item.done ? (item.hidden = false) : (item.hidden = true);
          return item;
        });
        break;
      default:
        break;
    }
    return newTasksData;
  };
  const onFilterClick = (name) => {
    setSelectedFilter(name);
    const newTasksData = filteredView(name, tasksData);
    setTasksData(updateCreatedTime(newTasksData));
  };
  const updateTimer = (id) => {
    const interval = setInterval(() => {
      setTasksData((prevData) => {
        const item = prevData.find((item) => item.id === id);
        if (!item || !item.timerIsRun) {
          clearInterval(interval);
          return prevData;
        }
        return prevData.map((item) => {
          if (item.id === id) {
            if (Number(item.timer) !== 0) {
              item.timer -= 1;
            } else {
              item.timerIsRun = false;
            }
          }
          return item;
        });
      });
    }, 1000);
  };
  const onPlay = (id) => {
    const task = tasksData.find((item) => item.id === id);
    if (task.timerIsRun) return;
    const newTasksData = tasksData.map((item) => {
      if (item.id === id) {
        if (!item.timerIsRun) {
          item.timerIsRun = true;
        }
      }
      return item;
    });
    setTasksData(newTasksData);
    updateTimer(id);
  };
  const onPause = (id) => {
    const newTasksData = tasksData.map((item) => {
      if (item.id === id) {
        if (item.timerIsRun) {
          item.timerIsRun = false;
        }
      }
      return item;
    });
    setTasksData(newTasksData);
  };
  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <Form handler={createNewTask} />
      </header>
      <TaskList
        tasksData={tasksData}
        editTask={editTask}
        destroyTask={destroyTask}
        completeTask={completeTask}
        onEditTask={onEditTask}
        onPlay={onPlay}
        onPause={onPause}
      />
      <Footer
        selectedFilter={selectedFilter}
        leftItems={leftItems}
        onFilterClick={onFilterClick}
        clearDone={clearDone}
      />
    </section>
  );
}
