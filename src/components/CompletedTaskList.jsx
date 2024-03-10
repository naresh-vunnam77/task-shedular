// components/CompletedTaskList.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import useTaskApi from '../hooks/useTaskApi';

const CompletedTaskList = () => {
  const token = localStorage.getItem('token');
  const { tasks, loading } = useTaskApi(token);

  // Filter completed tasks
  const completedTasks = tasks.filter((task) => task.status === 'completed');

  return (
    <div>
      { loading ? (
        <p className="text-gray-600">Loading completed tasks...</p>
      ) : completedTasks.length === 0 ? (
        <p className="text-gray-600">No completed tasks available.</p>
      ) : (
        <ul>
          { completedTasks.map((task) => (
            <li key={ task.id } className="mb-4 border rounded p-4 shadow-md w-96">
              <div className="flex justify-between items-center">
                <div>
                  <Link
                    to={ `/tasks/${task.id}` }
                    className="text-xl font-semibold hover:underline focus:outline-none focus:ring focus:border-blue-300"
                  >
                    { task.title }
                  </Link>
                  <p className="text-sm mt-2">Date: { new Date(task.dueDate).toLocaleDateString() }</p>
                  <p className="text-sm">{ task.description }</p>
                  <p className="text-sm">Status: Completed</p>
                </div>
              </div>
            </li>
          )) }
        </ul>
      ) }
    </div>
  );
};

export default CompletedTaskList;
