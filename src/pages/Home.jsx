import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../layouts/Layout';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import useTaskApi from '../hooks/useTaskApi';

const Home = () => {
  const [isTaskFormVisible, setIsTaskFormVisible] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { tasks, loading, createTask, updateTask, deleteTask, fetchTasks } = useTaskApi(token);

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggleTaskForm = () => {
    setIsTaskFormVisible(!isTaskFormVisible);
  };

  const handleTaskCreate = async (newTask) => {
    await createTask(newTask);
    handleToggleTaskForm()
    fetchTasks();
    navigate('/')
  };

  const handleTaskComplete = async (taskId) => {
    const updatedTask = { completed: true };
    await updateTask(taskId, updatedTask);
    fetchTasks(); // Fetch tasks again after updating a task
  };

  const handleTaskDelete = async (taskId) => {
    await deleteTask(taskId);
    fetchTasks(); // Fetch tasks again after deleting a task
  };

  return (
    <Layout>
      <div className="container mx-auto mt-8 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mx-2 md:mx-8 shadow-md p-5">
            <h2 className="text-2xl font-semibold mb-4">Task List</h2>
            { loading ? (
              <p>Loading tasks...</p>
            ) : (
              <TaskList
                tasks={ tasks }
                onTaskComplete={ handleTaskComplete }
                onTaskDelete={ handleTaskDelete }
              />
            ) }
          </div>
          <div>
            <button
              onClick={ handleToggleTaskForm }
              className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            >
              { isTaskFormVisible ? 'Hide Task Form' : 'Create Task' }
            </button>
            { isTaskFormVisible && <TaskForm onTaskCreate={ handleTaskCreate } /> }
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
