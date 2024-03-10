// TaskForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatetimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import useTaskApi from '../hooks/useTaskApi';

const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'))
  const { loading, createTask } = useTaskApi(token);
  const navigate = useNavigate();

  const handleCreateTask = () => {
    const newTask = {
      title,
      description,
      dueDate: selectedDateTime,
      createdBy: user.id
    };

    createTask(newTask);

    setTitle('');
    setDescription('');
    setSelectedDateTime(new Date());
    navigate('/')
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Create Task</h2>
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Task Title"
          value={ title }
          onChange={ (e) => setTitle(e.target.value) }
          className="border p-2 rounded focus:outline-none focus:ring focus:border-blue-300"
        />
        <textarea
          placeholder="Task Description"
          value={ description }
          onChange={ (e) => setDescription(e.target.value) }
          className="border p-2 rounded focus:outline-none focus:ring focus:border-blue-300"
        />
        <DatetimePicker
          onChange={ (date) => setSelectedDateTime(date) }
          value={ selectedDateTime }
          className="border p-2 rounded focus:outline-none focus:ring focus:border-blue-300"
        />
        <button
          onClick={ handleCreateTask }
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
        >
          Create Task
        </button>
      </div>
    </div>
  );
};

export default TaskForm;
