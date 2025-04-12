'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTasks, addTask, updateTask, deleteTask } from '../../firebase/services';

export function useTasks() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetchTasks = async () => {
      setLoading(true);
      const tasks = await getTasks(currentUser.uid);
      setTasks(tasks);
      setLoading(false);
    };

    fetchTasks();
  }, [currentUser]);

  const handleAddTask = async (taskData) => {
    const newTask = await addTask({
      ...taskData,
      userId: currentUser.uid
    });
    setTasks([...tasks, { id: newTask.id, ...taskData }]);
  };

  const handleUpdateTask = async (taskId, taskData) => {
    await updateTask(taskId, taskData);
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...taskData } : task
    ));
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return {
    tasks,
    loading,
    addTask: handleAddTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask
  };
}
  