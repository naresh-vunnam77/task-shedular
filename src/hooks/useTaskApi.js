import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:7070/api/v1/tasks';

const useTaskApi = (token) => {
  const [task, setTask] = useState({})
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.data;
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError(error.message || 'Error fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  const memoizedFetchTasks = useMemo(() => fetchTasks, [fetchTasks]);

  useEffect(() => {
    memoizedFetchTasks();
  }, [memoizedFetchTasks]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      memoizedFetchTasks();
    }, 6000);
    return () => clearInterval(intervalId);
  }, [memoizedFetchTasks]);


  const createTask = async (newTask) => {
    try {
      const response = await axios.post(API_BASE_URL, newTask, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const createdTask = response.data.data;
      setTasks((prevTasks) => [...prevTasks, createdTask]);
    } catch (error) {
      console.error('Error creating task:', error);
      setError(error.message || 'Error creating task');
    }
  };

  const updateTask = async (taskId, updatedTask) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${taskId}`, updatedTask, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const updatedTaskData = response.data.data;
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? { ...task, ...updatedTaskData } : task))
      );
    } catch (error) {
      console.error('Error updating task:', error);
      setError(error.message || 'Error updating task');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_BASE_URL}/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      setError(error.message || 'Error deleting task');
    }
  };

  const fetchTaskById = async (taskId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const task = response.data.data;
      setTask(task)
    } catch (error) {
      console.error(`Error fetching task with ID ${taskId}:`, error);
      throw new Error(error.message || `Error fetching task with ID ${taskId}`);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    fetchTasks: memoizedFetchTasks,
    fetchTaskById,
  };
};

export default useTaskApi;
