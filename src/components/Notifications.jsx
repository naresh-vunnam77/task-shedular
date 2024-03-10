import React, { useState, useEffect } from 'react';
import useTaskApi from '../hooks/useTaskApi';
import { calculateReminders } from '../helpers/reminder';

const Notification = ({ onClose, setReminderCount }) => {
  const token = localStorage.getItem('token');
  const { tasks, loading } = useTaskApi(token);
  const [reminders, setReminders] = useState([]);
  const pendingTasks = tasks.filter((task) => task.status === 'pending');
  useEffect(() => {
    if (!loading) {
      const upcomingReminders = calculateReminders(pendingTasks);
      setReminders(upcomingReminders);

      // Update the reminder count in the parent component (NavBar)
      setReminderCount(upcomingReminders.length);
    }
  }, [tasks, loading, setReminderCount]);

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="w-500 h-400 overflow-y-auto bg-white shadow p-4 rounded">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-800 font-semibold">Reminders</h2>
        <button onClick={ handleClose } className="text-gray-600 hover:text-gray-800 focus:outline-none">
          Close
        </button>
      </div>
      <div>
        { loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : reminders.length === 0 ? (
          <p className="text-gray-600">No reminders available.</p>
        ) : (
          reminders.map((reminder) => (
            <div key={ reminder.id } className="mb-4">
              <strong>{ reminder.title }</strong>
              <p className="text-gray-600">{ reminder.message }</p>
              <p className="text-gray-500">Date: { reminder.date }</p>
            </div>
          ))
        ) }
      </div>
    </div>
  );
};

export default Notification;
