// TaskList.js
import React, { useEffect, useState } from 'react';
import useTaskApi from '../hooks/useTaskApi';
import TaskDetailsModal from './TaskDetailsModal';

const TaskList = () => {
  const token = localStorage.getItem('token');
  const { tasks, loading, fetchTasks } = useTaskApi(token);
  const [timeRemaining, setTimeRemaining] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const updateRemainingTime = () => {
      tasks.forEach((task) => {
        const { days, hours, minutes } = calculateTimeRemaining(new Date(task.dueDate));
        setTimeRemaining((prevTimeRemaining) => ({
          ...prevTimeRemaining,
          [task.id]: { days, hours, minutes },
        }));
      });
    };

    // Initial update
    updateRemainingTime();

    // Update every minute
    const intervalId = setInterval(updateRemainingTime, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [tasks]);

  const calculateTimeRemaining = (dueDate) => {
    const now = new Date();
    const difference = dueDate - now;
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    return { days, hours, minutes };
  };

  const calculateElapsedTime = (dueDate) => {
    const now = new Date();
    const difference = now - dueDate;
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    return { days, hours, minutes };
  };

  const handleTaskDetailsClick = (task) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  const handleTaskUpdate = async () => {
    await fetchTasks();
  };

  const pendingTasks = tasks.filter((task) => task.status === 'pending');

  return (
    <div>
      { loading ? (
        <p>Loading tasks...</p>
      ) : pendingTasks.length === 0 ? (
        <p>No pending tasks available.</p>
      ) : (
        <ul>
          { pendingTasks.map((task) => {
            const { days, hours, minutes } = timeRemaining[task.id] || {};
            const { days: elapsedDays, hours: elapsedHours, minutes: elapsedMinutes } =
              calculateElapsedTime(new Date(task.dueDate));

            const isTimeElapsed = elapsedDays > 0 || elapsedHours > 0 || elapsedMinutes > 0;

            return (
              <li key={ task._id } className="mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xl font-semibold">{ task.title }</div>
                    { isTimeElapsed ? (
                      <p className="text-red-500">
                        Time elapsed: { elapsedDays }d { elapsedHours }h { elapsedMinutes }m
                      </p>
                    ) : (
                        <p className="text-green-500 text-sm">
                          { (days > 0) && `${days} ${days === 1 ? 'day' : 'days'}` }{ ' ' }
                          { (hours > 0) && `${hours} ${hours === 1 ? 'hour' : 'hours'}` }{ ' ' }
                          { (days === 0 && hours === 0 && minutes > 0) && `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}` } left
                          { (days === 0 && hours === 0 && minutes === 0) && 'Passed due date' }
                        </p>

                    ) }
                  </div>
                  <div>
                    <button
                      onClick={ () => handleTaskDetailsClick(task) }
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </li>
            );
          }) }
        </ul>
      ) }
      { selectedTask && (
        <TaskDetailsModal
          task={ selectedTask }
          onClose={ handleCloseModal }
          onTaskUpdate={ handleTaskUpdate }
        />
      ) }
    </div>
  );
};

export default TaskList;
