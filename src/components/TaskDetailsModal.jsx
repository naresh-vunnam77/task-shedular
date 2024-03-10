// TaskDetailsModal.js
import React from 'react';
import useTaskApi from '../hooks/useTaskApi';

const TaskDetailsModal = ({ task, onClose }) => {
  const token = localStorage.getItem('token');
  const { deleteTask, updateTask } = useTaskApi(token);

  const handleCompleteTask = async () => {
    const updatedTask = { status: 'completed' };
    await updateTask(task._id, updatedTask);
    onClose();
  };

  const handleDeleteTask = async () => {
    await deleteTask(task._id);
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-8 rounded shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4">{ task.title }</h2>
        <p className="text-sm mb-4">{ task.description }</p>
        <div className="flex justify-end">
          <button
            onClick={ onClose }
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Close
          </button>
          <button
            onClick={ handleCompleteTask }
            className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300"
          >
            Complete
          </button>
          <button
            onClick={ handleDeleteTask }
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
